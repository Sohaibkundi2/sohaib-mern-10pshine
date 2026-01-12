// src/pages/About.jsx
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, Mail, Code2, Database, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code2 size={24} />,
      title: "Modern Tech Stack",
      description: "Built with React, Node.js, Express, and MongoDB",
      color: "from-orange-500 to-pink-500"
    },
    {
      icon: <Database size={24} />,
      title: "Secure & Fast",
      description: "JWT authentication with encrypted data storage",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Palette size={24} />,
      title: "Beautiful Design",
      description: "Glassmorphism UI with smooth animations",
      color: "from-rose-500 to-orange-500"
    }
  ];

  const techStack = {
    frontend: ["React.js", "Tailwind CSS", "Framer Motion", "Axios", "React Router"],
    backend: ["Node.js", "Express.js", "MongoDB", "JWT Auth", "Pino Logger"],
    tools: ["Git", "GitHub", "Postman", "VS Code", "Cloudinary"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 backdrop-blur-sm border border-white/10 hover:bg-slate-700/80 transition text-gray-300 hover:text-white"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <span className="text-4xl font-bold">GN</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-4">
              Glass Notes
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A modern, secure, and beautiful note-taking application built with the MERN stack
            </p>
          </motion.div>

          {/* Version Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-orange-500/30 text-sm"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-300">Version 1.0.0 - January 2026</span>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/50 hover:border-orange-500/30 transition-all group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-100">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16 px-4 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Frontend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/50"
            >
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Frontend</h3>
              <ul className="space-y-2">
                {techStack.frontend.map((tech, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Backend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/50"
            >
              <h3 className="text-xl font-semibold mb-4 text-pink-400">Backend</h3>
              <ul className="space-y-2">
                {techStack.backend.map((tech, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/50"
            >
              <h3 className="text-xl font-semibold mb-4 text-rose-400">Tools & More</h3>
              <ul className="space-y-2">
                {techStack.tools.map((tech, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/70 to-slate-900/70 border border-slate-700/50 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold shadow-2xl">
              👨‍💻
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-100">Built by Sohaib</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Full-stack developer passionate about creating beautiful and functional web applications
            </p>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/sohaibkundi2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-orange-500/50 transition-all group"
              >
                <Github size={20} className="group-hover:text-orange-400 transition-colors" />
                <span className="text-sm font-medium">GitHub</span>
              </a>
              
              <a
                href="https://linkedin.com/in/sohaibkundi2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-pink-500/50 transition-all group"
              >
                <Linkedin size={20} className="group-hover:text-pink-400 transition-colors" />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              
              <a
                href="mailto:sohaibkundi2@gmail.com"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-rose-500/50 transition-all group"
              >
                <Mail size={20} className="group-hover:text-rose-400 transition-colors" />
                <span className="text-sm font-medium">Email</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Glass Notes. Built with ❤️ using MERN Stack | 10P SHINE Project
          </p>
        </div>
      </footer>
    </div>
  );
}