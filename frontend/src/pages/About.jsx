// src/pages/About.jsx
import { motion } from "framer-motion";
import { ArrowLeft, Github, Linkedin, Mail, BookOpen, Target, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { theme } from "../utils/theme";
import Navbar from "../components/Navbar";

export default function About() {
  const navigate = useNavigate();

  const projectGoals = [
    {
      icon: <Target size={24} />,
      title: "Project Purpose",
      description: "A full-stack note-taking application demonstrating modern web development practices and clean architecture patterns.",
      color: "from-orange-500 to-pink-500"
    },
    {
      icon: <BookOpen size={24} />,
      title: "Learning Outcomes",
      description: "Hands-on experience with MERN stack, RESTful APIs, JWT authentication, and responsive UI design principles.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Key Features",
      description: "Secure authentication, CRUD operations, real-time updates, file uploads with Cloudinary, and comprehensive error handling.",
      color: "from-rose-500 to-orange-500"
    }
  ];

  const techStack = {
    frontend: [
      { name: "React.js", purpose: "Component-based UI framework" },
      { name: "Tailwind CSS", purpose: "Utility-first styling" },
      { name: "Framer Motion", purpose: "Animation library" },
      { name: "Axios", purpose: "HTTP client" },
      { name: "React Router", purpose: "Client-side routing" }
    ],
    backend: [
      { name: "Node.js", purpose: "JavaScript runtime" },
      { name: "Express.js", purpose: "Web framework" },
      { name: "MongoDB", purpose: "NoSQL database" },
      { name: "JWT", purpose: "Token-based auth" },
      { name: "Pino", purpose: "Logging system" }
    ],
    tools: [
      { name: "Git & GitHub", purpose: "Version control" },
      { name: "Postman", purpose: "API testing" },
      { name: "Cloudinary", purpose: "Media storage" },
      { name: "Mocha/Chai", purpose: "Testing framework" },
      { name: "VS Code", purpose: "Code editor" }
    ]
  };

  const features = [
    "User authentication with JWT tokens",
    "Password encryption with bcrypt",
    "CRUD operations for notes",
    "File upload with Cloudinary integration",
    "Responsive glassmorphism UI design",
    "Centralized error handling",
    "API logging with Pino",
    "Protected routes and authorization",
    "Form validation on client and server",
    "RESTful API architecture"
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
        <section className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-orange-500/30">
              <span className="text-4xl font-bold">GN</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold ${theme.gradientText} mb-4`}>
              Glass Notes
            </h1>
            <p className={`text-xl ${theme.textMuted} max-w-2xl mx-auto mb-6`}>
              MERN Stack Note-Taking Application
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-orange-500/30 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className={theme.textMuted}>10P SHINE Project • January 2026</span>
            </div>
          </motion.div>
        </section>

        {/* Project Goals */}
        <section className="max-w-6xl mx-auto mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme.gradientText}`}>
            Project Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {projectGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl ${theme.card} border hover:border-orange-500/30 transition-all`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${goal.color} flex items-center justify-center mb-4`}>
                  {goal.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>{goal.title}</h3>
                <p className={theme.textMuted}>{goal.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className={`py-16 px-4 ${theme.card} border rounded-3xl max-w-6xl mx-auto mb-16`}>
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme.gradientText}`}>
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Frontend */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Frontend</h3>
              <ul className="space-y-3">
                {techStack.frontend.map((tech, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                      <span className={`font-medium ${theme.text}`}>{tech.name}</span>
                    </div>
                    <span className={`text-xs ${theme.textMuted} ml-4`}>{tech.purpose}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Backend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-pink-400">Backend</h3>
              <ul className="space-y-3">
                {techStack.backend.map((tech, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                      <span className={`font-medium ${theme.text}`}>{tech.name}</span>
                    </div>
                    <span className={`text-xs ${theme.textMuted} ml-4`}>{tech.purpose}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-rose-400">Development Tools</h3>
              <ul className="space-y-3">
                {techStack.tools.map((tech, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                      <span className={`font-medium ${theme.text}`}>{tech.name}</span>
                    </div>
                    <span className={`text-xs ${theme.textMuted} ml-4`}>{tech.purpose}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Implemented Features */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme.gradientText}`}>
            Implemented Features
          </h2>
          <div className={`p-6 rounded-2xl ${theme.card} border`}>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                  <span className={`text-sm ${theme.text}`}>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl bg-gradient-to-br ${theme.card} border text-center`}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold shadow-2xl">
              SK
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${theme.text}`}>Sohaib Kundi</h2>
            <p className={`${theme.textMuted} mb-2`}>Full-Stack Developer</p>
            <p className={`${theme.textMuted} mb-6 max-w-xl mx-auto text-sm`}>
              MERN Stack Developer | Building modern web applications with React, Node.js, and MongoDB
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
                <span className="text-sm font-medium">sohaibkundi2</span>
              </a>
              
              <a
                href="https://linkedin.com/in/sohaibkundi2"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl ${theme.buttonSecondary} border ${theme.border} hover:border-pink-500/50 transition-all group`}
              >
                <Linkedin size={20} className="group-hover:text-pink-400 transition-colors" />
                <span className="text-sm font-medium">sohaibkundi2</span>
              </a>
              
              <a
                href="mailto:sohaibkundi2@gmail.com"
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl ${theme.buttonSecondary} border ${theme.border} hover:border-rose-500/50 transition-all group`}
              >
                <Mail size={20} className="group-hover:text-rose-400 transition-colors" />
                <span className="text-sm font-medium">Email Me</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-800 text-center">
          <p className={`${theme.textMuted} text-sm`}>
            © 2026 Glass Notes • Built with ❤️ MERN Stack • 10P SHINE Internship Project
          </p>
        </footer>
      </div>
    </div>
  );
}