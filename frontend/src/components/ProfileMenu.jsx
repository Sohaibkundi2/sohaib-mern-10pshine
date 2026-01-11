// src/components/ProfileMenu.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import LogoutModal from "./LogoutModal"; 

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // User data with fallbacks
  const userData = {
    name: user?.fullName || "User",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || null,
    notesCount: user?.notesCount || 0,
    joinedDate: user?.createdAt 
      ? dayjs(user.createdAt).format("MMM YYYY")
      : "Recently"
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-sm font-semibold border-2 border-white/20 hover:border-white/40 transition focus:outline-none"
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
            {/* Backdrop to close menu when clicking outside (especially on mobile) */}
            <div
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setShowProfileMenu(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl shadow-2xl shadow-orange-500/20 overflow-hidden z-50"
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
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm text-white truncate">{userData.name}</p>
                    <p className="text-xs text-gray-300 truncate">{userData.email}</p>
                  </div>
                </div>
                
                {/* Mini Stats */}
                <div className="flex gap-4 mt-3 text-xs">
                  <div>
                    <span className="text-gray-400">Notes</span>
                    <p className="font-semibold text-orange-400">{userData.notesCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Joined</span>
                    <p className="font-semibold text-white">{userData.joinedDate}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button 
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm text-white"
                >
                  <User size={16} className="text-orange-400" />
                  <span>My Profile</span>
                </button>
                
                <button 
                  onClick={handleSettingsClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm text-white"
                >
                  <Settings size={16} className="text-orange-400" />
                  <span>Settings</span>
                </button>
                
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm text-white"
                >
                  <Bell size={16} className="text-orange-400" />
                  <span>Notifications</span>
                </button>
                
                <div className="border-t border-white/10 my-2"></div>
                
                <button 
                  onClick={() => {
                    setShowProfileMenu(false); // Close dropdown first
                    setShowLogoutConfirm(true); // Then open confirm modal
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/20 transition text-sm text-red-400"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
        {/* Logout Confirmation Modal */}
        
      <LogoutModal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={handleLogout} 
      />
    </div>
  );
}