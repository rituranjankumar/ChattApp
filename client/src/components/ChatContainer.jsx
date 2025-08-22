import React, { useRef, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { FiImage, FiSend } from 'react-icons/fi';
import assets from '../assets/assets';

import { sendmessagetoSelectedUser, markMessagesAsSeen } from '../Services/MessageServices';
import { timeFormatter } from '../utills/timefromatter';
import { setunseenMessage, updateUnseenMessage,updateLatestMessage } from '../slices/onlineUserSlice';
import { getSocket } from '../socket';
const ChatContainer = ({ selectedUser, setSelectedUser, selectedUsermessages }) => {
  const [messageInput, setMessageInput] = useState('');
  const { user } = useSelector((state) => state.profile)
  const [image, setImage] = useState(null);
  const [sending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const { allUsers, unseenMessage, onlineUsers, latestMessage } = useSelector((state) => state.onLineUser)


  useEffect(() => {
    setMessages(selectedUsermessages);
  }, [selectedUsermessages])

  //console.log("selected user ", selectedUser);
  //  console.log("selected user messages ", messages);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth)

  //scroll effect har message ke bad
  const scrollToBottomRef = useRef(null);

  useEffect(() => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = async () => {
    // agar send ho raha  hai aur image nhai ahai aur message inout khali hai 
    //to kuch nahi karna hai
    if (sending || (!messageInput.trim() && !image)) return;

    setIsSending(true);
    try {
      const sent = await sendmessagetoSelectedUser(token, selectedUser?._id, messageInput, image);
      if (sent) {
        setMessages((prev) => [...prev, sent]);
        setMessageInput("");
        setImage(null);
      }
    } catch (err) {
      console.error("Error sending message", err);
    } finally {
      setIsSending(false);
    }
  };


  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {

      console.log("MESSAGE RECIEVED IS ->  ", message)
      if (message.senderId === selectedUser?._id) {

        setMessages((prev) => [...prev, message]);
        markMessagesAsSeen(token, message._id);
      } else {
        dispatch(updateUnseenMessage({
          userId: message?.senderId,
          count: unseenMessage?.[message?.senderId] ? unseenMessage[message?.senderId] + 1 : 1
        }));
      }
    };

    // handle latest MESSAGE
    const handleLatestMessage = ({ userId, message }) => {

       console.log("📩 LatestMessage received:", { userId, message });
      dispatch(updateLatestMessage({ userId, message }));
    };

    socket.on("latestMessage", handleLatestMessage)
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage");
      socket.off("latestMessage") // clean up on unmount
    };
  }, [selectedUser, token, unseenMessage, latestMessage]);
  // console.log("unseen messages ARRE", unseenMessage);


  return selectedUser ? (
    <div
      className="h-screen relative   flex flex-col bg-cover bg-center backdrop-blur-lg"
      style={{ backgroundImage: `url(${assets.chat_bg})` }}
    >
      {/* Header */}
      <div className="flex  h-[60px] items-center gap-3 py-3 px-4 border-b border-stone-500 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md z-10">
        <img
          src={selectedUser?.profilePic || assets.profile_martin}
          alt={selectedUser?.firstName || 'User'}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="flex text-lg text-white flex-1 items-center   gap-2 font-medium">
          {selectedUser?.firstName} {selectedUser?.lastName}
          <span className={`w-2 h-2 flex  ${onlineUsers.includes(selectedUser?._id) ? 'bg-green-500' : 'bg-gray-500'} rounded-full  `}></span>
          <span>{onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}</span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden text-white w-7 cursor-pointer"
          alt="Back"
        />
        <img
          src={assets.help_icon}
          className="hidden md:block w-5 cursor-pointer"
          alt="Help"
        />
      </div>

      {/* Message Scrollable Section */}
      <div className="  flex-1 overflow-y-auto   bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900    ">

        <div className="p-4   flex flex-col gap-6">
          {messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end w-fit gap-2 ${msg?.senderId !== user?._id
                ? 'justify-start'
                : 'justify-end self-end'
                }`}
            >
              {msg.image && !msg.text && (
                <img src={msg.image} className="max-w-xs rounded-lg" />
              )}

              {!msg.image && msg.text && (
                <div>
                  <p
                    className={`px-4 py-2 rounded-lg text-white ${msg.senderId === user?._id
                      ? 'bg-blue-500 rounded-br-none'
                      : 'bg-gray-700 rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </p>
                </div>
              )}


              {msg.image && msg.text && (
                <div className='flex flex-col'>
                  <img src={msg.image} className="max-w-xs rounded-lg" />
                  <p
                    className={`px-4 py-2 w-fit self-end rounded-lg text-white ${msg.senderId === user?._id
                      ? 'bg-blue-500 rounded-br-none'
                      : 'bg-gray-700 rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </p>
                </div>
              )}



              <div className="text-center text-xs">
                <img
                  className="w-7 h-7 rounded-full"
                  src={
                    msg.senderId === selectedUser._id
                      ? selectedUser?.profilePic
                      : user?.profilePic
                  }
                  alt=""
                />
                <p className="text-gray-400">{timeFormatter(msg.createdAt)}</p>
              </div>



            </div>

          ))}
        </div>
        <div ref={scrollToBottomRef}>

        </div>
      </div>

      {/* Message Input */}
      <div className="min-w-full h-[64px] px-4 py-3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center gap-2 border-t border-stone-600 z-10">
        {/* Upload Button */}
        <label className="cursor-pointer relative p-2 rounded-full hover:bg-gray-700 transition-colors">
          {/* Image Preview */}
          {image && (
            <div className="absolute -top-16 left-0 w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg">
              <img
                src={URL.createObjectURL(image)}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            </div>
          )}

          <input
            disabled={sending}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files?.[0])}
          />
          <FiImage className="w-5 h-5 text-gray-300" />
        </label>

        {/* Text Input */}
        <input
          disabled={sending}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          type="text"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);

          }}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!messageInput.trim() && !image}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 duration-300 cursor-pointer hover:scale-105 transition-all"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>

    </div>
  ) : (
    <div className="flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex-col items-center justify-center gap-4 text-gray-400 max-md:hidden h-full px-4">
      <img src={assets.logo_icon} alt="Logo" className="w-16   h-16" />
      <p className="text-lg font-semibold text-white text-center">
        Chat Anytime, Anywhere
      </p>
    </div>
  );
};

export default ChatContainer;
