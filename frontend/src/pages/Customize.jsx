import React, { useRef,useState } from 'react'
import image1 from '../assets/image1.webp'
import image2 from '../assets/image2.webp'
import Card from '../components/Card'
import { useContext } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";
const Customize = () => {
  
    const {serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
   const inputImage=useRef()

   const navigate=useNavigate()

   const handleImage=(e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
   }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020263] flex flex-col items-center justify-center gap-8'>
      <IoMdArrowRoundBack className='text-white absolute top-[30px] left-[60px] text-2xl cursor-pointer' onClick={()=>navigate('/')}/>

          <h1 className='text-white text-[30px] text-center'>Select <span className='text-blue-800 font-bold'>Virtual Assistant</span> Image</h1>
        <div className='w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-6'>

            <Card image={image1}></Card>
      <Card image={image2}></Card>

      <div className={`w-[70px] h-[140] lg:w-[200px] lg:h-[300px] bg-blue-950 border-2 border-blue-800 rounded-2xl cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950 ":null}`} onClick={()=>{
        inputImage.current.click()
        setSelectedImage("input")
      }}>
        
      <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
       {frontendImage ? (
    <img
      src={frontendImage}
      alt="Uploaded"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-white">
      Upload Image
    </div>
  )}
      
    </div>

   
        </div>
        {selectedImage &&  <button onClick={()=>
          navigate("/customize2")
        } className='min-w-[150px] h-[60px] rounded-xl bg-white text-black'>Next</button>}
         
      
    </div>
  )
}

export default Customize
