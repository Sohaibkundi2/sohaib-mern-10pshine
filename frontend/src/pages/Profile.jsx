// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, LogOut, Mail, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileAPI } from "../services/api";
import dayjs from "dayjs";
import LogoutModal from "../components/LogoutModal";

export default function Profile() {
  const navigate = useNavigate();
  const { user: contextUser, logout } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.getProfile();
      setProfile(response.data.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-orange-900/40 to-rose-900/30 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-orange-900/40 to-rose-900/30 flex items-center justify-center p-4">
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  const userData = profile || contextUser;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-orange-900/40 to-rose-900/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20"
        >
          {/* Header Section */}
          <div className="relative h-32 bg-gradient-to-r from-orange-600 via-pink-600 to-rose-600">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-xl">
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {userData?.fullName?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userData?.fullName || "User Name"}
                </h1>
                <p className="text-gray-300">@{userData?.username || "username"}</p>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/update-profile")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-pink-500 text-white shadow-lg hover:shadow-orange-500/50 transition-all"
                >
                  <Edit size={18} />
                  <span className="hidden sm:inline">Edit Profile</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 transition-all"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Mail size={20} className="text-orange-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white">{userData?.email || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Calendar size={20} className="text-pink-400" />
                <div>
                  <p className="text-xs text-gray-400">Member Since</p>
                  <p className="text-white">
                    {userData?.createdAt
                      ? dayjs(userData.createdAt).format("MMMM D, YYYY")
                      : "Recently"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <FileText size={20} className="text-rose-400" />
                <div>
                  <p className="text-xs text-gray-400">Total Notes</p>
                  <p className="text-white font-semibold">
                    {userData?.notesCount || 0} notes
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Username</span>
                  <span className="text-white">@{userData?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Full Name</span>
                  <span className="text-white">{userData?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{userData?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Logout Confirmation Modal */}

      <LogoutModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={handleLogout} 
      />
    
    </div>
  );
}