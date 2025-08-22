import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
 
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Services/authServices';
import { data } from 'react-router-dom';
 
import { setAllUsers, setLatestMessage, setunseenMessage } from '../slices/onlineUserSlice';

const Dashboard = () => {
  const {latestMessage}=useSelector((state) => state.onLineUser);
  const [selectedUser, setSelectedUser] = useState(null);
  const { token } = useSelector((state) => state.auth)
  const [users, setUsers] = useState([]);
  const [unseen, setunSeen] = useState([]);
  const [selectedUsermessages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const fetchUsers = async () => {
    try {
      //console.log(token)
      const data = await getAllUsers(token);
     // console.log("all side bar users ", data);

      //   Map of chattingWith ->  message
      const messagesMap = {};

      data.latestMessages.forEach(item => {
        const chatId = item.latestMess.chattingWith;

        if (!messagesMap[chatId]) {
          messagesMap[chatId] =null;
        }

        // push the whole message object
        messagesMap[chatId] =item.latestMess;
      });

      dispatch(setLatestMessage(messagesMap));
      
      // setUsers(data.users);
      // setunSeen(data.unseenMessages);
      //  console.log("data -> ",data)
      dispatch(setAllUsers(data.users))
      dispatch(setunseenMessage(data.unseenMessages));
      
  
    } catch (err) {
      console.error("Failed to load users", err);
    }
  }

  useEffect(() => {
  console.log("Latest Messages (after update) ", latestMessage);
}, [latestMessage]);
  useEffect(() => {
    fetchUsers();
  }, [])
  return (
    <div className="w-full h-screen overflow-hidden   bg-gradient-to-br from-[#1f1b2e] to-[#2c2641]">
      <div className="grid md:grid-cols-6 sm:grid-cols-2 backdrop-blur-lg border-2 border-gray-600 rounded-2xl overflow-hidden h-full">
        {/* Pass selectedUser to Sidebar */}
        <div className='col-span-2 h-full overflow-y-auto'>
          <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}
            setMessages={setMessages}
          />
        </div>


        <div className='col-span-4 min-h-full'>
          <ChatContainer setSelectedUser={setSelectedUser} selectedUser={selectedUser}
            selectedUsermessages={selectedUsermessages}
          />
        </div>


        {/* <RightSidebar setSelectedUser={setSelectedUser} selectedUser={selectedUser}/> */}
      </div>
    </div>
  );
};

export default Dashboard;
