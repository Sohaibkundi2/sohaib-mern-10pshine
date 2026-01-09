import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings, Bell, Search } from "lucide-react";

export default function AppUI() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock user data 
  const user = {
    name: "Sohaib khan",
    email: "sohaib@example.com",
    avatar: null, // or URL
    notesCount: 12,
    joinedDate: "Jan 2025"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-pink-900/20 to-rose-900/30 text-white transition-all">

      {/* Navbar */}
      <nav className="w-full backdrop-blur-lg bg-black/20 border-b border-white/10 px-4 md:px-6 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="text-lg md:text-xl font-semibold bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
            Glass Notes
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
          <button className="hover:text-rose-400 transition">
            <Search size={18} />
          </button>
          <button className="hover:text-rose-400 transition">
            <Bell size={18} />
          </button>
          <a href="#" className="hover:text-rose-400 transition">Notes</a>
          <a href="#" className="hover:text-rose-400 transition">About</a>
        </div>

        {/* Profile Avatar (Both Mobile & Desktop) */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-sm font-semibold border-2 border-white/20 hover:border-white/40 transition"
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-64 backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden z-50"
              >
                {/* Profile Header */}
                <div className="p-4 border-b border-white/10 bg-gradient-to-br from-orange-600/40 to-rose-900/40">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-lg font-bold border-2 border-white/30">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex gap-4 mt-3 text-xs">
                    <div>
                      <span className="text-gray-400">Notes</span>
                      <p className="font-semibold text-rose-400">{user.notesCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Joined</span>
                      <p className="font-semibold">{user.joinedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
                    <User size={16} className="text-rose-400" />
                    <span>My Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
                    <Settings size={16} className="text-rose-400" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
                    <Bell size={16} className="text-rose-400" />
                    <span>Notifications</span>
                  </button>
                  <div className="border-t border-white/10 my-2"></div>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/20 transition text-sm text-red-400">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-72 h-screen backdrop-blur-xl bg-gradient-to-b from-orange-600/40 to-rose-900/80 border-r border-white/20 pt-20 px-5 shadow-2xl shadow-purple-700/40 z-50 md:hidden overflow-y-auto"
            >
              {/* User Info in Mobile Drawer */}
              <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-lg font-bold border-2 border-white/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-300">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-xs border-t border-white/10 pt-3">
                  <div>
                    <span className="text-gray-400">Total Notes</span>
                    <p className="font-semibold text-rose-400 text-base">{user.notesCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Member Since</span>
                    <p className="font-semibold text-sm">{user.joinedDate}</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 border border-white/20 text-sm font-medium transition shadow-lg shadow-rose-500/30 mb-4">
                + Create New Note
              </button>

              {/* Navigation Links */}
              <div className="space-y-2">
                <a href="#" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition text-sm font-medium border border-transparent hover:border-white/10">
                  📝 All Notes
                </a>
                <a href="#" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition text-sm font-medium border border-transparent hover:border-white/10">
                  ⭐ Favorites
                </a>
                <a href="#" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition text-sm font-medium border border-transparent hover:border-white/10">
                  🗂️ Categories
                </a>
                <a href="#" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition text-sm font-medium border border-transparent hover:border-white/10">
                  🗑️ Trash
                </a>
              </div>

              <div className="border-t border-white/10 my-4"></div>

              <div className="space-y-2">
                <a href="#" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition text-sm">
                  ⚙️ Settings
                </a>
                <a href="#" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition text-sm">
                  ℹ️ About
                </a>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/20 transition text-sm text-red-400 font-medium">
                  🚪 Logout
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
        className="hidden md:block fixed top-0 left-0 w-64 h-screen backdrop-blur-xl bg-gradient-to-b from-orange-600/20 to-rose-900/30 border-r border-white/10 pt-20 px-5 shadow-2xl shadow-purple-700/20 overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-500 rounded-md shadow-lg shadow-rose-500/30"></div>
          <span className="font-semibold text-lg">Glass Notes</span>
        </div>

        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm transition mb-4">
          + Create New Note
        </button>

        <div className="space-y-2">
          <a href="#" className="block px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
            📝 All Notes
          </a>
          <a href="#" className="block px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
            ⭐ Favorites
          </a>
          <a href="#" className="block px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
            🗂️ Categories
          </a>
          <a href="#" className="block px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
            🗑️ Trash
          </a>
        </div>
      </motion.aside>

      {/* Notes Grid */}
      <main className="py-24 md:ml-64 p-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {Array(12).fill(0).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl backdrop-blur-xl bg-white/10 border shadow-xl shadow-rose-500/10 border-pink-800 hover:shadow-2xl hover:shadow-rose-500/20 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm md:text-base bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Note Title {i + 1}
                </h3>
                <span className="text-xs opacity-70">📅 12 Jan 2025</span>
              </div>
              <p className="text-xs md:text-sm mt-2 line-clamp-3 opacity-90">
                This is a preview of the note content. Notes will be shown here with a brief snippet to give an idea of what the note is about. You can edit or delete the note using the buttons below.
              </p>

              <div className="flex justify-end gap-4 mt-4 text-gray-300">
                <button className="hover:text-pink-400 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>

                <button className="hover:text-rose-400 transition-all cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating Add Button (Mobile Only) */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className="md:hidden w-14 h-14 rounded-full backdrop-blur-lg bg-gradient-to-r from-pink-600 to-rose-500 border border-white/10 fixed bottom-6 right-6 flex items-center justify-center text-2xl shadow-2xl shadow-rose-500/30 z-30"
      >
        +
      </motion.button>

    </div>
  );
}