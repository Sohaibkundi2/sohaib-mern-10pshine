// src/pages/About.jsx
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, Mail, Heart, Sparkles, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { theme } from "../utils/theme";
import Navbar from "../components/Navbar";

export default function About() {
  const navigate = useNavigate();

  const features = [
    { icon: "✍️", text: "Create and organize your notes easily" },
    { icon: "⭐", text: "Mark important notes as favorites" },
    { icon: "📁", text: "Archive old notes to keep things clean" },
    { icon: "🔍", text: "Search through all your notes instantly" },
    { icon: "🔒", text: "Your notes are private and secure" },
    { icon: "📱", text: "Works perfectly on phone and computer" }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} text-white`}>
      {/* Navbar */}
      <Navbar showSearch={false} />

      {/* Back Button */}
      <div className="fixed top-20 left-6 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 backdrop-blur-sm border border-white/10 hover:bg-slate-700/80 transition text-gray-300 hover:text-orange-400"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <Sparkles className="text-white" size={40} />
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold ${theme.gradientText} mb-4`}>
              Ilmora Writes
            </h1>
            <p className={`text-xl ${theme.textMuted} max-w-2xl mx-auto mb-4`}>
              Your personal space for notes and ideas
            </p>
            <p className={`${theme.textMuted} text-sm`}>
              Simple. Beautiful. Secure.
            </p>
          </motion.div>
        </section>

        {/* What is this? */}
        <section className="max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl ${theme.card} border text-center`}
          >
            <Coffee size={40} className="text-orange-400 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>
              What is Ilmora Writes?
            </h2>
            <p className={`${theme.textMuted} leading-relaxed`}>
              Ilmora Writes is a simple note-taking app where you can write down your thoughts, 
              ideas, to-do lists, or anything you want to remember. It's designed to be easy to 
              use and beautiful to look at, so you can focus on what matters – your content.
            </p>
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className={`text-3xl font-bold text-center mb-8 ${theme.gradientText}`}>
            What You Can Do
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl ${theme.card} border hover:border-orange-500/30 transition-all text-center`}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <p className={`${theme.text} text-sm`}>{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Built with love */}
        <section className="max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl ${theme.card} border text-center`}
          >
            <Heart size={40} className="text-pink-400 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>
              Built with Love
            </h2>
            <p className={`${theme.textMuted} leading-relaxed mb-4`}>
              This project was created as part of the 10P SHINE internship program. 
              It's a learning journey to understand how modern web applications work, 
              from design to deployment.
            </p>
            <p className={`text-sm ${theme.textMuted}`}>
              Made with React, Node.js, and MongoDB • January 2026
            </p>
          </motion.div>
        </section>

        {/* Developer Section */}
        <section className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl bg-gradient-to-br ${theme.card} border text-center`}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold shadow-2xl">
              SK
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>Sohaib Khan</h2>
            <p className={`${theme.textMuted} mb-6`}>
              Developer & Student
            </p>
            <p className={`${theme.textMuted} mb-6 text-sm max-w-md mx-auto`}>
              Hi! I'm Sohaib, a student learning web development. This app is part of 
              my journey to become a better developer. Thanks for checking it out!
            </p>

            {/* Social Links */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="https://github.com/sohaibkundi2"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl ${theme.buttonSecondary} border ${theme.border} hover:border-orange-500/50 transition-all group`}
              >
                <Github size={20} className="group-hover:text-orange-400 transition-colors" />
                <span className="text-sm font-medium">GitHub</span>
              </a>
              
              <a
                href="https://linkedin.com/in/sohaibkundi2"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl ${theme.buttonSecondary} border ${theme.border} hover:border-pink-500/50 transition-all group`}
              >
                <Linkedin size={20} className="group-hover:text-pink-400 transition-colors" />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              
              <a
                href="mailto:sohaibkundi2@gmail.com"
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl ${theme.buttonSecondary} border ${theme.border} hover:border-rose-500/50 transition-all group`}
              >
                <Mail size={20} className="group-hover:text-rose-400 transition-colors" />
                <span className="text-sm font-medium">Email</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800 text-center">
          <p className={`${theme.textMuted} text-sm`}>
            © 2026 Ilmora Writes • Made with ❤️ for 10P SHINE
          </p>
        </footer>
      </div>
    </div>
  );
}
