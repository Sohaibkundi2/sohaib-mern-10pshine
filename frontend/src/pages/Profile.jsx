// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, LogOut, Mail, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileAPI } from "../services/api";
import { theme } from "../utils/theme";
import Navbar from "../components/Navbar";
import LogoutModal from "../components/LogoutModal";
import dayjs from "dayjs";

export default function Profile() {
  const navigate = useNavigate();
  const { user: contextUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
      <div className={`min-h-screen bg-gradient-to-br ${theme.background} flex items-center justify-center`}>
        <div className={`${theme.text} text-xl`}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.background} flex items-center justify-center p-4`}>
        <div className={`${theme.error} p-4 rounded-xl`}>
          {error}
        </div>
      </div>
    );
  }

  const userData = profile || contextUser;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} text-white`}>
      {/* Navbar */}
      <Navbar showSearch={false} />

      {/* Main Content */}
      <div className="pt-20 p-4 md:p-8">

         <button
          onClick={() => navigate("/dashboard")}
          className={`flex items-center gap-2 ${theme.textMuted} hover:text-white m-2 md:m-5  md:mt-15 transition-colors`}
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

      <div className="max-w-4xl mx-auto">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-xl ${theme.card} border rounded-3xl overflow-hidden shadow-2xl`}
        >
          {/* Header Section */}
          <div className="relative h-32 bg-gradient-to-r from-orange-600 to-pink-600">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-xl">
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
                <h1 className={`text-3xl font-bold ${theme.text} mb-2`}>
                  {userData?.fullName || "User Name"}
                </h1>
                <p className={theme.textMuted}>@{userData?.username || "username"}</p>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/update-profile")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.button} ${theme.buttonHover} text-white shadow-lg transition-all`}
                >
                  <Edit size={18} />
                  <span className="hidden sm:inline">Edit Profile</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.error} border transition-all`}
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${theme.card} border`}>
                <Mail size={20} className="text-orange-400" />
                <div>
                  <p className={`text-xs ${theme.textMuted}`}>Email</p>
                  <p className={theme.text}>{userData?.email || "Not provided"}</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-xl ${theme.card} border`}>
                <Calendar size={20} className="text-pink-400" />
                <div>
                  <p className={`text-xs ${theme.textMuted}`}>Member Since</p>
                  <p className={theme.text}>
                    {userData?.createdAt
                      ? dayjs(userData.createdAt).format("MMMM D, YYYY")
                      : "Recently"}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-xl ${theme.card} border`}>
                <FileText size={20} className="text-rose-400" />
                <div>
                  <p className={`text-xs ${theme.textMuted}`}>Total Notes</p>
                  <p className={`${theme.text} font-semibold`}>
                    {userData?.notesCount || 0} notes
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className={`border-t ${theme.border} pt-6`}>
              <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Username</span>
                  <span className={theme.text}>@{userData?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Full Name</span>
                  <span className={theme.text}>{userData?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Email</span>
                  <span className={theme.text}>{userData?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
      </div>
    </div>
  );
}