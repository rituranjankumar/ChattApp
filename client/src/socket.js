import { io } from "socket.io-client";
import { setOnlineUsers, setSocketConnected, setunseenMessage } from "./slices/onlineUserSlice";
import { useSelector } from "react-redux";
 
const backendUrl = import.meta.env.VITE_BACKEND_URL;
let socket = null;

export const connectSocket = (userId, dispatch) => {

 if (socket ) return; // Prevent duplicate socket connections
  //console.log(backendUrl)
    socket = io(backendUrl, {
      
    auth: {
      userId: userId
    },
  });
  socket.on("connect", () => {
    console.log(" Socket connected: ", socket.id);
    dispatch(setSocketConnected(true));
  });

  socket.on("getOnlineUsers", (onlineUsers) => {
    console.log("online ", onlineUsers)
    dispatch(setOnlineUsers(onlineUsers));
  });

 


};

export const getSocket = () => socket;

export const disconnectSocket = (dispatch) => {
  if (socket) {
    console.log("Manually disconnecting socket...");
    socket.off();          //   remove all listeners
    socket.disconnect();
    socket = null;  //   clear local socket
     dispatch(setSocketConnected(false)); //update Redux
  }
};




