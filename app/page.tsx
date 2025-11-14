'use client'

import { motion } from 'framer-motion'
import { Sparkles, Download, Zap, Globe, Shield, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold text-white">YuriAI</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link
                href="/"
                className="text-white/80 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/extension"
                className="text-white/80 hover:text-white transition-colors"
              >
                Extension
              </Link>
              <Link
                href="/about"
                className="text-white/80 hover:text-white transition-colors"
              >
                About
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-6">
            AI Agent for the Web
          </h1>
          <p className="text-2xl text-white/70 mb-8 max-w-3xl mx-auto">
            Automate websites, extract data, fill forms, and execute complex workflows effortlessly
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Link href="/extension">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Extension</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <Zap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Web Automation</h3>
            <p className="text-white/70">
              Navigate websites, click buttons, fill forms, and automate repetitive tasks with natural language commands.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <Globe className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Works Everywhere</h3>
            <p className="text-white/70">
              Compatible with all websites. No login required, fully cloud-based, and works seamlessly across platforms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <Shield className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Free & Secure</h3>
            <p className="text-white/70">
              Powered by free AI models. Your data stays private, and everything runs locally in your browser.
            </p>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
        >
          <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-white/70">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">1</div>
              <p>Download and install the YuriAI extension</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">2</div>
              <p>Open the extension on any website</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">3</div>
              <p>Give natural language commands to automate tasks</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
