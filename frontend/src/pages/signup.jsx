import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { authAPI } from "../services/api"

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

        // Validation
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

        // Create FormData for file upload
        const form = new FormData()
        form.append("fullName", fullName)
        form.append("username", username)
        form.append("email", email)
        form.append("password", password)
        form.append("avatar", avatar)

        try {
            setLoading(true)
            
            // Call signup API
            const response = await authAPI.signup(form)
            
            console.log('Signup response:', response.data)

            navigate("/login")
        } catch (err) {
            console.error('Registration error:', err)
            
            // Handle different error scenarios
            if (err.response) {
                // Server responded with error
                setError(err.response.data?.message || "Registration failed")
            } else if (err.request) {
                // Request made but no response
                setError("Cannot connect to server. Please check if backend is running.")
            } else {
                // Something else happened
                setError("An unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-orange-900/40 to-rose-900/30 px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-orange-500/20"
            >
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl shadow-lg shadow-rose-500/30"></div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                            Glass Notes
                        </span>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-center text-white mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-300 text-sm mb-6">
                    Join Glass Notes today
                </p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-xl text-center mb-4 backdrop-blur-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <label className="cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-2 border-dashed border-orange-500/50 flex items-center justify-center hover:border-orange-400 transition-all overflow-hidden">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl">📷</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-400 mt-2">Click to upload Profile Image</p>
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Sohaib Khan"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-orange-400 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="sohaib123"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-orange-400 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="sohaib@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-orange-400 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-orange-400 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-orange-400 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </motion.button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-300">
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