import express from "express"
import dotenv from "dotenv"
import { connect } from "mongoose"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"
dotenv.config()
const app=express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
dotenv.config();

console.log("Gemini Key:", process.env.GEMINI_API_KEY);
app.use(express.json())
app.use(cookieParser())
const port=process.env.PORT||5000
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.get("/",async (req,res)=>{
    let prompt=req.query.prompt
   let data= await geminiResponse(prompt)
   res.json(data)
})
app.listen(port,()=>{
    connectDb()
    console.log('server started')
})