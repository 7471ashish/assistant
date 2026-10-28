import jwt from 'jsonwebtoken'
const isAuth=async(req,res,next)=>{
    try{
      const token = req.cookies?.token
      if (!token) {
        return res.status(401).json({ message: "Authentication token required" })
      }
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

      req.userId = verifyToken.userId

      next()
    }
    catch(err){
      console.log("Auth error:", err.message)
      return res.status(401).json({ message: "Invalid or expired session. Please sign in again." })
    }
}


export default isAuth