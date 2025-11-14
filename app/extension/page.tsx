'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Download, Sparkles, CheckCircle, ChevronRight, ChevronLeft, FileArchive, FolderOpen, Settings, Puzzle, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Extension() {
  const [currentStep, setCurrentStep] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const steps = [
    {
      number: 1,
      icon: Download,
      title: 'Download the Extension',
      description: 'Click the download button below to get the extension ZIP file',
      details: 'The extension will download as a ZIP file named "yuriai-extension.zip"',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: 2,
      icon: FileArchive,
      title: 'Extract the ZIP File',
      description: 'Right-click the downloaded ZIP file and select "Extract All" or use your preferred extraction tool',
      details: 'Extract to a location you can easily find, like your Desktop or Documents folder',
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: 3,
      icon: FolderOpen,
      title: 'Open Microsoft Edge',
      description: 'Launch Microsoft Edge browser on your computer',
      details: 'Make sure you have the latest version of Microsoft Edge installed',
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: 4,
      icon: Settings,
      title: 'Go to Extensions',
      description: 'Click the three dots (⋯) menu in the top right → Extensions → Manage extensions',
      details: 'Or type edge://extensions/ in the address bar and press Enter',
      color: 'from-orange-500 to-red-500',
    },
    {
      number: 5,
      icon: Puzzle,
      title: 'Enable Developer Mode',
      description: 'Toggle the "Developer mode" switch in the bottom left corner of the Extensions page',
      details: 'This allows you to install extensions from local files',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      number: 6,
      icon: FolderOpen,
      title: 'Load Unpacked Extension',
      description: 'Click "Load unpacked" button and select the extracted extension folder',
      details: 'Navigate to the folder where you extracted the ZIP file and select it',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      number: 7,
      icon: Zap,
      title: 'Start Using!',
      description: 'The extension is now installed! Click the YuriAI icon in your browser toolbar to start using it',
      details: 'You can now use AI agent capabilities on any website',
      color: 'from-yellow-500 to-orange-500',
    },
  ]

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch('/api/extension/download')
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'yuriai-extension.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setDownloaded(true)
      setTimeout(() => {
        setCurrentStep(1)
      }, 1000)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again or download from GitHub.')
    } finally {
      setDownloading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Microsoft Edge Extension
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
            Install the YuriAI extension to use AI agent capabilities on any website
          </p>
          
          <motion.button
            onClick={handleDownload}
            disabled={downloading || downloaded}
            whileHover={{ scale: downloaded ? 1 : 1.05 }}
            whileTap={{ scale: downloaded ? 1 : 0.95 }}
            className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
              downloaded
                ? 'bg-green-600 text-white cursor-default'
                : downloading
                ? 'bg-purple-600/50 text-white cursor-wait'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {downloaded ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Downloaded!</span>
              </>
            ) : downloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Extension ZIP</span>
              </>
            )}
          </motion.button>
        </motion.div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: currentStep === index ? 1.1 : 1,
                    backgroundColor: currentStep >= index ? 'rgba(147, 51, 234, 1)' : 'rgba(255, 255, 255, 0.2)',
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors ${
                    currentStep > index ? 'bg-green-500' : ''
                  }`}
                >
                  {currentStep > index ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-16 mx-2 transition-colors ${
                      currentStep > index ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${steps[currentStep].color} mb-6`}
              >
                {steps[currentStep].icon && (
                  <steps[currentStep].icon className="w-10 h-10 text-white" />
                )}
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Step {steps[currentStep].number}: {steps[currentStep].title}
              </h2>
              
              <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
                {steps[currentStep].description}
              </p>
              
              <p className="text-white/60 max-w-xl mx-auto">
                {steps[currentStep].details}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center space-x-4 mt-8">
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 0}
              whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 0
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </motion.button>

            <div className="text-white/60 text-sm">
              {currentStep + 1} of {steps.length}
            </div>

            <motion.button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              whileHover={{ scale: currentStep === steps.length - 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentStep === steps.length - 1 ? 1 : 0.95 }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === steps.length - 1
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Complete Installation Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setCurrentStep(index)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  currentStep === index
                    ? 'bg-purple-600/30 border-2 border-purple-500'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-white/70 text-sm">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
