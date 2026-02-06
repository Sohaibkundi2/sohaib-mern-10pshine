// src/pages/Login.jsx
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, Feather } from "lucide-react"
import { authAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { theme } from "../utils/theme"
import Spline3DCharacter from "../components/Spline3DCharacter"

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (email || password) {
            setIsTyping(true)
            const timer = setTimeout(() => setIsTyping(false), 500)
            return () => clearTimeout(timer)
        }
    }, [email, password])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!email || !password) {
            setError("Email and password are required")
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        try {
            setLoading(true)
            const response = await authAPI.login({ email, password })

            if (response.data.data?.accessToken && response.data.data?.user) {
                login(response.data.data.user, response.data.data.accessToken)
                navigate("/dashboard")
            } else {
                setError("Invalid response from server")
            }
        } catch (err) {
            console.error('Login error:', err)

            if (err.response) {
                setError(err.response.data?.message || "Login failed")
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
        <div className={`min-h-screen flex items-center justify-between bg-[#161F38] relative overflow-hidden`}>
            
            {/* 3D Character - DESKTOP ONLY */}
            <div className="hidden lg:flex lg:w-1/2 h-screen items-center justify-center p-8">
                <div className="w-full h-full max-w-2xl">
                    <Spline3DCharacter 
                        isTyping={isTyping}
                        isPasswordFocused={isPasswordFocused}
                    />
                </div>
            </div>

            {/* Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`max-w-md w-full p-8 rounded-3xl backdrop-blur-xl ${theme.card} border shadow-2xl custom-border`}
                >
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

                    <h2 className={`text-2xl font-semibold text-center ${theme.text} mb-2`}>
                        Welcome Back
                    </h2>
                    <p className={`text-center ${theme.textMuted} text-sm mb-6`}>
                        Login to access your notes
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
                            <label className={`text-sm ${theme.textMuted} mb-1 block`}>Email</label>
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

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className={`text-sm ${theme.textMuted}`}>Password</label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    className={`w-full p-3 pl-10 pr-10 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-[#d87091]`}
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

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full p-3 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </motion.button>

                        <div className="text-center pt-2">
                            <p className={`text-sm ${theme.textMuted}`}>
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                                >
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}