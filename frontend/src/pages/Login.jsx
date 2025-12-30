import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

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

        setLoading(true)
        setTimeout(() => {
            const mockUser = { name: "Sohaib", email }
            localStorage.setItem("token", "mock-token-123")
            localStorage.setItem("user", JSON.stringify(mockUser))
            setLoading(false)
            navigate("/dashboard")
        }, 800)

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full p-6 rounded-2xl shadow-lg bg-gradient-to-br from-gray-950 via-slate-700 to-black">
                <h2 className="text-xl font-semibold text-center text-white mb-4">Login</h2>

                {error && (
                    <div className="bg-red-600 text-white text-sm p-2 rounded-lg text-center mb-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 text-white outline-none focus:border-white"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-900 border border-gray-600 text-white outline-none focus:border-white"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 rounded-xl bg-white text-black font-medium disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-sm text-gray-300">
                        No account?{" "}
                        <Link to="/register" className="text-blue-400 underline">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
