import React, { useContext, useState } from 'react'
import bg from '../assets/futuristic background.webp'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa'
import { RiRobot2Fill, RiSparklingFill } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'

const SignIn = () => {
  const { serverUrl, setUserData } = useContext(userDataContext)
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignIn = async (event) => {
    event.preventDefault()
    setErr("")
    setLoading(true)

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email: email.trim(), password },
        { withCredentials: true }
      )
      setUserData(result.data)
      navigate("/")
    } catch (error) {
      console.error("Sign in error:", error)
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password. Please try again."
      setErr(errorMsg)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-center items-center p-4 relative overflow-hidden"
      style={{ backgroundImage: `url("${bg}")` }}
    >
      {/* Dark overlay & neon ambient lights */}
      <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-[440px] glass-panel-glow rounded-3xl p-8 sm:p-10 z-10">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/25 mb-4">
            <div className="w-full h-full bg-[#070d1e] rounded-2xl flex items-center justify-center text-cyan-400">
              <RiRobot2Fill className="text-2xl" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 mt-2 flex items-center gap-1.5">
            <RiSparklingFill className="text-cyan-400 text-xs" />
            Connect to your personal AI companion
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
          {/* Email */}
          <div className="relative">
            <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <FaEnvelope className="absolute left-4 text-slate-400 text-sm" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-12 pl-11 pr-4 rounded-xl glass-input text-white placeholder-slate-500 text-sm outline-none"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-xs font-semibold text-slate-300 ml-1 mb-1 block uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-4 text-slate-400 text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-12 pl-11 pr-11 rounded-xl glass-input text-white placeholder-slate-500 text-sm outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {err && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              {err}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          New to the platform?{' '}
          <Link
            to="/signup"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
