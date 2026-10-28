import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import Customize2 from './pages/Customize2'
import Home from './pages/Home'
import { userDataContext } from './context/UserContext'
import { RiRobot2Fill } from 'react-icons/ri'

const App = () => {
  const { userData, authLoading } = useContext(userDataContext)

  // Cyberpunk/Futuristic Loading Screen while checking session
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient neon orbs */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
            <div className="absolute w-14 h-14 rounded-full border-2 border-blue-500/30 border-b-blue-400 animate-spin-slow" />
            <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-cyan-950/80 text-cyan-400 shadow-lg shadow-cyan-500/30">
              <RiRobot2Fill className="text-xl animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent tracking-wide">
              INITIALIZING NEXUS AI
            </h2>
            <p className="text-xs text-slate-400 tracking-widest uppercase font-mono">
              Synchronizing Neural Core...
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isConfigured = Boolean(userData?.assistantImage && userData?.assistantName)

  return (
    <Routes>
      {/* Root Route */}
      <Route
        path="/"
        element={
          !userData ? (
            <Navigate to="/signin" replace />
          ) : !isConfigured ? (
            <Navigate to="/customize" replace />
          ) : (
            <Home />
          )
        }
      />

      {/* Auth Routes */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" replace />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" replace />}
      />

      {/* Assistant Setup Routes */}
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signin" replace />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signin" replace />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
