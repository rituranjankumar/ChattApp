import { useEffect, useState } from 'react'


import { io } from 'socket.io-client'
import './App.css'
import SignUpPage from './pages/SignUpPage';
import { useForm } from "react-hook-form";
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import { connectSocket } from './socket';
import { getSocket } from './socket';
import { setOnlineUsers } from './slices/onlineUserSlice';
 
const App = () => {
  const { token } = useSelector((state) => state.auth)
  console.log("app js")
  const dispatch = useDispatch();
  const { socketConnected } = useSelector((state) => state.onLineUser);
  const { user } = useSelector((state) => state.profile);
  
  useEffect(() => {

    const socket = getSocket();
    if (user?._id && !socketConnected) {
      connectSocket(user._id, dispatch );
    }

     
    if (!socket) return;

    socket.on("getOnlineUsers", (onlineUsers) => {
      console.log("online in app", onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    });

    // Cleanup on unmount / logout
    return () => {
      if (socket) {
        socket.off("getOnlineUsers");
      }
    };

  }, [user?._id, token]);
  return (
    <div className=" 
    bg-[url('./assets/bgImage.svg')]
    h-screen w-full   object-cover object-center overflow-hidden  ">
      <Routes>
        <Route path='*' element={<Error />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<SignUpPage />} />

        {/* <Route path='/profile' element={<ProfilePage />} /> */}
        <Route path='/dashboard'
          element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />

          <Route path='/profile'
          element={<ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>} />
      </Routes>
    </div>
  )


}

export default App
