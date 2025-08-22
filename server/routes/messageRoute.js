const express=require("express");
const messageRoute=express.Router();

const {auth}=require("../middleware/authMiddleware");
const {getUsersForSidebar,markMessageAsSeen,getSelectedUserMessage,checkAuth, sendMessage, searchUser} =require("../controllers/MessageController")


messageRoute.get("/users",auth,getUsersForSidebar);
messageRoute.get("/:userId",auth,getSelectedUserMessage);
messageRoute.put("/mark/:id",auth,markMessageAsSeen);
messageRoute.post("/send/:userId",auth,sendMessage);
messageRoute.get("/search/:query",auth,searchUser)

module.exports=messageRoute;