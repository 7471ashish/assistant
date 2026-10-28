import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { FaCheckCircle } from 'react-icons/fa'

const Card = ({ image, title = "Preset Persona" }) => {
  const {
    selectedImage,
    setSelectedImage,
    setBackendImage,
    setFrontendImage
  } = useContext(userDataContext)

  const isSelected = selectedImage === image

  const handleSelect = () => {
    setSelectedImage(image)
    setBackendImage(null)
    setFrontendImage(null)
  }

  return (
    <div
      onClick={handleSelect}
      className={`group relative w-36 h-48 sm:w-44 sm:h-60 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 ${
        isSelected
          ? 'ring-4 ring-cyan-400 shadow-2xl shadow-cyan-500/40 scale-[1.03]'
          : 'ring-1 ring-white/10 hover:ring-2 hover:ring-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20'
      }`}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient Tint */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity`}
      />

      {/* Active Checkmark Pill */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-cyan-500 text-white rounded-full p-1 shadow-lg shadow-cyan-500/50 animate-bounce">
          <FaCheckCircle className="text-base" />
        </div>
      )}

      {/* Title Label */}
      <div className="absolute bottom-3 left-3 right-3 text-left">
        <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors drop-shadow">
          {title}
        </span>
      </div>
    </div>
  )
}

export default Card
