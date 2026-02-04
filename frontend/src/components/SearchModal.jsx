// src/components/SearchModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Archive, Search, XCircle } from "lucide-react";
import { theme } from "../utils/theme";
import dayjs from "dayjs";

export default function SearchModal({
  showSearchModal,
  searchQuery,
  isSearching,
  searchResults,
  onClearSearch,
  onSearchChange,
  onEditNote,
  highlightText,
  stripHtml,
  isMobile = false
}) {
  return (
    <AnimatePresence>
      {showSearchModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClearSearch}
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 ${isMobile ? '' : 'mt-16'}`}
          />

          {/* Desktop Search Results Modal */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-[70vh] overflow-y-auto backdrop-blur-xl bg-gradient-to-b ${theme.sidebar} border border-white/20 rounded-2xl shadow-2xl z-50 p-6`}
            >
              <div className="flex items-center justify-between mt-6 md:mt-0 mb-4">
                <h3 className={`text-lg font-semibold ${theme.text}`}>
                  Search Results
                </h3>
                <button
                  onClick={onClearSearch}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Loading State */}
              {isSearching && (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className={`${theme.textMuted} mt-4`}>Searching...</p>
                </div>
              )}

              {/* No Results */}
              {searchQuery.trim() === "" && (
                <p className={theme.textMuted + " text-center py-8"}>
                  Start typing to search notes
                </p>
              )}
              {!isSearching && searchQuery.trim() !== "" && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <p className={theme.textMuted}>No notes found for "{searchQuery}"</p>
                </div>
              )}

              {/* Results Grid */}
              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-3">
                  {searchResults.map((note) => (
                    <motion.div
                      key={note._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => onEditNote(note._id)}
                      className={`p-4 rounded-xl ${theme.card} border hover:border-orange-500/50 transition-all cursor-pointer group`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4
                            className="font-semibold text-base bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent line-clamp-1 mb-1"
                            dangerouslySetInnerHTML={{ __html: highlightText(note.title, searchQuery) }}
                          />
                          <p
                            className={`text-sm line-clamp-2 ${theme.textMuted} mb-2`}
                            dangerouslySetInnerHTML={{ __html: highlightText(stripHtml(note.content), searchQuery) }}
                          />
                          <span className={`text-xs ${theme.textMuted}`}>
                            {dayjs(note.createdAt).format("MMM DD, YYYY")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {note.isFavorite && (
                            <Star size={16} className="text-pink-400" fill="currentColor" />
                          )}
                          {note.isArchived && (
                            <Archive size={16} className="text-amber-400" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Mobile Search Input */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed top-20 left-4 right-4 z-50"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  autoFocus
                  className={`w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 ${theme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d34c79] transition`}
                />
                {searchQuery && (
                  <button
                    onClick={onClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}