import mongoose from "mongoose"

const connectDb = async () => {
  // Try configured URL first, then fallback to IPv4 127.0.0.1 if localhost fails
  const primaryUri = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/virtualAssistant"
  const fallbackUri = primaryUri.replace("localhost", "127.0.0.1")

  const connectWithOptions = async (uri) => {
    return await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    })
  }

  try {
    await connectWithOptions(primaryUri)
    console.log(`[MongoDB] Connected successfully to ${primaryUri.split('@').pop()}`)
  } catch (err) {
    console.warn(`[MongoDB] Primary connection failed (${err.message}). Trying IPv4 fallback...`)
    try {
      await connectWithOptions(fallbackUri)
      console.log(`[MongoDB] Fallback connected successfully to ${fallbackUri.split('@').pop()}`)
    } catch (fallbackErr) {
      console.error("[MongoDB] Connection error:", fallbackErr.message)
      console.error("[MongoDB] Tip: Ensure MongoDB service is running (e.g. 'net start MongoDB' or MongoDB Compass/mongod).")
    }
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Connection lost. Attempting to reconnect...")
  })

  mongoose.connection.on("reconnected", () => {
    console.log("[MongoDB] Reconnected successfully.")
  })
}

export default connectDb