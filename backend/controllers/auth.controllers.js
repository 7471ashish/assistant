import genToken from '../config/token.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
export const signUp=async(req,res)=>{
    try{
      const {name,email,password}=req.body

      const existEmail=await User.findOne({email})

      if(existEmail){
        return res.status(400).json({
            message:"email already exist"
        })
      }

      if(password.length<6){
        return res.status(400).json({
            message:"passwod length must be atleast 6 characters"
        })
      }

      const hashedPassword=await bcrypt.hash(password,10)

      const user = await User.create({ name: name.trim(), password: hashedPassword, email: email.toLowerCase().trim() })
      const token = await genToken(user._id)
      
      const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER)
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction
      })

      const safeUser = user.toObject()
      delete safeUser.password
      return res.status(201).json(safeUser)

    }
    catch(err){
      console.error("Signup error:", err)
      if (err.code === 11000) {
        return res.status(400).json({ message: "An account with this email already exists." })
      }
      return res.status(500).json({ message: err.message || "Failed to create account." })
    }
}


export const Login=async(req,res)=>{
    try{
      const {email,password}=req.body

      const user=await User.findOne({email})

      if(!user){
        return res.status(400).json({
            message:"email does not exist"
        })
      }

      const isMatch=await bcrypt.compare(password,user.password)


      if(!isMatch){
        return res.status(400).json({message:"Incorrect Password"})
      }

      

     
      const token = await genToken(user._id)
      
      const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER)
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction
      })

      const safeUser = user.toObject()
      delete safeUser.password
      return res.status(200).json(safeUser)

    }
    catch(err){
        return res.status(500).json({message:`login error:${err}`})
    }
}


export const logout=async(req,res)=>{
    try{
     res.clearCookie("token")
     return res.status(200).json({message:"log out successfully"})
    }
    catch(err){
     return res.status(500).json({message:`logout error:${err}`})
    }
}