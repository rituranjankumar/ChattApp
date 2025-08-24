import { MESSAGE_API } from "./api";
import { apiConnector } from "../utills/ApiConnector";
import toast from "react-hot-toast";

export const getUserSelectedMessage = async (token, userId) => {
    try {
        const response = await apiConnector(
            "GET",
            MESSAGE_API.GET_MESSAGES_WITH_USER(userId),
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );

      //  console.log("userselected message",response?.data?.messages)
        return response?.data?.messages;
    } catch (error) {
      //  console.error("Error fetching messages:", error);

        // Show toast with specific error message
        toast.error(
            error?.response?.data?.message || "Failed to fetch messages. Please try again.",
            { duration: 3000 }
        );

        
    }
};


 

export const sendmessagetoSelectedUser = async (token, userId, text, imageFile) => {
  const formData = new FormData();
  if (text) formData.append("text", text);
  if (imageFile) formData.append("imageFile", imageFile);

  try {
    const response = await apiConnector(
      "POST",
      MESSAGE_API.SEND_MESSAGE(userId),
      formData,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
    );
    return response.data.message;
  } catch (error) {
   // console.error("Send message error:", error);
    toast.error(error?.response?.data?.message || "Failed to send message");
    return null;
  }
};


export const markMessagesAsSeen = async (token, messageId) => {
  try {
    await apiConnector("PUT", MESSAGE_API.MARK_AS_SEEN(messageId), null, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
   // console.error("Mark as seen error:", error);
    toast.error("Failed to mark message as seen");
  }
};

export const searchUserByInput=async(token,query)=>
{
   try {
    //  console.log("SEARCH QUERY -> ", query);

      const response = await apiConnector("GET",MESSAGE_API.SEARCH_USER(query),null,{
        Authorization:`Bearer ${token}`
      });
      if (response.data.success) {
       return   response.data.users;
      }
    } catch (error) {
     // console.error("Error searching user:", error);
    }
}