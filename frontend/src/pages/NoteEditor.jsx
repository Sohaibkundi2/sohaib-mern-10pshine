// src/pages/NoteEditor.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { notesAPI } from "../services/api";
import { theme } from "../utils/theme";
import Navbar from "../components/Navbar";

export default function NoteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      setFetchLoading(true);
      const response = await notesAPI.getById(id);
      const note = response.data.data;
      
      setNoteData({
        title: note.title || "",
        content: note.content || "",
      });
    } catch (err) {
      console.error("Failed to fetch note:", err);
      setError(err.response?.data?.message || "Failed to load note");
      
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 404) {
        setError("Note not found");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!noteData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!noteData.content.trim()) {
      setError("Content is required");
      return;
    }

    if (noteData.title.length > 200) {
      setError("Title cannot exceed 200 characters");
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await notesAPI.update(id, {
          title: noteData.title.trim(),
          content: noteData.content.trim(),
        });
        setSuccess("Note updated successfully!");
      } else {
        await notesAPI.create({
          title: noteData.title.trim(),
          content: noteData.content.trim(),
        });
        setSuccess("Note created successfully!");
      }

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Failed to save note:", err);
      setError(err.response?.data?.message || "Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.background} flex items-center justify-center`}>
        <div className={`${theme.text} text-xl`}>Loading note...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} text-white`}>
      {/* Navbar */}
      <Navbar showSearch={false} />

      {/* Main Content */}
      <div className="pt-20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className={`flex items-center gap-2 ${theme.textMuted} hover:text-white transition-colors`}
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className={`${theme.textMuted} hover:text-white transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Title */}
        <h1 className={`text-3xl md:text-4xl font-bold ${theme.gradientText} mb-2 text-center`}>
          {isEditing ? "Edit Note" : "Create New Note"}
        </h1>
        <p className={`text-center ${theme.textMuted} mb-8`}>
          {isEditing ? "Update your note" : "Write something amazing"}
        </p>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.success} p-3 rounded-xl mb-6 text-center`}
          >
            {success}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.error} p-3 rounded-xl mb-6 text-center`}
          >
            {error}
          </motion.div>
        )}

        {/* Note Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-xl ${theme.card} border rounded-3xl p-6 md:p-8 shadow-2xl`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className={`text-sm ${theme.textMuted} mb-2 block font-medium`}>
                Title
              </label>
              <input
                type="text"
                name="title"
                value={noteData.title}
                onChange={handleChange}
                placeholder="Enter note title..."
                maxLength={200}
                className={`w-full p-4 rounded-xl ${theme.input} ${theme.text} text-xl font-semibold placeholder-gray-500 outline-none transition-all`}
              />
              <p className={`text-xs ${theme.textMuted} mt-1`}>
                {noteData.title.length}/200 characters
              </p>
            </div>

            {/* Content Textarea */}
            <div>
              <label className={`text-sm ${theme.textMuted} mb-2 block font-medium`}>
                Content
              </label>
              <textarea
                name="content"
                value={noteData.content}
                onChange={handleChange}
                placeholder="Start writing your note..."
                rows={15}
                className={`w-full p-4 rounded-xl ${theme.input} ${theme.text} placeholder-gray-500 outline-none transition-all resize-none`}
              />
              <p className={`text-xs ${theme.textMuted} mt-1`}>
                {noteData.content.length} characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl ${theme.button} ${theme.buttonHover} text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all`}
              >
                <Save size={20} />
                {loading ? "Saving..." : (isEditing ? "Update Note" : "Create Note")}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className={`px-8 py-4 rounded-xl ${theme.buttonSecondary} ${theme.text} font-medium transition-colors`}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      </div>
    </div>
  );
}