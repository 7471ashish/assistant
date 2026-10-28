import { response } from "express"
import uploadOnCLoudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from "moment"
export const getCurrentUser=async(req,res)=>{
    try{
      const userId=req.userId
     
      const user =await User.findById(userId).select("-password")
      if(!user){
        return res.status(400).json({message:"user not found"})
      }

      return res.status(200).json(user)

    }
    catch(err){
         return res.status(500).json({message:"get current user error"})
    }
}


export const updateAssistant=async(req,res)=>{
  try{
     const {assistantName,imageUrl}=req.body
      let assistantImage;
      if(req.file){
        assistantImage=await uploadOnCLoudinary(req.file.path)
      }else{
        assistantImage=imageUrl
      }

    const user=await User.findByIdAndUpdate(req.userId,{
     assistantName,assistantImage
    },{new:true}).select("-password")

    return res.status(200).json(user)
  }
  catch(err){
    console.log(err)
     return res.status(500).json({
      message:"user updation failed"
     })
  }
}

export const clearHistory=async(req,res)=>{
  try{
    const user=await User.findByIdAndUpdate(req.userId,{
      history:[]
    },{new:true}).select("-password")
    return res.status(200).json(user)
  }catch(err){
    return res.status(500).json({message:"Failed to clear history"})
  }
}



export const askToAssistant=async(req,res)=>{
   try{
      console.log("BODY:", req.body);
    
    const { command } = req.body;
    console.log("COMMAND:", command);

    const id = req.userId;
    console.log("USER ID:", id);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.history) {
      user.history = [];
    }
    user.history.push(command);
    // keep latest 50 history entries
    if (user.history.length > 50) {
      user.history = user.history.slice(-50);
    }
    await user.save();

    const result = await geminiResponse(
      command,
      user.assistantName || "Assistant",
      user.name || "User"
    );

    let gemResult = null;
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        gemResult = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn("JSON parse error on gemini response:", e);
      }
    }

    if (!gemResult || !gemResult.response) {
      const cleanText = result.replace(/```json|```/g, "").trim();
      return res.json({
        type: "general",
        userInput: command,
        response: cleanText || "I'm right here. How can I assist you?"
      });
    }

    const type = gemResult.type || "general";

    switch(type){
      case 'get_date':
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `Today's date is ${moment().format("MMMM Do, YYYY")}`
        });
      case 'get_time':
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `The current time is ${moment().format("hh:mm A")}`
        });
      case 'get_day':
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `Today is ${moment().format("dddd")}`
        });
      case 'get_month':
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `The current month is ${moment().format("MMMM")}`
        });
      case "general":
      case 'google_search':
      case 'youtube_search':
      case 'youtube_play':  
      case 'calculator_open': 
      case 'instagram_open': 
      case 'facebook_open': 
      case 'weather_show':
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: gemResult.response,
        });

      default:
        return res.json({
          type: "general",
          userInput: command,
          response: gemResult.response || "I didn't quite catch that, could you repeat?"
        });
    }
   }
   catch(err){
      console.error(err);

    return res.status(500).json({
        message: err.message
    });   
   }
}