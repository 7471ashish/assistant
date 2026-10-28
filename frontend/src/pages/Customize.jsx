import React, { useRef, useContext } from 'react'
import image1 from '../assets/image1.webp'
import image2 from '../assets/image2.webp'
import assistantImg from '../assets/assistant.webp'
import Card from '../components/Card'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack, IoMdCloudUpload } from 'react-icons/io'
import { FaCheckCircle } from 'react-icons/fa'
import { RiSparklingFill } from 'react-icons/ri'

const Customize = () => {
  const {
    frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    userData
  } = useContext(userDataContext)

  const inputImage = useRef(null)
  const navigate = useNavigate()

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
      setSelectedImage("custom_upload")
    }
  }

  const isCustomSelected = selectedImage === "custom_upload"

  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-700/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Back button if user already had assistant configured */}
      {userData?.assistantName && (
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer z-20 text-sm"
        >
          <IoMdArrowRoundBack className="text-lg" />
          <span>Dashboard</span>
        </button>
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-4xl flex flex-col items-center text-center z-10">
        {/* Step Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <RiSparklingFill />
          Step 1 of 2: Visual Persona
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Choose Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Virtual Assistant</span> Look
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mb-10">
          Pick one of the neural avatars or upload your custom visual identity.
        </p>

        {/* Persona Options Grid */}
        <div className="w-full flex justify-center items-center flex-wrap gap-5 sm:gap-6 mb-10">
          <Card image={image1} title="Aura (Futuristic)" />
          <Card image={image2} title="Nova (Cyber Android)" />
          <Card image={assistantImg} title="Nexus (Hologram)" />

          {/* Custom Upload Card */}
          <div
            onClick={() => {
              inputImage.current?.click()
            }}
            className={`group relative w-36 h-48 sm:w-44 sm:h-60 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center justify-center p-4 ${
              isCustomSelected
                ? 'ring-4 ring-cyan-400 shadow-2xl shadow-cyan-500/40 scale-[1.03] bg-cyan-950/40'
                : 'ring-1 ring-white/10 hover:ring-2 hover:ring-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 glass-panel'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              ref={inputImage}
              hidden
              onChange={handleImage}
            />

            {frontendImage ? (
              <>
                <img
                  src={frontendImage}
                  alt="Custom Upload"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-70" />
                <div className="absolute top-3 right-3 bg-cyan-500 text-white rounded-full p-1 shadow-lg shadow-cyan-500/50 animate-bounce">
                  <FaCheckCircle className="text-base" />
                </div>
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-cyan-300 drop-shadow">
                  Custom Upload
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <IoMdCloudUpload className="text-2xl" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-slate-200">
                    Upload Custom
                  </span>
                  <span className="text-[10px] text-slate-400">
                    PNG, JPG, or WEBP
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            disabled={!selectedImage}
            onClick={() => navigate("/customize2")}
            className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 active:scale-[0.98]"
          >
            <span>Proceed to Step 2</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Customize
