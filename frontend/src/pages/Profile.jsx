// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, LogOut, Mail, Calendar, FileText, Star, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileAPI, notesAPI } from "../services/api";
import { theme } from "../utils/theme";
import Navbar from "../components/Navbar";
import LogoutModal from "../components/LogoutModal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Enable relativeTime plugin for fromNow()
dayjs.extend(relativeTime);

export default function Profile() {
  const navigate = useNavigate();
  const { user: contextUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notesStats, setNotesStats] = useState({ total: 0, favorites: 0 });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile and notes in parallel
      const [profileRes, notesRes] = await Promise.all([
        profileAPI.getProfile(),
        notesAPI.getAll()
      ]);
      
      setProfile(profileRes.data.data);
      
      // Calculate stats from notes
      const notes = notesRes.data.data || [];
      const totalNotes = notes.filter(n => !n.isArchived).length;
      const favoriteNotes = notes.filter(n => n.isFavorite && !n.isArchived).length;
      
      setNotesStats({ total: totalNotes, favorites: favoriteNotes });
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
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`${theme.textMuted} text-lg`}>Loading profile...</p>
        </div>
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
      <div className="pt-24 md:pt-28 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex items-center gap-2 ${theme.textMuted} hover:text-orange-400 mb-6 transition-colors`}
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`backdrop-blur-xl ${theme.card} border rounded-3xl overflow-hidden shadow-2xl mb-6`}
          >
            {/* Header Section with Gradient */}
            <div className="relative h-40 bg-gradient-to-r from-orange-600 via-pink-600 to-rose-600">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute -bottom-16 left-4 md:left-8">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  {userData?.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {userData?.fullName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 md:pt-24 p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
                <div className="flex-1">
                  <h1 className={`text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent mb-2`}>
                    {userData?.fullName || "User Name"}
                  </h1>
                  <p className={`${theme.textMuted} flex items-center gap-2`}>
                    <span className="text-orange-400">@</span>
                    {userData?.username || "username"}
                  </p>
                </div>
                
                <div className="flex gap-3 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/update-profile")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${theme.button} ${theme.buttonHover} text-white shadow-lg transition-all`}
                  >
                    <Edit size={18} />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </motion.button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 md:p-5 rounded-2xl ${theme.card} border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FileText size={20} className="text-orange-400" />
                    <span className="text-2xl md:text-3xl font-bold text-orange-400">{notesStats.total}</span>
                  </div>
                  <p className={`text-xs md:text-sm ${theme.textMuted}`}>Total Notes</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 md:p-5 rounded-2xl ${theme.card} border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-transparent`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Star size={20} className="text-pink-400" />
                    <span className="text-2xl md:text-3xl font-bold text-pink-400">{notesStats.favorites}</span>
                  </div>
                  <p className={`text-xs md:text-sm ${theme.textMuted}`}>Favorites</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 md:p-5 rounded-2xl ${theme.card} border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-transparent`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Calendar size={20} className="text-rose-400" />
                    <span className="text-base md:text-xl font-bold text-rose-400">
                      {userData?.createdAt
                        ? dayjs(userData.createdAt).format("YYYY")
                        : "2024"}
                    </span>
                  </div>
                  <p className={`text-xs md:text-sm ${theme.textMuted}`}>Joined Year</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 md:p-5 rounded-2xl ${theme.card} border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Shield size={20} className="text-purple-400" />
                    <span className="text-base md:text-xl font-bold text-purple-400 capitalize">
                      {userData?.role || "User"}
                    </span>
                  </div>
                  <p className={`text-xs md:text-sm ${theme.textMuted}`}>Account Type</p>
                </motion.div>
              </div>

              {/* Account Details */}
              <div className={`border-t ${theme.border} pt-6`}>
                <h3 className={`text-lg md:text-xl font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
                  <Mail size={20} className="text-orange-400" />
                  Account Information
                </h3>
                
                <div className="space-y-3 md:space-y-4">
                  <div className={`flex items-center justify-between p-3 md:p-4 rounded-xl ${theme.card} border`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Mail size={18} className="text-orange-400" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs ${theme.textMuted}`}>Email Address</p>
                        <p className={`${theme.text} font-medium text-sm md:text-base truncate`}>{userData?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between p-3 md:p-4 rounded-xl ${theme.card} border`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <Calendar size={18} className="text-pink-400" />
                      </div>
                      <div>
                        <p className={`text-xs ${theme.textMuted}`}>Joined On</p>
                        <p className={`${theme.text} font-medium text-sm md:text-base`}>
                          {userData?.createdAt
                            ? dayjs(userData.createdAt).format("MMMM D, YYYY")
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between p-3 md:p-4 rounded-xl ${theme.card} border`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Clock size={18} className="text-purple-400" />
                      </div>
                      <div>
                        <p className={`text-xs ${theme.textMuted}`}>Last Updated</p>
                        <p className={`${theme.text} font-medium text-sm md:text-base`}>
                          {userData?.updatedAt
                            ? dayjs(userData.updatedAt).fromNow()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <button
              onClick={() => navigate("/dashboard")}
              className={`p-5 rounded-2xl ${theme.card} border ${theme.cardHover} transition-all text-left group`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-semibold ${theme.text} mb-1 group-hover:text-orange-400 transition-colors`}>
                    View All Notes
                  </h4>
                  <p className={`text-sm ${theme.textMuted}`}>
                    Browse your {notesStats.total} notes
                  </p>
                </div>
                <FileText size={24} className="text-orange-400 group-hover:scale-110 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate("/update-profile")}
              className={`p-5 rounded-2xl ${theme.card} border ${theme.cardHover} transition-all text-left group`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-semibold ${theme.text} mb-1 group-hover:text-pink-400 transition-colors`}>
                    Update Profile
                  </h4>
                  <p className={`text-sm ${theme.textMuted}`}>
                    Change your account settings
                  </p>
                </div>
                <Edit size={24} className="text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}