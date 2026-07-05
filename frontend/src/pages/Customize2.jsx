import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {

    const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const [name,setName]=useState(userData?.assistantName||"")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

   const handleUpdateAssistant=async()=>{
    setLoading(true)
    try{
        let formData=new FormData()
        formData.append("assistantName",name)
        if(backendImage){
            formData.append('assistantImage',backendImage)
        }else{
            formData.append('imageUrl',selectedImage)
        }
    const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
    console.log(result.data)
    setUserData(result.data)
    setLoading(false)
    navigate("/")
    }
    catch(err){
       console.log(err)
       setLoading(false)
    }
   }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020263] flex flex-col items-center justify-center gap-8'>
        <IoMdArrowRoundBack className='text-white absolute top-[30px] left-[60px] text-2xl cursor-pointer' onClick={()=>navigate('/customize')}/>
     <h1 className='text-white text-[30px] text-center'>Enter <span className='text-blue-800 font-bold'>Virtual Assistant</span> Name</h1>
      <input type="text" placeholder='Enter the assistant name' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white rounded-full placeholder-gray-500 pl-4 text-white' onChange={(e)=>setName(e.target.value)} value={name} />


     {
        name && <button className='min-w-[150px] h-[60px] rounded-xl bg-white text-black px-2' disabled={loading} onClick={()=>handleUpdateAssistant()}>
        {!loading?"Finally create your assistant":"Loading..."}
      </button>
     }
      
    </div>
    
  )
}

export default Customize2
