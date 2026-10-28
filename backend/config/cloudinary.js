import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
const uploadOnCLoudinary=async(filePath)=>{
    
       cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
    try{
   const uploadResult=await cloudinary.uploader.upload(filePath)
    
   if (fs.existsSync(filePath)) {
     fs.unlinkSync(filePath)
   }
   return uploadResult.secure_url
    }
    catch(err){
     if (fs.existsSync(filePath)) {
       fs.unlinkSync(filePath)
     }
     console.error("Cloudinary upload error:", err)
     throw new Error("Failed to upload image")
    }

}

export default uploadOnCLoudinary