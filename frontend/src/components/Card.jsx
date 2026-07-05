import React from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({image}) => {

    const {serverUrl,userData,setUserData,frontendImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140] lg:w-[200px] lg:h-[300px] bg-blue-950 border-2 border-blue-800 rounded-2xl cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-blue-950 hover:border-4 hover:border-white ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-950 ":null}`} onClick={()=>{setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)}
    }>
        <img src={image} className='w-full h-full object-cover' />
      
    </div>
  )
}

export default Card
