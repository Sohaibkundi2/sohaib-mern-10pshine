import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { authAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        // Validation
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
            
            console.log('Login response:', response.data)

            // Use auth context login
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-orange-900/40 to-rose-900/30 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-orange-500/20"
            >
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl shadow-lg shadow-rose-500/30"></div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                            Glass Notes
                        </span>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-center text-white mb-2">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-300 text-sm mb-6">
                    Login to access your notes
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
                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Email</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-orange-400 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? "Logging in..." : "Login"}
                    </motion.button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-300">
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
    )
}