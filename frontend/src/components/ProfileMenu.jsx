// src/components/ProfileMenu.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../utils/theme";
import LogoutModal from "./LogoutModal";
import dayjs from "dayjs";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Get user data with fallbacks
  const userData = {
    name: user?.fullName || "User",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || null,
    notesCount: user?.notesCount || 0,
    joinedDate: user?.createdAt 
      ? dayjs(user.createdAt).format("MMM YYYY")
      : "Recently"
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    setShowLogoutModal(true);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    navigate("/update-profile");
  };

  return (
    <div className="relative">
      {/* Profile Avatar Button */}
      <button 
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-sm font-semibold border-2 border-white/20 hover:border-white/40 transition"
      >
        {userData.avatar ? (
          <img 
            src={userData.avatar} 
            alt={userData.name} 
            className="w-full h-full rounded-full object-cover" 
          />
        ) : (
          userData.name.charAt(0).toUpperCase()
        )}
      </button>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {showProfileMenu && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setShowProfileMenu(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`absolute right-0 mt-2 w-64 backdrop-blur-xl ${theme.card} border rounded-2xl shadow-2xl overflow-hidden z-50`}
            >
              {/* Profile Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-br from-orange-600/40 to-rose-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-lg font-bold border-2 border-white/30 overflow-hidden">
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt={userData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userData.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${theme.text}`}>{userData.name}</p>
                    <p className={`text-xs ${theme.textMuted}`}>{userData.email}</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex gap-4 mt-3 text-xs">
                  <div>
                    <span className={theme.textMuted}>Notes</span>
                    <p className="font-semibold text-orange-400">{userData.notesCount}</p>
                  </div>
                  <div>
                    <span className={theme.textMuted}>Joined</span>
                    <p className={`font-semibold ${theme.text}`}>{userData.joinedDate}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button 
                  onClick={handleProfileClick}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm ${theme.text}`}
                >
                  <User size={16} className="text-orange-400" />
                  <span>My Profile</span>
                </button>
                
                <button 
                  onClick={handleSettingsClick}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm ${theme.text}`}
                >
                  <Settings size={16} className="text-orange-400" />
                  <span>Settings</span>
                </button>
                
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Add notification functionality later
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm ${theme.text}`}
                >
                  <Bell size={16} className="text-orange-400" />
                  <span>Notifications</span>
                </button>
                
                <div className={`border-t ${theme.border} my-2`}></div>
                
                <button 
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/20 transition text-sm text-red-400`}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}