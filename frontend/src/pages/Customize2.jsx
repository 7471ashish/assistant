import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { RiSparklingFill, RiRobot2Fill } from 'react-icons/ri'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const NAME_SUGGESTIONS = ["Nova", "Jarvis", "Aura", "Friday", "Nexus", "Cortana"]

const Customize2 = () => {
  const {
    userData,
    backendImage,
    selectedImage,
    frontendImage,
    serverUrl,
    setUserData
  } = useContext(userDataContext)

  const [name, setName] = useState(userData?.assistantName || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Determine preview image
  const previewImg = frontendImage || (selectedImage !== "custom_upload" ? selectedImage : null)

  const handleUpdateAssistant = async () => {
    if (!name.trim()) {
      setError("Please specify a name for your assistant.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("assistantName", name.trim())

      if (backendImage) {
        formData.append("assistantImage", backendImage)
      } else if (selectedImage && selectedImage !== "custom_upload") {
        formData.append("imageUrl", selectedImage)
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
        withCredentials: true
      })
      setUserData(result.data)
      navigate("/")
    } catch (err) {
      console.error("Assistant update failed:", err)
      setError(
        err?.response?.data?.message ||
        "Failed to configure assistant. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-700/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Back to Step 1 */}
      <button
        onClick={() => navigate('/customize')}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer z-20 text-sm"
      >
        <IoMdArrowRoundBack className="text-lg" />
        <span>Change Persona</span>
      </button>

      {/* Main Glass Container */}
      <div className="relative w-full max-w-xl glass-panel-glow rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center z-10">
        {/* Step 2 Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <RiSparklingFill />
          Step 2 of 2: Name & Identity
        </div>

        {/* Selected Avatar Preview Thumbnail */}
        {previewImg && (
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-xl shadow-cyan-500/25">
              <img
                src={previewImg}
                alt="Selected Persona"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-cyan-500 text-white rounded-full p-1 text-xs shadow-md">
              <RiRobot2Fill />
            </div>
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Name Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Virtual Assistant</span>
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          You will use this wake word to trigger your assistant during conversations.
        </p>

        {/* Name Input Box */}
        <div className="w-full mb-4">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. Nova, Jarvis, Aura"
              className="w-full h-14 px-5 rounded-2xl glass-input text-white placeholder-slate-500 text-base font-medium outline-none text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateAssistant()
              }}
            />
          </div>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs text-slate-400 mr-1">Suggestions:</span>
          {NAME_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => setName(sug)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                name.toLowerCase() === sug.toLowerCase()
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                  : 'border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-white glass-panel'
              }`}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            {error}
          </div>
        )}

        {/* Launch Assistant Button */}
        <button
          disabled={loading || !name.trim()}
          onClick={handleUpdateAssistant}
          className="w-full h-13 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Configuring Neural Persona...</span>
            </>
          ) : (
            <>
              <span>Activate {name.trim() || "Assistant"}</span>
              <RiSparklingFill />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Customize2
