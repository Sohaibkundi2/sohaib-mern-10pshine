import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

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
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/signup`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            navigate("/login")
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className=" min-h-screen flex items-center justify-center  bg-gray-900">
            <div className="max-w-md mx-auto p-6 mt-10 rounded-2xl shadow-lg bg-gradient-to-br from-gray-950 via-slate-700 to-black">
                <h2 className="text-2xl font-semibold mb-4 text-center text-white">Register</h2>

                {error && (
                    <div className="bg-red-600 text-white text-sm p-2 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mt-3">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-white"
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-white"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-white"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-white"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-white"
                    />

                    <div>
                        <label className="text-sm text-gray-300">Avatar (required)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setAvatar(e.target.files[0])}
                            className="w-full mt-1 p-2 bg-gray-800 border border-gray-600 text-white rounded-xl"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 rounded-xl bg-white text-black font-medium disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="text-center text-sm text-gray-300">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-500 underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
