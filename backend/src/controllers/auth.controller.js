import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body || {};

  if ([username, fullName, email, password].some((f) => !f || f.trim() === "")) {
    logger.warn("Register failed: Empty fields");
    throw new ApiError(400, "All fields are required");
  }

  const existUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email }],
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
    username: username.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url, 
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken -__v");

  res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password')

    if (!user) {
      throw new ApiError(404, 'User not found while generating tokens')
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    logger.error({ err: error }, 'Error while generating access and refresh tokens')
    throw new ApiError(500, 'Error while generating Tokens')
  }
}

// Login controller
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, 'User does not exist')
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials')
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')
  if (!loggedInUser) {
    throw new ApiError(500, 'Something went wrong while logging in')
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }

  logger.info({ userId: user._id }, 'User logged in successfully')

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
    )
})

// Refresh token controller
const generateAccessRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'refreshToken is required')
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, 'invalid refresh token')
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'invalid refresh token')
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id)

    logger.info({ userId: user._id }, 'New access and refresh token generated')

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
      )
  } catch (error) {
    logger.error({ err: error }, 'Error while creating access and refresh token')
    throw new ApiError(
      500,
      'Something went wrong while creating access and refresh token',
    )
  }
})

export { registerUser, 
  loginUser, 
  generateAccessRefreshToken ,
  generateAccessAndRefreshToken};