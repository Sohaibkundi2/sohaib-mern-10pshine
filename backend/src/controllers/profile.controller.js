import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  res.status(200).json(new ApiResponse(200, user, "Profile fetched"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(400, "At least one field is required");
  }

  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (email) updateData.email = email;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true }
  ).select("-password");

  logger.info({ userId: req.user._id, updateData }, "Profile updated");

  res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});


const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) throw new ApiError(400, "Both required");

  const user = await User.findById(req.user._id);
  const valid = await user.isPasswordCorrect(oldPassword);
  if (!valid) throw new ApiError(401, "Old password incorrect");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  logger.warn({ userId: req.user._id }, "Password updated");

  res.status(200).json(new ApiResponse(200, null, "Password updated"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    logger.warn("Avatar update failed: Avatar missing");
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    logger.error("Avatar update failed: Cloudinary upload error");
    throw new ApiError(500, "Avatar upload failed");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar.url },
    { new: true }
  ).select("-password -refreshToken -__v");

  logger.info({ userId: req.user._id, avatarUrl: avatar.url }, "Avatar updated");

  res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});


export { getCurrentUser, updateProfile, updatePassword, updateAvatar };
