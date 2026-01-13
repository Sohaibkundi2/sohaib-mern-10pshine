// src/components/LogoutModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { theme } from "../utils/theme";

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout on error
      onClose();
      navigate("/login");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className={`${theme.card} border p-6 rounded-2xl shadow-2xl max-w-sm w-full`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <LogOut size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${theme.text}`}>
                    Confirm Logout
                  </h3>
                  <p className={`text-sm ${theme.textMuted}`}>You'll be signed out</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`${theme.textMuted} hover:text-white transition-colors`}
              >
                <X size={20} />
              </button>
            </div>

            <p className={`${theme.textMuted} mb-6`}>
              Are you sure you want to logout? You'll need to login again to access your notes.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-2 rounded-xl ${theme.buttonSecondary} ${theme.text} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}