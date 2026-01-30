// src/pages/NoteEditor.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { notesAPI } from "../services/api";
import { theme } from "../utils/theme";
import Navbar from "../components/Navbar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

  // Helper function to strip HTML tags for character count
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // ReactQuill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'color', 'background'
  ];

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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="md:mt-14 flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center gap-2 ${theme.textMuted} hover:text-orange-400 transition-colors`}
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className={`${theme.textMuted} hover:text-orange-400 transition-colors`}
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
                  className={`w-full p-4 rounded-xl ${theme.input} ${theme.text} text-xl font-semibold placeholder-gray-500 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all`}
                />
                <p className={`text-xs ${theme.textMuted} mt-1`}>
                  {noteData.title.length}/200 characters
                </p>
              </div>

              {/* Content Editor */}
              <div>
                <label className={`text-sm ${theme.textMuted} mb-2 block font-medium`}>
                  Content
                </label>
                
                {/* Custom Styled ReactQuill */}
                <div className="quill-editor-wrapper">
                  <style>{`
                    /* Custom Quill Editor Styling */
                    .quill-editor-wrapper .ql-container {
                      background: rgba(255, 255, 255, 0.05);
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-radius: 0 0 12px 12px;
                      min-height: 300px;
                      font-size: 15px;
                    }
                    
                    .quill-editor-wrapper .ql-toolbar {
                      background: rgba(255, 255, 255, 0.08);
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-radius: 12px 12px 0 0;
                      border-bottom: none;
                    }
                    
                    .quill-editor-wrapper .ql-editor {
                      color: #e5e7eb;
                      min-height: 300px;
                    }
                    
                    .quill-editor-wrapper .ql-editor.ql-blank::before {
                      color: #6b7280;
                      font-style: normal;
                    }
                    
                    /* Toolbar buttons */
                    .quill-editor-wrapper .ql-stroke {
                      stroke: #9ca3af !important;
                    }
                    
                    .quill-editor-wrapper .ql-fill {
                      fill: #9ca3af !important;
                    }
                    
                    .quill-editor-wrapper .ql-picker-label {
                      color: #9ca3af !important;
                    }
                    
                    /* Active/hover states */
                    .quill-editor-wrapper .ql-toolbar button:hover .ql-stroke,
                    .quill-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
                      stroke: #fb923c !important;
                    }
                    
                    .quill-editor-wrapper .ql-toolbar button:hover .ql-fill,
                    .quill-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
                      fill: #fb923c !important;
                    }
                    
                    .quill-editor-wrapper .ql-toolbar button:hover,
                    .quill-editor-wrapper .ql-toolbar button.ql-active {
                      background: rgba(251, 146, 60, 0.1);
                      border-radius: 4px;
                    }
                    
                    /* Dropdown */
                    .quill-editor-wrapper .ql-picker-options {
                      background: #1f2937;
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-radius: 8px;
                      padding: 4px;
                    }
                    
                    .quill-editor-wrapper .ql-picker-item {
                      color: #e5e7eb;
                    }
                    
                    .quill-editor-wrapper .ql-picker-item:hover {
                      background: rgba(251, 146, 60, 0.1);
                      color: #fb923c;
                    }
                    
                    /* Links */
                    .quill-editor-wrapper .ql-editor a {
                      color: #60a5fa;
                    }
                    
                    /* Headers */
                    .quill-editor-wrapper .ql-editor h1,
                    .quill-editor-wrapper .ql-editor h2,
                    .quill-editor-wrapper .ql-editor h3 {
                      color: #f9fafb;
                    }
                    
                    /* Code blocks */
                    .quill-editor-wrapper .ql-editor pre {
                      background: rgba(0, 0, 0, 0.3);
                      border-radius: 6px;
                      color: #e5e7eb;
                    }
                    
                    /* Scrollbar */
                    .quill-editor-wrapper .ql-editor::-webkit-scrollbar {
                      width: 8px;
                    }
                    
                    .quill-editor-wrapper .ql-editor::-webkit-scrollbar-track {
                      background: rgba(255, 255, 255, 0.05);
                      border-radius: 4px;
                    }
                    
                    .quill-editor-wrapper .ql-editor::-webkit-scrollbar-thumb {
                      background: rgba(255, 255, 255, 0.2);
                      border-radius: 4px;
                    }
                    
                    .quill-editor-wrapper .ql-editor::-webkit-scrollbar-thumb:hover {
                      background: rgba(255, 255, 255, 0.3);
                    }
                  `}</style>
                  
                  <ReactQuill
                    theme="snow"
                    value={noteData.content}
                    onChange={(value) => setNoteData(prev => ({ ...prev, content: value }))}
                    placeholder="Start writing your note..."
                    modules={modules}
                    formats={formats}
                  />
                </div>

                <p className={`text-xs ${theme.textMuted} mt-2`}>
                  {stripHtml(noteData.content).length} characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                  className={`sm:w-auto px-8 py-4 rounded-xl ${theme.buttonSecondary} ${theme.text} font-medium hover:bg-white/10 transition-colors`}
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