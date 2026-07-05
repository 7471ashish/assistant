import React from 'react'
import bg from '../assets/futuristic background.webp'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import axios from 'axios';
const SignUp = () => {

    const {serverUrl,userData,setUserData}=useContext(userDataContext)
    const[loading,setLoading]=useState(false)
    const [showPassword,setShowPassword]=useState(false)
    const[err,setErr]=useState("")

    const navigate=useNavigate()

    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    const handleSignUp=async (event)=>{
        event.preventDefault()
        setErr("")
        setLoading(true)
        navigate("/customize")
     try{
let result =await axios.post(`${serverUrl}/api/auth/signup`,{
    name,email,password
},{withCredentials:true})
setLoading(false)
setUserData(result.data)
console.log(result)
     }
     catch(err){
      console.log(err)
      setLoading(false)
      setUserData(null)
      setErr(err.response.data.message)
     }
    }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
     <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000085] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-center gap-3' onSubmit={handleSignUp}>

      <h1 className='text-white text-[30px] text-center'>Welcome to your personal <span className='text-blue-800 font-bold'>Virtual Assistant</span></h1>
 
      <input type="text" placeholder='Enter your name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent  text-white place-content-center placeholder-gray-300 rounded-full p-4' required onChange={(e)=>setName(e.target.value)} value={name}/>

      <input type="Email" placeholder='Enter your Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent  text-white place-content-center placeholder-gray-300 rounded-full p-4' required onChange={(e)=>setEmail(e.target.value)} value={email}/>

      <div className='w-full h-[60px]  border-2 border-white bg-transparent  text-white rounded-full relative pl-4 '>
          <input type={showPassword?"text":"password"} placeholder='password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 ' required onChange={(e)=>setPassword(e.target.value)} value={password} />
       {showPassword ? (
  <FaEye
    className='absolute top-[17px] right-[20px] text-white h-[25px] w-[25px] cursor-pointer'
    onClick={() => setShowPassword(false)}
  />
) : (
  <FaEyeSlash
    className='absolute top-[17px] right-[20px] text-white h-[25px] w-[25px] cursor-pointer'
    onClick={() => setShowPassword(true)}
  />
)}   
      </div>

      {err.length>0 && <p className='text-red-600'>{err}</p>}

   <button className='min-w-[150px] h-[60px] rounded-xl bg-white text-black' disabled={loading}>{loading?"Loading..":"Sign Up"}</button>

   <p className='text-white text-lg' onClick={()=>{
    navigate('/signin')
   }}>Already have an account ?<span className='text-blue-400'>Sign In</span></p>


     </form>



    </div>
  )
}

export default SignUp
