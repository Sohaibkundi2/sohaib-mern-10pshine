// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from "react";
import socketService from "../services/socket";
import { motion } from "framer-motion";
import { Menu, X, Plus, Search, Feather } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notesAPI } from "../services/api";
import { theme } from "../utils/theme";
import { debounce } from "lodash";

// Components
import DeleteNoteModal from "../components/DeleteNoteModal";
import ProfileMenu from "../components/ProfileMenu";
import SearchBar from "../components/SearchBar.jsx";
import SearchModal from "../components/SearchModal.jsx";
import Sidebar from "../components/Sidebar.jsx";
import NoteCard from "../components/NoteCard.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Notes State
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    note: null,
  });

  // Socket.IO real-time sync
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      socketService.connect(token);

      const handleNoteCreated = (note) => {
        console.log('📝 Note created (real-time):', note);
        setNotes(prevNotes => [note, ...prevNotes]);
      };

      const handleNoteUpdated = (updatedNote) => {
        console.log('✏️ Note updated (real-time):', updatedNote);
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note._id === updatedNote._id ? updatedNote : note
          )
        );
      };

      const handleNoteDeleted = (data) => {
        console.log('🗑️ Note deleted (real-time):', data);
        setNotes(prevNotes =>
          prevNotes.filter(note => note._id !== data._id)
        );
      };

      const handleRefresh = () => {
        console.log('🔄 Refresh requested');
        fetchNotes();
      };

      socketService.onNoteCreated(handleNoteCreated);
      socketService.onNoteUpdated(handleNoteUpdated);
      socketService.onNoteDeleted(handleNoteDeleted);
      socketService.onNotesRefresh(handleRefresh);

      return () => {
        socketService.off('note:created', handleNoteCreated);
        socketService.off('note:updated', handleNoteUpdated);
        socketService.off('note:deleted', handleNoteDeleted);
        socketService.off('notes:refresh', handleRefresh);
        socketService.disconnect();
      };
    }
  }, []);

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

  // Search functionality
  const performSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await notesAPI.search(query, {
        favorite: activeFilter === "favorites" ? "true" : undefined,
        archived: activeFilter === "archived" ? "true" : activeFilter === "all" ? "false" : undefined,
      });
      setSearchResults(response.data.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      performSearch(query);
    }, 300),
    [activeFilter]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      setShowSearchModal(true);
      debouncedSearch(query);
    } else {
      setShowSearchModal(false);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchModal(false);
  };

  const handleCreateNote = () => navigate("/notes/new");
  const handleEditNote = (noteId) => {
    clearSearch();
    navigate(`/notes/edit/${noteId}`);
  };
  const handleDeleteClick = (note) => setDeleteModal({ isOpen: true, note });
  const handleDeleteSuccess = () => fetchNotes();

  const handleToggleFavorite = async (noteId) => {
    try {
      await notesAPI.toggleFavorite(noteId);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleToggleArchive = async (noteId) => {
    try {
      await notesAPI.toggleArchive(noteId);
    } catch (err) {
      console.error("Failed to toggle archive:", err);
    }
  };

  // Helper functions
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const highlightText = (text, query) => {
    if (!query || query.trim().length === 0) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-400/30 text-yellow-200">$1</mark>');
  };

  const filteredNotes = notes.filter(note => {
    if (activeFilter === "favorites") return note.isFavorite && !note.isArchived;
    if (activeFilter === "archived") return note.isArchived;
    return !note.isArchived;
  });

  const stats = {
    total: notes.filter(n => !n.isArchived).length,
    favorites: notes.filter(n => n.isFavorite && !n.isArchived).length,
    archived: notes.filter(n => n.isArchived).length,
  };

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
            <div className={`w-10 h-9 bg-gradient-to-r ${theme.gradient} rounded-xl shadow-lg flex items-center justify-center`}>
              <Feather className="text-white" size={24} />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent leading-none">
              Ilmora Writes
            </span>
          </div>
        </div>

        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          stats={stats}
        />

        <ProfileMenu stats={stats} />
      </nav>

      {/* Search Modals */}
      <SearchModal
        showSearchModal={showSearchModal}
        searchQuery={searchQuery}
        isSearching={isSearching}
        searchResults={searchResults}
        onClearSearch={clearSearch}
        onSearchChange={handleSearchChange}
        onEditNote={handleEditNote}
        highlightText={highlightText}
        stripHtml={stripHtml}
        isMobile={false}
      />

      {/* Mobile Search Button */}
      <div className="md:hidden fixed top-20 right-4 z-30">
        <button
          onClick={() => setShowSearchModal(!showSearchModal)}
          className={`p-3 rounded-full ${theme.button} shadow-lg`}
        >
          <Search size={20} />
        </button>
      </div>

      {/* Mobile Search Input */}
      <SearchModal
        showSearchModal={showSearchModal}
        searchQuery={searchQuery}
        isSearching={isSearching}
        searchResults={searchResults}
        onClearSearch={clearSearch}
        onSearchChange={handleSearchChange}
        onEditNote={handleEditNote}
        highlightText={highlightText}
        stripHtml={stripHtml}
        isMobile={true}
      />

      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        stats={stats}
        user={user}
        onCreateNote={handleCreateNote}
        onNavigateAbout={() => navigate("/about")}
      />

      {/* Main Content */}
      <main className="py-24 md:ml-64 p-4 md:p-6">
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
              <NoteCard
                key={note._id}
                note={note}
                index={index}
                onEdit={handleEditNote}
                onDelete={handleDeleteClick}
                onToggleFavorite={handleToggleFavorite}
                onToggleArchive={handleToggleArchive}
                stripHtml={stripHtml}
              />
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