// src/components/SearchBar.jsx
import { Search, XCircle } from "lucide-react";
import { theme } from "../utils/theme";

export default function SearchBar({ searchQuery, onSearchChange, onClearSearch, stats }) {
  return (
    <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-auto px-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={onSearchChange}
          className={`w-full pl-10 pr-10 py-2 rounded-lg bg-white/10 border border-white/20 ${theme.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d34c79] transition `}
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
      <span className={theme.textMuted}>{stats.total} Notes</span>
    </div>
  );
}