// src/pages/ForgotPassword.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle, Feather } from "lucide-react"
import { authAPI } from "../services/api"
import { theme } from "../utils/theme"
import Spline3DCharacter from "../components/Spline3DCharacter"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (email) {
            setIsTyping(true)
            const timer = setTimeout(() => setIsTyping(false), 500)
            return () => clearTimeout(timer)
        }
    }, [email])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess(false)

        if (!email) {
            setError("Email is required")
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address")
            return
        }

        try {
            setLoading(true)
            await authAPI.forgotPassword({ email })
            setSuccess(true)
        } catch (err) {
            console.error('Forgot password error:', err)
            
            if (err.response) {
                setError(err.response.data?.message || "Failed to send reset email")
            } else if (err.request) {
                setError("Cannot connect to server. Please check if backend is running.")
            } else {
                setError("An unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-between bg-[#0F1A32] relative overflow-hidden`}>
            
            {/* 3D Character - DESKTOP ONLY */}
            <div className="hidden lg:flex lg:w-1/2 h-screen items-center justify-center p-8">
                <div className="w-full h-full max-w-2xl">
                    <Spline3DCharacter 
                        isTyping={isTyping}
                        isPasswordFocused={false}
                    />
                </div>
            </div>

            {/* Forgot Password Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`max-w-md w-full p-8 rounded-3xl backdrop-blur-xl ${theme.card} border shadow-2xl custom-border`}
                >
                    <Link 
                        to="/login" 
                        className={`inline-flex items-center gap-2 ${theme.textMuted} hover:text-orange-400 transition-colors mb-6`}
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Login</span>
                    </Link>

                    <div className="flex justify-center mb-6">
                        <motion.div 
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div 
                                className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg flex items-center justify-center`}
                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Feather className="text-white" size={24} />
                            </motion.div>
                            <span className={`text-2xl font-bold ${theme.gradientText}`}>
                                Ilmora Writes
                            </span>
                        </motion.div>
                    </div>

                    {!success ? (
                        <>
                            <h2 className={`text-2xl font-semibold text-center ${theme.text} mb-2`}>
                                Forgot Password?
                            </h2>
                            <p className={`text-center ${theme.textMuted} text-sm mb-6`}>
                                No worries! Enter your email and we'll send you a reset link
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
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full p-3 pl-10 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-[#d87091]`}
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full p-3 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all`}
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
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
                                Check Your Email!
                            </h3>
                            <p className={`${theme.textMuted} text-sm mb-4`}>
                                We've sent a password reset link to:
                            </p>
                            <p className="text-orange-400 font-medium mb-6">
                                {email}
                            </p>
                            <p className={`${theme.textMuted} text-xs mb-6`}>
                                The link will expire in 10 minutes. Don't forget to check your spam folder!
                            </p>

                            <Link 
                                to="/login"
                                className={`inline-block px-6 py-3 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-medium shadow-lg transition-all`}
                            >
                                Back to Login
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}