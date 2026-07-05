import React, { useContext, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import ai from "../assets/assistant_voice.gif"
import userVoice from '../assets/user.gif'
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";



const Home = () => {
  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()

  const isRecognizingRef=useRef(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const[listening,setListening]=useState(false)
  const[ham,setHam]=useState(false)
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const synth=window.speechSynthesis

  const handleLogOut=async()=>{
    try{
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    }
    catch(err){
      console.log(err)
    }
  }

  const startRecognition=()=>{
    if(!isSpeakingRef.current && !isRecognizingRef.current){
    try{
      recognitionRef.current?.start()
      setListening(true);
    }
    catch(err){
if(!err.message.includes('start')){
  console.error("recognition error",error)
}
    }
  }
  }
   
  const speak=(text)=>{
    const utterence=new SpeechSynthesisUtterance(text)
    utterence.lang='hi-IN';
    const voices=window.speechSynthesis.getVoices()
    const hindiVoice=voices.find(v=>v.lang==='hi-IN');
    if(hindiVoice){
      utterence.voice=hindiVoice;
    }
    isSpeakingRef.current=true

    utterence.onend=()=>{
      setAiText("")
      isSpeakingRef.current=false
      setTimeout(()=>{
        startRecognition();
      },800)
      // recognitionRef.current?.start()
    }
    synth.cancel();
    synth.speak(utterence)
  }

  const handleCommand=(data)=>{
    const {type,userInput,response}=data
    speak(response)

    if(type==='google_search'){
      const query=encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    } 
    if(type==='instagram_open'){
      const query=encodeURIComponent(userInput);
      window.open(`https://www.instagram.com/`,'_blank');
    } 
    if(type==='calculator_open'){
      const query=encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=calculator`,'_blank');
    } 
    if(type==='facebook_open'){
      const query=encodeURIComponent(userInput);
      window.open(`https://www.facebook.com/`,'_blank');
    } 
    if(type==='weather_show'){
      const query=encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=weather`,'_blank');
    } 
    if(type==='youtube_search' || type==='youtube_play'){
      console.log('opening youtube')
      const query=encodeURIComponent(userInput);
    window.open (`https://www.youtube.com/results?search_query=${query}`,'_blank');
    } 
  }

  useEffect(()=>{
    const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition=new SpeechRecognition()
    recognition.continuous=true
    recognition.lang='en-us'
    recognition.interimResults=false
   
    recognitionRef.current=recognition

    // const isRecognizingRef={current:false}
    let isMounted=true;

    const startTimeout=setTimeout(()=>{
       if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
        try{
           recognition.start();
           console.log("recognition requested to start")

        }catch(err){
        if(e.name!=="InvalidStateError"){
          console.log(err)
        }
        }
       }
    },1000);

    const safeRecognition=()=>{
      if(!isRecognizingRef.current && !isSpeakingRef.current){
       try{
        recognition.start()
        console.log("recognition requested to start");
       }
       catch(err){
        if(err.name!=="InvalidStateError"){
          console.log("start error",err)
        }
       }
      }
    }

    recognition.onstart=()=>{
      
      isRecognizingRef.current=true;
      setListening(true);
    };

    recognition.onend=()=>{
     
      isRecognizingRef.current=false;
      setListening(false);
       
      if(isMounted && !isSpeakingRef.current){
        setTimeout(()=>{
          if(isMounted){
            try{
              recognition.start();
              console.log("recognition started")
            }catch(err){
              if(err.name!=="InvalidStateError"){
                console.log(err)
              }
            }
          }
        },1000)
      }
      // if(!isSpeakingRef.current){
      //   setTimeout(()=>{
      //     safeRecognition()
      //   },1000);
      // }
    };

    recognition.onerror=(event)=>{
       console.warn("recognition error",event.error)
       isRecognizingRef.current=false;
       setListening(false)
       if(event.error!=='aborted' && !isRecognizingRef.current && isMounted){
        setTimeout(()=>{
          if(isMounted){
            try{
              recognition.start();
              console.log("recognition started after error")
            }catch(err){
              if(err.name!=='InvalidStateError'){
                console.log(err)
              }
            }
          }
        },1000);
       }
    };
     

    recognition.onresult=async(e)=>{
       const transcript=e.results[e.results.length-1][0].transcript.trim()
       console.log("heard: "+transcript)
        setAiText("")
       if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current=false
        setListening(false)
          const data= await getGeminiResponse(transcript)
          console.log(data)
          setUserText("")
          setAiText(data.response)
          handleCommand(data)
       }
    }
    
    const fallback=setInterval(()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        safeRecognition()
      }
    },10000)

    safeRecognition()

    return ()=>{
       recognition.stop()
       setListening(false)
       isRecognizingRef.current=false
       clearInterval(fallback)
    }
   
  },[])

 useEffect(() => {
  if (!userData?.name) return;

  const greeting = new SpeechSynthesisUtterance(
    `Hello ${userData.name}, what can I help you with?`
  );

  greeting.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(greeting);
}, []);


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020263] flex flex-col items-center justify-center gap-8 p-12'>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden shadow-lg gap-2'>
          <TiThMenu className='lg:hidden text-white absolute right-[20px] top-[20px]' onClick={()=>setHam(true)}/>
          <div className={`absolute lg:hidden top-0 w-full h-full bg-[#0000004b] backdrop-blur-lg p-[20px] ${ham?'translate-x-0':'translate-x-full'} transition-transform `}>
           <IoClose className='lg:hidden text-white absolute right-[20px] top-[20px]' onClick={()=>setHam(false)}/>
           <div className='flex flex-col items-start mt-10 gap-5'>
             <button className='min-w-[150px] h-[60px] rounded-xl bg-white text-black  ' onClick={()=>handleLogOut()} >Log out</button>
        <button className='min-w-[150px] h-[60px] rounded-xl bg-white text-black  px-2 ' onClick={()=>navigate("/customize")}>Customize your assistant</button>

        <div className='w-full h-[2px] bg-gray-500'></div>
        <h1 className='text-white font-semibold'>History</h1>
        <div className='w-full h-[60%] overflow-auto flex flex-col gap-5'>
          {userData.history?.map((his)=>(
            <span className='text-white truncate'>{his}</span>
          ))}
        </div>
           </div>
            
          </div>
        <button className='min-w-[150px] h-[60px] rounded-xl bg-white text-black absolute top-[20px] right-[20px] hidden lg:block' onClick={()=>handleLogOut()} >Log out</button>
        <button className='min-w-[150px] h-[60px] rounded-xl bg-white text-black absolute top-[100px] right-[20px] px-2 hidden lg:block' onClick={()=>navigate("/customize")}>Customize your assistant</button>


        <img src={userData?.assistantImage} alt="" className='h-full object-cover rounded-4xl' />
      </div>
      <h1 className='text-white text-4xl font-semibold'>I'm {userData?.assistantName}</h1>
      {
        !aiText && <img src={userVoice} className='w-[200px]' />
      }
      {
        aiText && <img src={ai} className='w-[200px]' />
      }

      <h1 className='text-white'>{userText?userText:aiText?aiText:null}</h1>
    </div>
  )
}

export default Home
