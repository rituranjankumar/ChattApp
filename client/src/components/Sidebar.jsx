import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../Services/authServices';
import toast from 'react-hot-toast';
import { getUserSelectedMessage, searchUserByInput } from '../Services/MessageServices';
import { setunseenMessage, updateUnseenMessage } from '../slices/onlineUserSlice';

const Sidebar = ({ selectedUser, setSelectedUser, setMessages }) => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth)
  //const [dummyUser,setDummyUser]=useState([]);
  const dispatch = useDispatch();
  const { allUsers, unseenMessage, latestMessage, onlineUsers } = useSelector((state) => state.onLineUser)
  const [searchQuery, setSearchQuery] = useState("");

  const [searchedUsers, setSearchedUser] = useState([]);


  // select which users to show either the searched or all the users
  const usersToShow = searchQuery.length > 0 ? searchedUsers : allUsers;

  const searchUser = async (query) => {
    if (query.length == 0) {
      setSearchedUser([]);
      return;
    }
    console.log("SEARCH QUERY -> ", query)
    try {
      const response = await searchUserByInput(token, query)
      setSearchedUser(response);
      console.log("RESPONSE FROM THE SEARCH USER ", response)
    } catch (error) {
      console.log("error int the search uesr by input in sidebar")
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUser(searchQuery)
    }, 500)

    return () => {
      clearTimeout(timer);
    }
  }, [searchQuery])
  // useEffect(() => {
  //   console.log("🔄 Rendering with onlineUsers:", onlineUsers);
  // }, [onlineUsers]);

  const clickHandler = async (user) => {
    try {

      //  console.log("selected user id in getselected user message ",user?._id)
      const userMessage = await getUserSelectedMessage(token, user._id)

      console.log("user message response ", userMessage);
      setMessages(userMessage);

    } catch (error) {
      console.log("error in the userselected chat ", error)
    }
    // setunseen messages seen
    dispatch(setunseenMessage({ selectedUser: user?._id, count: 0 }));
  }


  useEffect(() => {

    if (selectedUser?._id) {
      clickHandler(selectedUser);
    }
    console.log("online users ", onlineUsers)


  }, [selectedUser])

  const logout = () => {
    Logout(dispatch, navigate)
  }

  useEffect(() => {
    console.log("Users to show updated:", usersToShow);
  }, [usersToShow]);
  // setDummyUser(dummyUser);
  // console.log("all users ", allUsers);
  return (
    <div
      className={`${selectedUser ? 'max-md:hidden' : ''
        } h-full p-5 rounded-r-xl overflow-y-scroll    text-white bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900`}
    >
      {/* Header with logo and menu */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img
            src={assets.logo}
            alt="logo"
            className="max-w-40"
          />

          {/* Dropdown Menu */}
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-4 rounded-md bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border border-gray-600 text-gray-100 hidden group-hover:block transition-all duration-200 shadow-md">
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm hover:underline"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm hover:underline">Logout</p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-[#5c565655] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          <input
            onChange={(e) => {
              setSearchQuery(e.target.value.trim())

              // searchUser(e.target.value.trim())
            }}
            type="text"
            className="bg-transparent border-none text-white text-sm flex-1 placeholder-blue-400 focus:outline-none"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col h-screen gap-2">
        {usersToShow?.map((user, index) => (
          <div
            key={user._id || index}
            onClick={() => {
              setSelectedUser(user)
              clickHandler(user);
            }}
            className={`relative flex items-center   gap-3 pl-4 pr-2 py-2 rounded-2xl transition-all hover:bg-[#4e4b5745] cursor-pointer ${selectedUser?._id === user._id ? 'bg-[#282142]' : ''
              }`}
          >
            <img
              className="w-[35px] aspect-square rounded-full object-cover"
              src={user?.profilePic || assets.avatar_icon}
              alt={user.fullName}
            />
            <div className=" justify-self-start flex-1  ">
              <p className="font-medium">{user.firstName}</p>
              <span
                className={`text-xs w-fit ${onlineUsers.includes(user?._id)
                  ? 'text-green-400' : 'text-neutral-400'
                  }`}
              >
                {onlineUsers.includes(user?._id)
                  ? 'Online' : 'Offline'}
              </span>
            </div>
            {/* for the latest Messages */}

            <div className="flex-1   flex-col gap-0.5 items-center md:flex-row sm:flex hidden  text-center">
                    <div>
                       { latestMessage[user?._id]?.senderId === user?._id
        ?  (<p className='text-gray-500'>{user?.firstName} :</p>)
        :  (<p className='text-gray-500'>{latestMessage[user?._id]?.text.length>0 && "you :"}</p>)
         }
                    </div>
              <div className="  text-sm text-gray-200">
                {latestMessage[user?._id]?.text
                  ? `${latestMessage[user?._id].text.slice(0,10)}`
                  : latestMessage[user?._id]?.image
                    ? "📷 Image"
                    : ""}
              </div>
            </div>


            {unseenMessage[user?._id] > 0 && (
              <span className="    bg-blue-500 rounded-full text-xs w-6 h-6 flex items-center justify-center">
                {unseenMessage[user?._id]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
