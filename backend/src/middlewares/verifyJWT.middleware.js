import jwt from 'jsonwebtoken'
import ApiError from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from './../models/user.model.js'
import logger from '../utils/logger.js'

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    logger.warn("JWT verification failed: token missing")
    throw new ApiError(401, 'Unauthorized')
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)
    if (!user) {
      logger.warn({ userId: decodedToken?._id }, "JWT failed: user not found")
      throw new ApiError(401, 'Unauthorized request')
    }

    req.user = user
    next()
  } catch (error) {
    logger.error({ err: error }, "JWT verification error")
    throw new ApiError(401, error?.message || 'Invalid access token')
  }
})

export { verifyJWT }
