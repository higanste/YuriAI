'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Globe, Shield } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Powered by advanced AI models for instant responses',
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Compatible with all websites and browsers',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'No login required, your data stays private',
    },
    {
      icon: Sparkles,
      title: 'AI Powered',
      description: 'Advanced AI agent that understands context',
    },
  ]

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">About YuriAI</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            YuriAI is an AI-powered agent that helps you interact with any website
            using natural language. No login required, fully cloud-based, and works
            seamlessly across all platforms.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <div className="space-y-4 text-white/70">
            <p>
              YuriAI uses advanced AI models to understand your natural language
              commands and interact with websites on your behalf. Simply describe
              what you want to do, and the AI agent will handle the rest.
            </p>
            <p>
              Whether you need to search for information, extract data, fill forms,
              or perform any web-based task, YuriAI makes it as simple as typing
              a message.
            </p>
            <p>
              Our cloud-based architecture ensures that everything runs smoothly
              without requiring any local installation or login credentials.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

