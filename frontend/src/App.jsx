import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import { useContext } from 'react'
import { userDataContext } from './context/userContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'

const App = () => {
    const {userData,setUserData}=useContext(userDataContext)
  return (
   <Routes>
    <Route path='/' element={(userData?.assistantImage && userData?.assistantName)?<Home></Home>:<Navigate to="/customize"></Navigate>}></Route>
    <Route path='/signup' element={!userData?<SignUp></SignUp>:<Navigate to="/"></Navigate>}></Route>
    <Route path='/signin' element={!userData?<SignIn></SignIn>:<Navigate to='/'></Navigate>}></Route> 
    <Route path='/customize' element={userData?<Customize></Customize>:<Navigate to={"/signup"}></Navigate>}></Route>
    <Route path='/customize2' element={userData?<Customize2></Customize2>:<Navigate to={"/signup"}></Navigate>}></Route>
   </Routes>
  )
}

export default App
