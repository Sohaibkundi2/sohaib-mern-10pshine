// src/components/NoteCard.jsx
import { motion } from "framer-motion";
import { Star, Archive, Edit, Trash2 } from "lucide-react";
import { theme } from "../utils/theme";
import dayjs from "dayjs";

export default function NoteCard({
  note,
  index,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleArchive,
  stripHtml,
}) {
  return (
    <motion.div
      key={note._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`
        ${note.isFavorite ? 'glow-border-pink' : note.isArchived ? 'glow-border-blue' : 'glow-border-orange'}
        relative p-5 rounded-2xl backdrop-blur-sm ${theme.card} border ${theme.cardHover} shadow-lg transition-all group
      `}
    >
      {/* Toggle Buttons - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(note._id);
          }}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            note.isFavorite
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
            onToggleArchive(note._id);
          }}
          className={`p-2 rounded-lg transition-all cursor-pointer ${
            note.isArchived
              ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/20"
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-500/20"
          }`}
          title={note.isArchived ? "Restore note" : "Archive note"}
        >
          <Archive size={16} />
        </button>
      </div>

      {/* Content Area - Clickable (but not if archived) */}
      <div
        onClick={() => !note.isArchived && onEdit(note._id)}
        className={`pr-8 ${note.isArchived ? "cursor-default opacity-60" : "cursor-pointer"}`}
      >
        <h3 className={`font-semibold text-lg bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent line-clamp-2 mb-2`}>
          {note.title}
        </h3>

        <p className={`text-sm line-clamp-4 ${theme.textMuted} mb-4`}>
          {stripHtml(note.content)}
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
                onEdit(note._id);
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
                onDelete(note);
              }}
              className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
              title="Delete note"
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* Show "Archived" badge instead when archived */}
          {note.isArchived && (
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-500/20 rounded-lg">
              Archived
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}