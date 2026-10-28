import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperPlane,
  FaHistory,
  FaSignOutAlt,
  FaSlidersH,
  FaVolumeUp,
  FaTrashAlt,
  FaTimes,
  FaExternalLinkAlt
} from 'react-icons/fa'
import { RiRobot2Fill, RiPulseLine } from 'react-icons/ri'

const QUICK_ACTIONS = [
  { label: "What time is it?", query: "What time is it?" },
  { label: "Today's date", query: "What is today's date?" },
  { label: "Weather update", query: "Show me the weather" },
  { label: "Open YouTube", query: "Open YouTube" },
  { label: "Search Google", query: "Search Google for latest tech news" },
]

const Home = () => {
  const {
    userData,
    handleLogout,
    getGeminiResponse,
    handleClearHistory
  } = useContext(userDataContext)

  const navigate = useNavigate()

  // State
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [inputText, setInputText] = useState("")
  const [liveTranscript, setLiveTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [historyDrawer, setHistoryDrawer] = useState(false)
  const [language, setLanguage] = useState("en-US")
  const [micStatusMessage, setMicStatusMessage] = useState("Tap mic to speak")

  // Refs
  const recognitionRef = useRef(null)
  const isSpeakingRef = useRef(false)
  const isProcessingRef = useRef(false)
  const isListeningRef = useRef(false)
  const isMountedRef = useRef(true)
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null

  // Safe Speech Synthesis
  const speak = (text) => {
    if (!synth || !text) return

    try {
      // Abort any ongoing recognition immediately to prevent mic picking up assistant audio
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {}
      }
      isListeningRef.current = false
      setIsListening(false)

      synth.cancel() // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language

      const voices = synth.getVoices()
      if (voices.length > 0) {
        if (language === 'hi-IN') {
          const hindiVoice = voices.find(v => v.lang === 'hi-IN' || v.lang.includes('hi'))
          if (hindiVoice) utterance.voice = hindiVoice
        } else {
          const naturalVoice = voices.find(
            v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')) && v.lang.includes('en')
          )
          if (naturalVoice) utterance.voice = naturalVoice
        }
      }

      isSpeakingRef.current = true
      setIsSpeaking(true)
      setMicStatusMessage("Speaking...")

      utterance.onend = () => {
        isSpeakingRef.current = false
        setIsSpeaking(false)
        setMicStatusMessage("Tap mic to speak")
      }

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e)
        isSpeakingRef.current = false
        setIsSpeaking(false)
        setMicStatusMessage("Tap mic to speak")
      }

      synth.speak(utterance)
    } catch (err) {
      console.error("Speech synthesis failed:", err)
      isSpeakingRef.current = false
      setIsSpeaking(false)
    }
  }

  // Handle Command Routing
  const handleCommand = (data) => {
    if (!data) return
    const { type, userInput, response } = data

    if (response) {
      setAiText(response)
      speak(response)
    }

    const cleanInput = userInput || userText

    switch (type) {
      case 'google_search': {
        const query = encodeURIComponent(cleanInput)
        window.open(`https://www.google.com/search?q=${query}`, '_blank')
        break
      }
      case 'instagram_open': {
        window.open(`https://www.instagram.com/`, '_blank')
        break
      }
      case 'calculator_open': {
        window.open(`https://www.google.com/search?q=calculator`, '_blank')
        break
      }
      case 'facebook_open': {
        window.open(`https://www.facebook.com/`, '_blank')
        break
      }
      case 'weather_show': {
        const query = encodeURIComponent(cleanInput || "weather")
        window.open(`https://www.google.com/search?q=${query}`, '_blank')
        break
      }
      case 'youtube_search':
      case 'youtube_play': {
        const query = encodeURIComponent(cleanInput)
        window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
        break
      }
      default:
        break
    }
  }

  // Process Query
  const processCommand = async (rawQuery) => {
    const query = rawQuery?.trim()
    if (!query) return

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (e) {}
    }
    isListeningRef.current = false
    setIsListening(false)

    setUserText(query)
    setLiveTranscript("")
    setIsProcessing(true)
    isProcessingRef.current = true
    setMicStatusMessage("Thinking...")

    try {
      const data = await getGeminiResponse(query)
      setIsProcessing(false)
      isProcessingRef.current = false
      handleCommand(data)
    } catch (error) {
      console.error("Command processing error:", error)
      setIsProcessing(false)
      isProcessingRef.current = false
      const errorResponse = "I could not process your request. Please try again."
      setAiText(errorResponse)
      speak(errorResponse)
    }
  }

  // Create and Start a Fresh Recognition Instance on Click
  const createAndStartRecognition = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setMicStatusMessage("Speech recognition not supported in browser. Use text chat.")
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Brave.")
      return
    }

    // 1. Explicitly request microphone permission from the browser
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Permission granted: immediately release the stream so SpeechRecognition can access mic
        stream.getTracks().forEach(track => track.stop())
      }
    } catch (permErr) {
      console.error("Microphone permission error:", permErr)
      setMicStatusMessage("Microphone permission denied. Click the lock/camera icon in your address bar to allow.")
      alert("Microphone permission was denied. Please allow microphone access in your browser address bar and try again.")
      return
    }

    // 2. Abort any previous recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (e) {}
      recognitionRef.current = null
    }

    // 3. Create fresh instance
    const recognition = new SpeechRecognition()
    recognition.continuous = false // Single-turn command is fast and reliable
    recognition.interimResults = true
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      isListeningRef.current = true
      setIsListening(true)
      setMicStatusMessage("Listening... Speak now")
      setLiveTranscript("")
    }

    recognition.onresult = (event) => {
      let interim = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }

      const activeText = finalTranscript || interim
      if (activeText) {
        setLiveTranscript(activeText)
      }

      if (finalTranscript.trim()) {
        isListeningRef.current = false
        setIsListening(false)
        processCommand(finalTranscript.trim())
      }
    }

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error)
      isListeningRef.current = false
      setIsListening(false)

      if (event.error === 'not-allowed') {
        setMicStatusMessage("Mic permission blocked. Please allow mic in browser settings.")
      } else if (event.error === 'no-speech') {
        setMicStatusMessage("No speech detected. Tap mic to try again.")
      } else if (event.error !== 'aborted') {
        setMicStatusMessage("Tap mic to speak")
      }
    }

    recognition.onend = () => {
      isListeningRef.current = false
      setIsListening(false)
      if (!isProcessingRef.current && !isSpeakingRef.current) {
        setMicStatusMessage("Tap mic to speak")
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (startErr) {
      console.error("Failed to start speech recognition:", startErr)
      setMicStatusMessage("Could not start mic. Tap to retry.")
    }
  }

  // Toggle Microphone
  const handleMicToggle = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
      isListeningRef.current = false
      setIsListening(false)
      setMicStatusMessage("Microphone stopped")
    } else {
      if (synth) synth.cancel()
      isSpeakingRef.current = false
      setIsSpeaking(false)
      await createAndStartRecognition()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {}
      }
      if (synth) synth.cancel()
    }
  }, [])

  // Handle Text Submission
  const handleTextSubmit = (e) => {
    e.preventDefault()
    if (!inputText.trim() || isProcessing) return
    const textToSend = inputText
    setInputText("")
    processCommand(textToSend)
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col justify-between relative overflow-hidden text-slate-100 select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[150px] pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative w-full px-4 sm:px-8 py-4 glass-panel border-b border-white/10 flex items-center justify-between z-20">
        {/* Brand & Assistant Status */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#070d1e] rounded-xl flex items-center justify-center text-cyan-400">
                <RiRobot2Fill className="text-xl" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#030712] rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                {userData?.assistantName || "Virtual Assistant"}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v2.5 AI
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Operator: <span className="text-slate-300 font-medium">{userData?.name || "User"}</span>
            </span>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === "en-US" ? "hi-IN" : "en-US")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
            title="Toggle voice dialect (English / Hindi)"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{language === "en-US" ? "EN-US" : "HI-IN"}</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => setHistoryDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
            title="View command history"
          >
            <FaHistory className="text-cyan-400" />
            <span className="hidden md:inline">History</span>
            {userData?.history?.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold">
                {userData.history.length}
              </span>
            )}
          </button>

          {/* Customize Assistant */}
          <button
            onClick={() => navigate('/customize')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
            title="Customize Persona"
          >
            <FaSlidersH className="text-cyan-400" />
            <span className="hidden md:inline">Customize</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              handleLogout()
              navigate('/signin')
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all cursor-pointer"
            title="Sign Out"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN INTERACTIVE CORE */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10 max-w-4xl mx-auto w-full">
        {/* HOLOGRAPHIC AVATAR SECTION */}
        <div className="relative flex flex-col items-center mb-6">
          {/* Orbital glowing animated rings */}
          <div className={`absolute -inset-6 rounded-full border border-cyan-500/20 animate-spin-slow pointer-events-none ${isListening || isSpeaking ? 'opacity-100' : 'opacity-40'}`} />
          <div className={`absolute -inset-12 rounded-full border border-blue-500/15 animate-spin-reverse pointer-events-none ${isListening || isSpeaking ? 'opacity-100' : 'opacity-30'}`} />

          {/* Core Avatar Frame - Also Clickable to Trigger Mic! */}
          <div
            onClick={handleMicToggle}
            title={isListening ? "Listening... (Click to stop)" : "Click avatar to speak"}
            className={`relative w-40 h-40 sm:w-52 sm:h-52 rounded-3xl p-1.5 transition-all duration-500 cursor-pointer ${
              isSpeaking
                ? 'ring-4 ring-cyan-400 shadow-2xl shadow-cyan-500/60 scale-105'
                : isListening
                ? 'ring-4 ring-blue-400 shadow-2xl shadow-blue-500/50 scale-102 animate-pulse'
                : 'ring-1 ring-white/20 shadow-xl shadow-cyan-950/40 hover:scale-102'
            }`}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden bg-[#070d1e] relative">
              <img
                src={userData?.assistantImage}
                alt={userData?.assistantName || "Assistant"}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-50" />
            </div>

            {/* Glowing Status Dot on avatar corner */}
            <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg ${
              isSpeaking
                ? 'bg-cyan-400 text-[#030712] animate-bounce'
                : isListening
                ? 'bg-blue-500 text-white animate-pulse'
                : 'bg-emerald-500 text-white'
            }`}>
              {isSpeaking ? <FaVolumeUp className="text-[10px]" /> : <RiPulseLine className="text-xs" />}
            </div>
          </div>

          {/* Assistant Name & Dynamic Status Badge */}
          <div className="mt-5 flex flex-col items-center gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{userData?.assistantName || "Assistant"}</span>
            </h1>

            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-cyan-500/25 text-xs text-cyan-300 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${
                isSpeaking
                  ? 'bg-cyan-400 animate-ping'
                  : isListening
                  ? 'bg-blue-400 animate-pulse'
                  : isProcessing
                  ? 'bg-yellow-400 animate-spin'
                  : 'bg-emerald-400'
              }`} />
              <span className="font-mono uppercase tracking-wider text-[11px]">
                {micStatusMessage}
              </span>
            </div>
          </div>
        </div>

        {/* AUDIO REACTIVE VISUALIZER BARS */}
        <div className="flex items-center justify-center gap-1.5 h-10 mb-5">
          {[35, 75, 90, 60, 85, 45, 95, 70, 50, 80, 55].map((h, idx) => (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? 'bg-gradient-to-t from-cyan-500 to-sky-300'
                  : isListening
                  ? 'bg-gradient-to-t from-blue-600 to-cyan-400 opacity-80'
                  : 'bg-slate-700/50'
              }`}
              style={{
                height: isSpeaking
                  ? `${Math.max(8, (h * Math.sin((idx + Date.now() / 150) * 0.8)) % 38 + 12)}px`
                  : isListening
                  ? `${Math.max(8, (h * 0.5))}px`
                  : '6px',
              }}
            />
          ))}
        </div>

        {/* LIVE REAL-TIME TRANSCRIPT DISPLAY (WHEN TALKING) */}
        {liveTranscript && (
          <div className="w-full max-w-md px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono text-center mb-4 animate-pulse">
            <span className="text-slate-400 mr-1.5">Hearing:</span>
            <span>"{liveTranscript}"</span>
          </div>
        )}

        {/* DIALOGUE SHOWCASE / CHAT BUBBLE */}
        <div className="w-full max-w-xl min-h-[85px] flex flex-col gap-2.5 mb-5">
          {/* User Input Bubble */}
          {userText && (
            <div className="self-end max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm shadow-md shadow-blue-500/20">
              <div className="text-[10px] text-cyan-200 font-semibold uppercase tracking-wider mb-0.5">
                You
              </div>
              <p>{userText}</p>
            </div>
          )}

          {/* AI Response Bubble */}
          {aiText && (
            <div className="self-start max-w-[85%] px-5 py-3 rounded-2xl rounded-tl-sm glass-panel-glow text-white text-sm">
              <div className="flex items-center justify-between gap-3 text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1">
                  <RiRobot2Fill />
                  {userData?.assistantName}
                </span>
                <button
                  onClick={() => speak(aiText)}
                  className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  title="Replay Audio"
                >
                  <FaVolumeUp />
                </button>
              </div>
              <p className="text-slate-200 font-normal leading-relaxed">{aiText}</p>
            </div>
          )}
        </div>

        {/* QUICK ACTION PROMPT CHIPS */}
        <div className="w-full max-w-xl flex items-center justify-center flex-wrap gap-2 mb-4">
          {QUICK_ACTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => processCommand(item.query)}
              className="text-xs px-3 py-1.5 rounded-full glass-panel hover:border-cyan-500/40 text-slate-300 hover:text-white hover:bg-cyan-500/10 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </main>

      {/* BOTTOM INPUT & VOICE CONTROLS */}
      <footer className="relative w-full p-4 sm:p-6 glass-panel border-t border-white/10 z-20">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* Microphone Tap to Talk Button */}
          <button
            type="button"
            onClick={handleMicToggle}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 cursor-pointer shadow-xl ${
              isListening
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white ring-4 ring-cyan-400/50 shadow-cyan-500/40 scale-105 animate-pulse'
                : 'glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40 active:scale-95'
            }`}
            title={isListening ? "Listening... (Click to stop)" : "Click to speak"}
          >
            {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>

          {/* Text Input Form */}
          <form onSubmit={handleTextSubmit} className="flex-1 relative flex items-center">
            <input
              type="text"
              placeholder="Tap mic to speak, or type here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
              className="w-full h-14 pl-5 pr-14 rounded-2xl glass-input text-white placeholder-slate-500 text-sm outline-none font-medium disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="absolute right-2.5 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyan-500/25 active:scale-95"
              title="Send Command"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FaPaperPlane className="text-xs" />
              )}
            </button>
          </form>
        </div>
      </footer>

      {/* COMMAND HISTORY SLIDE-OVER DRAWER */}
      <div
        className={`fixed inset-0 z-50 transition-visibility duration-300 ${
          historyDrawer ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        <div
          onClick={() => setHistoryDrawer(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            historyDrawer ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          className={`absolute top-0 right-0 h-full w-full max-w-md glass-panel-glow border-l border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ease-out ${
            historyDrawer ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FaHistory className="text-cyan-400 text-lg" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Interaction History
                </h2>
              </div>
              <button
                onClick={() => setHistoryDrawer(false)}
                className="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Recent commands executed. Click any prompt to re-run.
            </p>

            <div className="mt-4 max-h-[calc(100vh-220px)] overflow-y-auto flex flex-col gap-2.5 pr-1">
              {userData?.history && userData.history.length > 0 ? (
                userData.history
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setHistoryDrawer(false)
                        processCommand(item)
                      }}
                      className="group p-3 rounded-xl glass-panel hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all cursor-pointer flex items-center justify-between gap-3 text-left"
                    >
                      <span className="text-sm text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {item}
                      </span>
                      <FaExternalLinkAlt className="text-xs text-slate-500 group-hover:text-cyan-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
              ) : (
                <div className="py-16 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                  <FaHistory className="text-2xl opacity-40" />
                  <span>No command history recorded yet.</span>
                </div>
              )}
            </div>
          </div>

          {userData?.history && userData.history.length > 0 && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors cursor-pointer px-3 py-2 rounded-xl hover:bg-red-500/10"
              >
                <FaTrashAlt />
                <span>Clear All History</span>
              </button>
              <button
                onClick={() => setHistoryDrawer(false)}
                className="px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default Home
