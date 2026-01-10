// src/components/LogoutModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  // Define the modal content
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        /* fixed inset-0 ensures it covers the whole screen regardless of parent */
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-[10000] bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full"
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              Confirm Logout
            </h3>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to logout? You will need to login again to access your account.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Teleport the modal to the body tag
  return createPortal(modalContent, document.body);
};

export default LogoutModal;