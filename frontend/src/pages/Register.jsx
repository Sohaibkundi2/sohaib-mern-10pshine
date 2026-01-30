// src/pages/Register.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { User, AtSign, Mail, Lock, Eye, EyeOff, Upload, Feather } from "lucide-react"
import { authAPI } from "../services/api"
import { theme } from "../utils/theme"

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
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.background} px-4 py-8`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`max-w-md w-full p-8 rounded-3xl backdrop-blur-xl ${theme.card} border shadow-2xl`}
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg flex items-center justify-center`}>
                        <Feather className="text-white" size={24} />
                        </div>
                        <span className={`text-2xl font-bold ${theme.gradientText}`}>
                            Ilmora Writes
                        </span>
                    </div>
                </div>

                <h2 className={`text-2xl font-semibold text-center ${theme.text} mb-2`}>
                    Create Account
                </h2>
                <p className={`text-center ${theme.textMuted} text-sm mb-6`}>
                    Join Glass Notes today
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
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <label className="cursor-pointer group">
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-2 border-dashed ${theme.border} hover:border-orange-400 flex items-center justify-center transition-all overflow-hidden group-hover:scale-105`}>
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="text-orange-400" size={32} />
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                        <p className={`text-xs ${theme.textMuted} mt-2`}>Click to upload avatar</p>
                    </div>

                    <div>
                        <label className={`text-sm ${theme.textMuted} mb-1 block`}>Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-orange-500/50`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`text-sm ${theme.textMuted} mb-1 block`}>Username</label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="username"
                                placeholder="johndoe123"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-orange-500/50`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`text-sm ${theme.textMuted} mb-1 block`}>Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-3 pl-10 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all focus:ring-2 focus:ring-orange-500/50`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`text-sm ${theme.textMuted} mb-1 block`}>Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
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
                        <label className={`text-sm ${theme.textMuted} mb-1 block`}>Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                        {loading ? "Creating Account..." : "Register"}
                    </motion.button>

                    <div className="text-center pt-2">
                        <p className={`text-sm ${theme.textMuted}`}>
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
    )
}