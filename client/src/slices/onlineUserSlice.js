import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  onlineUsers: [],

  socketConnected: false,

  allUsers: [],
  unseenMessage: {},
  selectedUser: null,
  latestMessage:{}
};

const onlineUsers = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    setLatestMessage:(state,action)=>
    {
      state.latestMessage=action.payload;
    },

     updateLatestMessage: (state, action) => {
      const { userId, message } = action.payload;
      state.latestMessage[userId] = message;
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload
    },
    setunseenMessage: (state, action) => {
state.unseenMessage = action.payload;
},

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    updateUnseenMessage: (state, action) => {
      const { userId, count } = action.payload;
      state.unseenMessage[userId] = count;
    },

  },
});

export const {setLatestMessage, setSelectedUser,updateLatestMessage, setSocketConnected, updateUnseenMessage, setOnlineUsers, setunseenMessage, setSocket, setAllUsers } = onlineUsers.actions;
export default onlineUsers.reducer;
