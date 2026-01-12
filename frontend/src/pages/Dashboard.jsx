// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Edit, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notesAPI } from "../services/api";
import ProfileMenu from "../components/ProfileMenu";
import DeleteNoteModal from "../components/DeleteNoteModal";
import dayjs from "dayjs";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notes State
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    note: null,
  });

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await notesAPI.getAll();
      setNotes(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      setError(err.response?.data?.message || "Failed to load notes");
      
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    navigate("/notes/new");
  };

  const handleEditNote = (noteId) => {
    navigate(`/notes/edit/${noteId}`);
  };

  const handleDeleteClick = (note) => {
    setDeleteModal({
      isOpen: true,
      note: note,
    });
  };

  const handleDeleteSuccess = () => {
    // Refresh notes after deletion
    fetchNotes();
  };

  const userData = user || {
    fullName: "User",
    email: "user@example.com",
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
          <span className="text-gray-300">{notes.length} Notes</span>
        </div>

        <ProfileMenu />
      </nav>

      {/* Mobile Sidebar Drawer */}
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
              className="fixed top-0 left-0 w-72 h-screen backdrop-blur-xl bg-gradient-to-b from-orange-600/40 to-rose-900/80 border-r border-white/20 pt-20 px-5 shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* User Info */}
              <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-lg font-bold border-2 border-white/30 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={userData.fullName} className="w-full h-full object-cover" />
                    ) : (
                      userData.fullName?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{userData.fullName}</p>
                    <p className="text-xs text-gray-300">{userData.email}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-xs border-t border-white/10 pt-3">
                  <div>
                    <span className="text-gray-400">Total Notes</span>
                    <p className="font-semibold text-rose-400 text-base">{notes.length}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCreateNote}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 border border-white/20 text-sm font-medium transition shadow-lg shadow-rose-500/30 mb-4"
              >
                + Create New Note
              </button>

              <div className="space-y-2">
                <button onClick={() => navigate("/dashboard")} className="block w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition text-sm font-medium border border-transparent hover:border-white/10">
                  📝 All Notes ({notes.length})
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
        className="hidden md:block fixed top-0 left-0 w-64 h-screen backdrop-blur-xl bg-gradient-to-b from-orange-600/20 to-rose-900/30 border-r border-white/10 pt-20 px-5 shadow-2xl overflow-y-auto"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-500 rounded-md shadow-lg shadow-rose-500/30"></div>
          <span className="font-semibold text-lg">Glass Notes</span>
        </div>

        <button 
          onClick={handleCreateNote}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm transition mb-4"
        >
          + Create New Note
        </button>

        <div className="space-y-2">
          <button className="block w-full text-left px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm">
            📝 All Notes ({notes.length})
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="py-24 md:ml-64 p-4">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300 mt-4">Loading notes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && notes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={48} className="text-orange-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No notes yet</h3>
            <p className="text-gray-400 mb-6">Create your first note to get started</p>
            <button
              onClick={handleCreateNote}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-500 text-white font-medium shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Create Note
            </button>
          </div>
        )}

        {/* Notes Grid */}
        {!loading && !error && notes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {notes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="p-4 rounded-2xl backdrop-blur-xl bg-white/10 border shadow-xl shadow-rose-500/10 border-pink-800 hover:shadow-2xl hover:shadow-rose-500/20 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm md:text-base bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent line-clamp-1">
                    {note.title}
                  </h3>
                  <span className="text-xs opacity-70 whitespace-nowrap">
                    📅 {dayjs(note.createdAt).format("DD MMM")}
                  </span>
                </div>
                <p className="text-xs md:text-sm mt-2 line-clamp-3 opacity-90">
                  {note.content}
                </p>

                <div className="flex justify-end gap-4 mt-4 text-gray-300">
                  <button 
                    onClick={() => handleEditNote(note._id)}
                    className="hover:text-pink-400 transition-all cursor-pointer"
                    title="Edit note"
                  >
                    <Edit className="w-4 h-4 md:w-5 md:h-5" />
                  </button>

                  <button 
                    onClick={() => handleDeleteClick(note)}
                    className="hover:text-rose-400 transition-all cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Add Button (Mobile Only) */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCreateNote}
        className="md:hidden w-14 h-14 rounded-full backdrop-blur-lg bg-gradient-to-r from-pink-600 to-rose-500 border border-white/10 fixed bottom-6 right-6 flex items-center justify-center text-2xl shadow-2xl shadow-rose-500/30 z-30"
      >
        +
      </motion.button>

      {/* Delete Confirmation Modal */}
      <DeleteNoteModal
        note={deleteModal.note}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, note: null })}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}