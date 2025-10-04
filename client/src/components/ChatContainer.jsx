import React, { useRef, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { FiImage, FiSend } from 'react-icons/fi';
import assets from '../assets/assets';
import { clickOutSideEfffect } from '../utills/clickOutSideEffect';
// for emogy
import EmojiPicker from "emoji-picker-react";
import { FiSmile } from "react-icons/fi"; // emoji icon
import { MdOutlineCancel } from "react-icons/md";
import { sendmessagetoSelectedUser, markMessagesAsSeen } from '../Services/MessageServices';
import { timeFormatter } from '../utills/timefromatter';
import { setunseenMessage, updateUnseenMessage, updateLatestMessage } from '../slices/onlineUserSlice';
import { getSocket } from '../socket';
const ChatContainer = ({ selectedUser, setSelectedUser, selectedUsermessages, userMessageLoading }) => {
  const [messageInput, setMessageInput] = useState('');
  const { user } = useSelector((state) => state.profile)
  const [image, setImage] = useState(null);
  const [sending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const { allUsers, unseenMessage, onlineUsers, latestMessage } = useSelector((state) => state.onLineUser)
  const [messageLoading, setMessageLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojiRef = useRef();
  clickOutSideEfffect(emojiRef, () => setShowEmojiPicker(false));


  const inputRef = useRef();
  useEffect(() => {
    setMessages(selectedUsermessages);
    setMessageLoading(false);
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
      //  console.error("Error sending message", err);
    } finally {
      setIsSending(false);
    }
  };




  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {

      //console.log("MESSAGE RECIEVED IS ->  ", message)
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

      // console.log(" LatestMessage received:", { userId, message });
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

  // for focus on the input after message send
  useEffect(() => {
    if (messageInput === "") {
      inputRef.current?.focus();
    }
  }, [messageInput]);
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
      {/* <div className="  flex-1 overflow-y-auto   bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900    ">

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
      </div> */}


      {userMessageLoading ?

        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-green-00 text-sm animate-pulse">Loading Chat...</p>
        </div>


        :
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
                    loading='lazy'
                  />
                  <p className="text-gray-400">{timeFormatter(msg.createdAt)}</p>
                </div>



              </div>

            ))}
          </div>
          <div ref={scrollToBottomRef}>

          </div>
        </div>}


      {/* Message Input */}
      <div className="min-w-full h-[64px] relative px-4 py-3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center gap-2 border-t border-stone-600 z-10">
        {/* Upload Button */}
        <label className="cursor-pointer relative p-2 rounded-full hover:bg-gray-700 transition-colors">
          {/* Image Preview */}
          {image && (
            <div className="absolute -top-16 left-0 w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg">
              <img
                src={URL.createObjectURL(image)}
                className="w-full h-full z-10 object-cover"
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

        {image && <MdOutlineCancel className='absolute h-7 w-7 left-0.5 top-[0px] right-0 z-30 text-red-700 overflow-visible   rounded-full cursor-pointer p-1  ' onClick={() => setImage(null)} />}

        {/* Emoji Button */}
        <div
          ref={emojiRef}
          className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <FiSmile className="w-5 h-5 text-gray-300" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker
                onEmojiClick={(emoji) =>
                  setMessageInput((prev) => prev + emoji.emoji)
                }
                theme="dark"
              />
            </div>
          )}
        </div>


        {/* Text Input */}
        <input
          disabled={sending}
          ref={inputRef}
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
          disabled={(!messageInput.trim() && !image) || sending}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 duration-300 cursor-pointer hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>

      </div>

    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-6 h-full px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 max-md:hidden">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
        <img src={assets.chatIcon} alt="Logo" className="w-12 h-12" />
      </div>
      <p className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Chat Anytime, Anywhere
      </p>
      <p className="text-gray-400 text-center max-w-xs">
        Stay connected with friends and colleagues with instant messaging and media sharing.
      </p>
    </div>

  );
};

export default ChatContainer;
