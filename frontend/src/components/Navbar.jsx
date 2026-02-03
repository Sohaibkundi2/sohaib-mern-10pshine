// src/components/Navbar.jsx
import { Search, Menu, X, Feather } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { theme } from "../utils/theme";
import { motion } from "framer-motion";

export default function Navbar({
  notesCount = 0,
  showSearch = true,
  showMobileMenu = false,
  isMobileMenuOpen = false,
  onMobileMenuToggle = null
}) {
  return (
    <nav className={`w-full backdrop-blur-lg ${theme.navbar} border-b ${theme.border} px-4 md:px-6 py-4 flex justify-between items-center fixed top-0 left-0 z-50`}>
      {/* Left: Logo/Title */}
      <div className="flex items-center gap-3">
        {showMobileMenu && onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        <motion.div
          className={`w-10 h-10 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg flex items-center justify-center`}
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Feather className="text-white" size={24} />
        </motion.div>
        <span className={`text-2xl font-bold ${theme.gradientText}`}>
          Ilmora Writes
        </span>
      </div>

      {/* Center: Search & Info (Desktop) */}
      <div className="hidden md:flex gap-6 text-sm font-medium items-center">
        {showSearch && (
          <button className={`${theme.textMuted} hover:text-orange-400 transition`}>
            <Search size={18} />
          </button>
        )}
        {notesCount > 0 && (
          <span className={theme.textMuted}>{notesCount} Notes</span>
        )}
      </div>

      {/* Right: Profile Menu */}
      <ProfileMenu />
    </nav>
  );
}