// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Edit, Trash2, Plus, Star, Archive, FolderOpen, Search, Feather } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notesAPI } from "../services/api";
import DeleteNoteModal from "../components/DeleteNoteModal";
import { theme } from "../utils/theme";
import ProfileMenu from "../components/ProfileMenu";
import dayjs from "dayjs";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // all, favorites, archived

  // Notes State
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    note: null,
  });

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

  const handleCreateNote = () => navigate("/notes/new");
  const handleEditNote = (noteId) => navigate(`/notes/edit/${noteId}`);
  const handleDeleteClick = (note) => setDeleteModal({ isOpen: true, note });
  const handleDeleteSuccess = () => fetchNotes();

  const handleToggleFavorite = async (noteId) => {
    try {
      await notesAPI.toggleFavorite(noteId);
      // Update the note in state immediately for better UX
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === noteId
            ? { ...note, isFavorite: !note.isFavorite }
            : note
        )
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      // Optionally show error toast/notification
    }
  };

  const handleToggleArchive = async (noteId) => {
    try {
      await notesAPI.toggleArchive(noteId);

      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === noteId
            ? { ...note, isArchived: !note.isArchived }
            : note
        )
      );
    } catch (err) {
      console.error("Failed to toggle archive:", err);
    }
  };

  // FIXED: Archived notes don't show in favorites filter
  const filteredNotes = notes.filter(note => {
    if (activeFilter === "favorites") return note.isFavorite && !note.isArchived;
    if (activeFilter === "archived") return note.isArchived;
    return !note.isArchived; // 'all' shows non-archived
  });

  const stats = {
    total: notes.filter(n => !n.isArchived).length,
    favorites: notes.filter(n => n.isFavorite && !n.isArchived).length,
    archived: notes.filter(n => n.isArchived).length,
  };

  const userData = user || { fullName: "User", email: "user@example.com" };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} text-white transition-all`}>

      {/* Navbar */}
      <nav className={`w-full backdrop-blur-lg ${theme.navbar} border-b border-white/10 px-4 md:px-6 py-4 flex justify-between items-center fixed top-0 left-0 z-50`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-9 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg flex items-center justify-center`}
            >
              <Feather className="text-white" size={24} />
            </div>

            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent leading-none">
              Ilmora Writes
            </span>
          </div>

        </div>

        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
          <button className={`${theme.textMuted} hover:text-orange-400 transition`}>
            <Search size={18} />
          </button>
          <span className={theme.textMuted}>{stats.total} Notes</span>
        </div>

        <ProfileMenu stats={stats} />
      </nav>

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
                onClick={handleCreateNote}
                className={`w-full py-3 rounded-xl ${theme.button} hover:opacity-90 border border-white/20 text-sm font-semibold transition shadow-lg mb-4`}
              >
                + Create New Note
              </button>

              {/* Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => { setActiveFilter("all"); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${activeFilter === "all" ? "bg-orange-500/20 border border-orange-500/50 text-orange-400" : "hover:bg-white/10 border border-transparent"
                    }`}
                >
                  <FolderOpen size={18} />
                  All Notes ({stats.total})
                </button>

                <button
                  onClick={() => { setActiveFilter("favorites"); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${activeFilter === "favorites" ? "bg-pink-500/20 border border-pink-500/50 text-pink-400" : "hover:bg-white/10 border border-transparent"
                    }`}
                >
                  <Star size={18} />
                  Favorites ({stats.favorites})
                </button>

                <button
                  onClick={() => { setActiveFilter("archived"); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${activeFilter === "archived" ? "bg-gray-500/20 border border-gray-500/50 text-gray-300" : "hover:bg-white/10 border border-transparent"
                    }`}
                >
                  <Archive size={18} />
                  Archived ({stats.archived})
                </button>
              </div>

              <div className="border-t border-white/10 my-4"></div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate("/about")}
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
          onClick={handleCreateNote}
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
            <p className="text-2xl font-bold text-gray-300">{stats.archived}</p>
            <p className="text-xs text-gray-400">Archived</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${activeFilter === "all" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : `${theme.textMuted} hover:bg-white/10`
              }`}
          >
            <FolderOpen size={18} />
            All Notes
          </button>

          <button
            onClick={() => setActiveFilter("favorites")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${activeFilter === "favorites" ? "bg-pink-500/20 text-pink-400 border border-pink-500/30" : `${theme.textMuted} hover:bg-white/10`
              }`}
          >
            <Star size={18} />
            Favorites
          </button>

          <button
            onClick={() => setActiveFilter("archived")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${activeFilter === "archived" ? "bg-gray-500/20 text-gray-300 border border-gray-500/30" : `${theme.textMuted} hover:bg-white/10`
              }`}
          >
            <Archive size={18} />
            Archived
          </button>
        </div>

        <div className="border-t border-white/10 my-4"></div>

        <button
          onClick={() => navigate("/about")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition text-sm ${theme.textMuted}`}
        >
          ℹ️ About
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="py-24 md:ml-64 p-4 md:p-6">
        {/* Filter Header */}
        <div className="md:mt-16 mb-6">
          <h2 className={`text-2xl font-bold ${theme.text} mb-1`}>
            {activeFilter === "all" && "All Notes"}
            {activeFilter === "favorites" && "Favorite Notes"}
            {activeFilter === "archived" && "Archived Notes"}
          </h2>
          <p className={theme.textMuted}>
            {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className={`${theme.textMuted} mt-4`}>Loading notes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-center max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={48} className="text-orange-400" />
            </div>
            <h3 className={`text-2xl font-semibold mb-2 ${theme.text}`}>
              {activeFilter === "all" && "No notes yet"}
              {activeFilter === "favorites" && "No favorite notes"}
              {activeFilter === "archived" && "No archived notes"}
            </h3>
            <p className={`${theme.textMuted} mb-6`}>
              {activeFilter === "all" && "Create your first note to get started"}
              {activeFilter === "favorites" && "Star some notes to see them here"}
              {activeFilter === "archived" && "Archive notes to see them here"}
            </p>
            {activeFilter === "all" && (
              <button
                onClick={handleCreateNote}
                className={`px-6 py-3 rounded-xl ${theme.button} text-white font-semibold shadow-lg hover:opacity-90 transition-all`}
              >
                Create Note
              </button>
            )}
          </div>
        )}

        {/* Notes Grid */}
        {!loading && !error && filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`relative p-5 rounded-2xl backdrop-blur-sm ${theme.card} border ${theme.cardHover} shadow-lg transition-all group`}
              >
                {/* Toggle Buttons - Top Right (Simple) */}
                <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleFavorite(note._id);
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${note.isFavorite
                      ? 'text-pink-400 hover:text-pink-500 hover:bg-pink-500/10'
                      : 'text-gray-400 hover:text-pink-400 hover:bg-pink-500/10'
                      }`}
                    title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star
                      size={16}
                      fill={note.isFavorite ? "currentColor" : "none"}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Archive Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleArchive(note._id);
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${note.isArchived
                      ? " hover:bg-red-500/10 hover:text-red-400  "
                      : "hover:bg-red-500/10 hover:text-red-400 "
                      }`}
                    title={note.isArchived ? "Restore note" : "Archive note"}
                  >
                    <Archive size={16} />
                  </button>
                </div>

                {/* Content Area - Clickable (but not if archived) */}
                <div
                  onClick={() => !note.isArchived && handleEditNote(note._id)}
                  className={`pr-8 ${note.isArchived ? "cursor-default opacity-60" : "cursor-pointer"}`}
                >
                  <h3 className={`font-semibold text-lg bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent line-clamp-2 mb-2`}>
                    {note.title}
                  </h3>

                  <p className={`text-sm line-clamp-4 ${theme.textMuted} mb-4`}>
                    {note.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className={`text-xs ${theme.textMuted} flex items-center gap-1`}>
                    {dayjs(note.createdAt).format("hh:mm A, DD MMM")}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Edit Button - Hidden for archived notes */}
                    {!note.isArchived && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note._id);
                        }}
                        className="p-2 rounded-lg hover:bg-orange-500/10 hover:text-orange-400 transition-all cursor-pointer"
                        title="Edit note"
                      >
                        <Edit size={16} />
                      </button>
                    )}

                    {/* Delete Button - Hidden for archived notes */}
                    {!note.isArchived && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(note);
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    {/* Show "Archived" badge instead when archived */}
                    {note.isArchived && (
                      <span className="text-xs hover:bg-orange-500/10 hover:text-orange-400  rounded-lg">
                        Archived
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Add Button (Mobile) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCreateNote}
        className={`w-14 h-14 rounded-full ${theme.button} border border-white/20 fixed bottom-6 right-6 flex items-center justify-center text-3xl font-light shadow-2xl z-30`}
      >
        +
      </motion.button>

      {/* Delete Modal */}
      <DeleteNoteModal
        note={deleteModal.note}
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, note: null })}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}