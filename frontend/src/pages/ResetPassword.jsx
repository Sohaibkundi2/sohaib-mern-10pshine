// src/pages/ResetPassword.jsx
import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { authAPI } from "../services/api"
import { theme } from "../utils/theme"

export default function ResetPassword() {
    const navigate = useNavigate()
    const { token } = useParams()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [verifyingToken, setVerifyingToken] = useState(true)
    const [tokenValid, setTokenValid] = useState(false)

    // Verify token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                await authAPI.verifyResetToken(token)
                setTokenValid(true)
            } catch (err) {
                setTokenValid(false)
                setError("Invalid or expired reset link")
            } finally {
                setVerifyingToken(false)
            }
        }

        if (token) {
            verifyToken()
        } else {
            setVerifyingToken(false)
            setError("No reset token provided")
        }
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!password || !confirmPassword) {
            setError("All fields are required")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            setError("Password must include uppercase, lowercase and a number")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            setLoading(true)
            await authAPI.resetPassword(token, { password })
            setSuccess(true)

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login")
            }, 3000)
        } catch (err) {
            console.error('Reset password error:', err)

            if (err.response) {
                setError(err.response.data?.message || "Failed to reset password")
            } else if (err.request) {
                setError("Cannot connect to server. Please check if backend is running.")
            } else {
                setError("An unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    // Loading state while verifying token
    if (verifyingToken) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.background} px-4`}>
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className={theme.textMuted}>Verifying reset link...</p>
                </div>
            </div>
        )
    }

    // Invalid token state
    if (!tokenValid) {
        return (
            <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.background} px-4`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md w-full p-8 rounded-3xl backdrop-blur-xl ${theme.card} border shadow-2xl text-center`}
                >
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-red-400" size={40} />
                    </div>
                    <h2 className={`text-2xl font-semibold ${theme.text} mb-2`}>
                        Invalid Reset Link
                    </h2>
                    <p className={`${theme.textMuted} text-sm mb-6`}>
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link
                        to="/forgot-password"
                        className={`inline-block px-6 py-3 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-medium shadow-lg transition-all`}
                    >
                        Request New Link
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.background} px-4`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`max-w-md w-full p-8 rounded-3xl backdrop-blur-xl ${theme.card} border shadow-2xl`}
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg`}></div>
                        <span className={`text-2xl font-bold ${theme.gradientText}`}>
                            Glass Notes
                        </span>
                    </div>
                </div>

                {!success ? (
                    <>
                        <h2 className={`text-2xl font-semibold text-center ${theme.text} mb-2`}>
                            Reset Your Password
                        </h2>
                        <p className={`text-center ${theme.textMuted} text-sm mb-6`}>
                            Enter your new password below
                        </p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`${theme.error} text-sm p-3 rounded-xl text-center mb-4`}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`text-sm ${theme.textMuted} mb-1 block`}>
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full p-3 pl-10 pr-10 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-orange-500/50`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className={`text-sm ${theme.textMuted} mb-1 block`}>
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full p-3 pl-10 pr-10 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-orange-500/50`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full p-3 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all`}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </motion.button>
                        </form>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-orange-400" size={40} />
                        </div>

                        <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>
                            Password Reset Successful!
                        </h3>
                        <p className={`${theme.textMuted} text-sm mb-6`}>
                            Your password has been reset successfully. Redirecting to login...
                        </p>

                        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}