// src/pages/Register.jsx
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { User, AtSign, Mail, Lock, Eye, EyeOff, Upload, Feather } from "lucide-react"
import { authAPI } from "../services/api"
import { theme } from "../utils/theme"
import Spline3DCharacter from "../components/Spline3DCharacter"

export default function Register() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [avatar, setAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (formData.fullName || formData.username || formData.email || formData.password || formData.confirmPassword) {
            setIsTyping(true)
            const timer = setTimeout(() => setIsTyping(false), 500)
            return () => clearTimeout(timer)
        }
    }, [formData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const { fullName, username, email, password, confirmPassword } = formData

        if (!fullName || !username || !email || !password || !confirmPassword || !avatar) {
            setError("All fields are required")
            return
        }

        if (!/^[a-zA-Z0-9_.]{3,15}$/.test(username)) {
            setError("Username must be 3–15 characters and contain no spaces or special characters")
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

        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            setError("Password must include uppercase, lowercase and a number")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        const form = new FormData()
        form.append("fullName", fullName)
        form.append("username", username)
        form.append("email", email)
        form.append("password", password)
        form.append("avatar", avatar)

        try {
            setLoading(true)
            await authAPI.signup(form)
            alert("Registration successful! Please login.")
            navigate("/login")
        } catch (err) {
            console.error('Registration error:', err)
            
            if (err.response) {
                setError(err.response.data?.message || "Registration failed")
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
            <div className="hidden lg:flex lg:w-1/2 h-screen items-center justify-center p-4">
                <div className="w-full h-full max-w-2xl">
                    <Spline3DCharacter 
                        isTyping={isTyping}
                        isPasswordFocused={isPasswordFocused}
                    />
                </div>
            </div>

            {/* Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`max-w-md w-full p-6 rounded-3xl backdrop-blur-xl ${theme.card} border shadow-2xl custom-border`}
                >
                    {/* Logo and Title - Side by Side */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg flex items-center justify-center`}>
                                <Feather className="text-white" size={20} />
                            </div>
                            <span className={`text-lg font-bold ${theme.gradientText}`}>
                                Ilmora Writes
                            </span>
                        </div>
                        <h2 className={`text-lg font-semibold ${theme.text}`}>
                            Create Account
                        </h2>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`${theme.error} text-xs p-2.5 rounded-lg text-center mb-3`}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className={`text-xs ${theme.textMuted} mb-1 block`}>Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 pl-9 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 text-sm outline-none transition-all focus:ring-2 focus:ring-[#d87091]`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`text-xs ${theme.textMuted} mb-1 block`}>Username</label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="johndoe123"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 pl-9 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 text-sm outline-none transition-all focus:ring-2 focus:ring-[#d87091]`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`text-xs ${theme.textMuted} mb-1 block`}>Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 pl-9 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 text-sm outline-none transition-all focus:ring-2 focus:ring-[#d87091]`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`text-xs ${theme.textMuted} mb-1 block`}>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    className={`w-full p-2.5 pl-9 pr-9 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 text-sm outline-none transition-all focus:ring-2 focus:ring-[#d87091]`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={`text-xs ${theme.textMuted} mb-1 block`}>Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 pl-9 pr-9 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 text-sm outline-none transition-all focus:ring-2 focus:ring-[#d87091]`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={`text-xs ${theme.textMuted} mb-1 block`}>Avatar</label>
                            <div className="relative">
                                <label className="cursor-pointer w-full block">
                                    <div className={`w-full p-2.5 pl-9 pr-3 rounded-xl ${theme.input} border ${theme.border} hover:border-orange-400 transition-all flex items-center justify-between`}>
                                        <div className="flex items-center gap-2">
                                            <Upload className="text-gray-400" size={16} />
                                            <span className={`text-sm ${avatar ? theme.text : 'text-gray-500'}`}>
                                                {avatar ? avatar.name : 'Click to upload avatar'}
                                            </span>
                                        </div>
                                        {avatarPreview && (
                                            <img 
                                                src={avatarPreview} 
                                                alt="Preview" 
                                                className="w-8 h-8 rounded-full object-cover border-2 border-orange-400"
                                            />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full p-2.5 rounded-xl ${theme.button} ${theme.buttonHover} text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all mt-4`}
                        >
                            {loading ? "Creating Account..." : "Register"}
                        </motion.button>

                        <div className="text-center pt-2">
                            <p className={`text-xs ${theme.textMuted}`}>
                                Already have an account?{" "}
                                <Link 
                                    to="/login" 
                                    className="text-orange-400 hover:text-orange-300 font-medium underline transition-colors"
                                >
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}