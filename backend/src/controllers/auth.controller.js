import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";
import crypto from 'crypto';
import sendEmail, { getPasswordResetEmailTemplate } from '../utils/sendEmail.js';
import { sanitizeEmail, sanitizeUsername } from '../utils/sanitize.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body || {};

  if ([username, fullName, email, password].some((f) => !f || f.trim() === "")) {
    logger.warn("Register failed: Empty fields");
    throw new ApiError(400, "All fields are required");
  }

  // Sanitize inputs to prevent NoSQL injection
  const sanitizedUsername = sanitizeUsername(username);
  const sanitizedEmail = sanitizeEmail(email);

  const existUser = await User.findOne({
    $or: [{ username: sanitizedUsername }, { email: sanitizedEmail }],
  });

  if (existUser) {
    logger.warn("Register failed: User exists");
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    logger.warn("Register failed: Avatar missing");
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    logger.error("Register failed: Cloudinary upload error");
    throw new ApiError(500, "Avatar upload failed");
  }

  const user = await User.create({
    username: sanitizedUsername,
    fullName: String(fullName).trim(),
    email: sanitizedEmail,
    password: String(password),
    avatar: avatar.url, 
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken -__v");

  res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new ApiError(404, 'User not found while generating tokens');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    logger.error({ err: error }, 'Error while generating access and refresh tokens');
    throw new ApiError(500, 'Error while generating Tokens');
  }
};

// Login controller
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // Sanitize email to prevent NoSQL injection
  const sanitizedEmail = sanitizeEmail(email);

  const user = await User.findOne({ email: sanitizedEmail });
  if (!user) {
    throw new ApiError(401, 'User does not exist');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');
  if (!loggedInUser) {
    throw new ApiError(500, 'Something went wrong while logging in');
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  logger.info({ userId: user._id }, 'User logged in successfully');

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully',
      ),
    );
});

// Refresh token controller
const generateAccessRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'refreshToken is required');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'invalid refresh token');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'invalid refresh token');
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    logger.info({ userId: user._id }, 'New access and refresh token generated');

    res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          'New access and refresh token generated successfully',
        ),
      );
  } catch (error) {
    logger.error({ err: error }, 'Error while creating access and refresh token');
    throw new ApiError(
      500,
      'Something went wrong while creating access and refresh token',
    );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    logger.warn("Logout failed: Unauthorized request");
    throw new ApiError(401, "Unauthorized");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: "" },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  logger.info({ userId: req.user._id }, "User logged out");

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});

// Forgot Password - Send reset email
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  // Sanitize email to prevent NoSQL injection
  const sanitizedEmail = sanitizeEmail(email);

  const user = await User.findOne({ email: sanitizedEmail });

  if (!user) {
    // Don't reveal if email exists or not (security best practice)
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        'If that email exists, a password reset link has been sent'
      )
    );
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    // Send email
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - Glass Notes',
      html: getPasswordResetEmailTemplate(resetUrl, user.fullName || user.username),
    });

    logger.info({ userId: user._id }, 'Password reset email sent');

    res.status(200).json(
      new ApiResponse(
        200,
        {},
        'Password reset link sent to your email'
      )
    );
  } catch (error) {
    // If email fails, clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.error({ err: error }, 'Error sending password reset email');
    throw new ApiError(500, 'Error sending email. Please try again later.');
  }
});

// Reset Password - Validate token and update password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, 'Password is required');
  }

  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  // Hash the token to compare with database
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid token that hasn't expired
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  // Update password (sanitized as string)
  user.password = String(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  
  // Increment refresh token version to invalidate all existing tokens
  user.refreshTokenVersion += 1;
  user.refreshToken = '';

  await user.save();

  logger.info({ userId: user._id }, 'Password reset successful');

  res.status(200).json(
    new ApiResponse(
      200,
      {},
      'Password reset successful. Please login with your new password.'
    )
  );
});

// Verify Reset Token - Check if token is valid (optional, for better UX)
const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  res.status(200).json(
    new ApiResponse(
      200,
      { email: user.email },
      'Token is valid'
    )
  );
});

export { 
  registerUser, 
  loginUser, 
  generateAccessRefreshToken,
  generateAccessAndRefreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyResetToken
};