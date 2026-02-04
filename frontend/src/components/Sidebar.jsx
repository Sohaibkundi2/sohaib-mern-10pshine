// src/components/Sidebar.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Star, Archive, FolderOpen, Feather, X } from "lucide-react";
import { theme } from "../utils/theme";

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeFilter,
  setActiveFilter,
  stats,
  user,
  onCreateNote,
  onNavigateAbout,
}) {
  const userData = user || { fullName: "User", email: "user@example.com" };

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 left-0 w-72 h-screen backdrop-blur-xl bg-gradient-to-b ${theme.sidebar} border-r border-white/10 pt-20 px-5 shadow-2xl z-50 md:hidden overflow-y-auto`}
            >
              {/* User Info */}
              <div className={`mb-6 p-4 rounded-2xl ${theme.card} border`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-lg font-bold border-2 border-white/30 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={userData.fullName} className="w-full h-full object-cover" />
                    ) : (
                      userData.fullName?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${theme.text}`}>{userData.fullName}</p>
                    <p className={`text-xs ${theme.textMuted}`}>{userData.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs border-t border-white/10 pt-3">
                  <div className="text-center">
                    <p className={theme.textMuted}>Total</p>
                    <p className="font-bold text-orange-400">{stats.total}</p>
                  </div>
                  <div className="text-center">
                    <p className={theme.textMuted}>Favorites</p>
                    <p className="font-bold text-pink-400">{stats.favorites}</p>
                  </div>
                  <div className="text-center">
                    <p className={theme.textMuted}>Archived</p>
                    <p className={`font-bold ${theme.text}`}>{stats.archived}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onCreateNote}
                className={`w-full py-3 rounded-xl ${theme.button} hover:opacity-90 border border-white/20 text-sm font-semibold transition shadow-lg mb-4`}
              >
                + Create New Note
              </button>

              {/* Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => { setActiveFilter("all"); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                    activeFilter === "all" 
                      ? "bg-orange-500/20 border border-orange-500/50 text-orange-400" 
                      : "hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <FolderOpen size={18} />
                  All Notes ({stats.total})
                </button>

                <button
                  onClick={() => { setActiveFilter("favorites"); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                    activeFilter === "favorites" 
                      ? "bg-pink-500/20 border border-pink-500/50 text-pink-400" 
                      : "hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <Star size={18} />
                  Favorites ({stats.favorites})
                </button>

                <button
                  onClick={() => { setActiveFilter("archived"); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${
                    activeFilter === "archived" 
                      ? "bg-gray-500/20 border border-gray-500/50 text-gray-300" 
                      : "hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <Archive size={18} />
                  Archived ({stats.archived})
                </button>
              </div>

              <div className="border-t border-white/10 my-4"></div>

              <div className="space-y-2">
                <button
                  onClick={onNavigateAbout}
                  className={`w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition text-sm ${theme.text}`}
                >
                  ℹ️ About
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        className={`hidden md:block fixed top-0 left-0 w-64 h-screen backdrop-blur-xl bg-gradient-to-b ${theme.sidebar} border-r border-white/10 pt-20 px-5 shadow-2xl overflow-y-auto`}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg flex items-center justify-center`}>
            <Feather className="text-white" size={24} />
          </div>
          <span className={`font-bold text-lg ${theme.text}`}>Ilmora Writes</span>
        </div>

        <button
          onClick={onCreateNote}
          className={`w-full py-3 rounded-xl ${theme.button} hover:opacity-90 border border-white/20 text-sm font-semibold transition shadow-lg mb-6`}
        >
          + Create New Note
        </button>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className={`p-3 rounded-lg ${theme.card} border text-center`}>
            <p className="text-2xl font-bold text-orange-400">{stats.total}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className={`p-3 rounded-lg ${theme.card} border text-center`}>
            <p className="text-2xl font-bold text-pink-400">{stats.favorites}</p>
            <p className="text-xs text-gray-400">Favorites</p>
          </div>
          <div className={`p-3 rounded-lg ${theme.card} border text-center`}>
            <p className="text-2xl font-bold text-amber-300">{stats.archived}</p>
            <p className="text-xs text-gray-400">Archived</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
              activeFilter === "all" 
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                : `${theme.textMuted} hover:bg-white/10`
            }`}
          >
            <FolderOpen size={18} />
            All Notes
          </button>

          <button
            onClick={() => setActiveFilter("favorites")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
              activeFilter === "favorites" 
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/30" 
                : `${theme.textMuted} hover:bg-white/10`
            }`}
          >
            <Star size={18} />
            Favorites
          </button>

          <button
            onClick={() => setActiveFilter("archived")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
              activeFilter === "archived" 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" 
                : `${theme.textMuted} hover:bg-white/10`
            }`}
          >
            <Archive size={18} />
            Archived
          </button>
        </div>

        <div className="border-t border-white/10 my-4"></div>

        <button
          onClick={onNavigateAbout}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm ${theme.textMuted}`}
        >
          ℹ️ About
        </button>
      </motion.aside>
    </>
  );
}