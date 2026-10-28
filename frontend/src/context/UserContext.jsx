import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext({
  userData: null,
  authLoading: true,
  serverUrl: "http://localhost:8000"
})
const serverUrl = "http://localhost:8000"

const UserContext = ({ children }) => {
  const [userData, setUserData] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true
      })
      setUserData(result.data)
    } catch (err) {
      setUserData(null)
    } finally {
      setAuthLoading(false)
    }
  }

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      )
      // Update local history if returned or append
      if (result.data) {
        setUserData((prev) => {
          if (!prev) return prev
          const updatedHistory = prev.history ? [...prev.history, command] : [command]
          return { ...prev, history: updatedHistory }
        })
      }
      return result.data
    } catch (err) {
      console.error("Gemini response error:", err)
      return {
        type: "general",
        userInput: command,
        response: "I encountered an error processing your request. Please try again."
      }
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setUserData(null)
      setSelectedImage(null)
      setFrontendImage(null)
      setBackendImage(null)
    }
  }

  const handleClearHistory = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/clear-history`,
        {},
        { withCredentials: true }
      )
      setUserData((prev) => ({ ...prev, history: [] }))
      return true
    } catch (err) {
      console.error("Clear history error:", err)
      return false
    }
  }

  useEffect(() => {
    handleCurrentUser()
  }, [])

  const value = {
    serverUrl,
    userData,
    setUserData,
    authLoading,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
    handleCurrentUser,
    handleLogout,
    handleClearHistory
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
