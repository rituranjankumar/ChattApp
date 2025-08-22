

// get all the users except the logged in user
const Message = require("../models/Message");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { io, userSocketMap } = require("../index");
const { getUserSocketMap, getIO } = require("../socket");
const { Socket } = require("socket.io");
exports.getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id; // set in verifyJWT middleware

        // Get all users except the current one
        const users = await User.find({ _id: { $ne: userId } })
            .select("firstName lastName profilePic email bio")

        //count the numebr of unseen messages

        const unseenMessages = {};
        const promises = users.map(async (user) => {
            const message = await Message.find({
                senderId: user._id,
                recieverId: userId,
                seen: false
            })
            if (message.length > 0) {
                unseenMessages[user._id] = message.length;

            }
        })
        await Promise.all(promises);

        // also get the latest message per user
        let latestMessages = await Message.aggregate([

            // match by sendr or reviever 
            {
                $match: {
                    $or: [{ senderId: userId },
                    { recieverId: userId }],
                }
            },
            // get the other user the logged in user is chatting with
            {
                $addFields: {
                    chattingWith: {
                        $cond: [
                            { $eq: ["$senderId", userId] }, "$recieverId", "$senderId"
                        ]
                    }
                }
            },

            {
                $sort: {
                    createdAt: -1
                }
            },

            // group them based ont the chatting with and return the latest message

            {
                $group: {
                    _id: "$chattingWith",
                    latestMess: { $first: "$$ROOT" }
                }
            }

        ]);




        res.status(200).json({
            success: true,
            users: users,
            unseenMessages: unseenMessages,
            latestMessages
        });

    } catch (error) {
        console.error("Error in getUsersForSidebar:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// get all message for selected user

// activete when any chat will opened and any user is selected 
//fetche messages and make the messages seen
exports.getSelectedUserMessage = async (req, res) => {
    try {
        const selectedUserId = req.params.userId;
        const myId = req.user._id;
        console.log("selcetded message ", selectedUserId,)
        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: selectedUserId },
                { senderId: selectedUserId, recieverId: myId },
            ]
        }).sort({ createdAt: 1 });

        //This means: Find all messages where the
        //  selected user sent messages to me
        //  (i.e., messages that I received).

        await Message.updateMany({ senderId: selectedUserId, recieverId: myId },
            { seen: true },
        );

        res.status(200).json({
            success: true,
            messages: messages,
        });


    } catch (error) {
        console.error("Error in getSelectedUserMessage:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// api to mark the message as seen using message id
exports.markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;



        await Message.findByIdAndUpdate(
            { _id: id },
            { seen: true },
        );

        res.status(200).json({
            success: true,
            messages: "message marked seen ",
        });


    } catch (error) {
        console.error("Error in markMessageAsSeen:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//send message
exports.sendMessage = async (req, res) => {
    try {
        const text = req.body?.text || null;

        const recieverId = req.params.userId;
        const senderId = req.user._id;

        console.log("sendmesssage controlller recievreid", recieverId)
        let imageUrl = null;

        if (req?.files && req?.files?.imageFile) {
            const uploadedImage = await uploadImageToCloudinary(req.files.imageFile, "ChatApp");
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            text: text,
            image: imageUrl,
        });


        console.log("NEW MESSAGES SEND IS ", newMessage);
        const userSocketMap = getUserSocketMap();
        const io = getIO();
        // instantly display the message to the user
        console.log("mapped users to socket ", userSocketMap)
        const recieverSocketId = userSocketMap[recieverId];  //  this is a Set

        if (recieverSocketId && recieverSocketId.size > 0) {
            for (const socketId of recieverSocketId) {
                io.to(socketId).emit("newMessage", newMessage);
                 io.to(socketId).emit("latestMessage", { userId: senderId, message: newMessage });
            }
        }



        // for latestMessage
        const senderSocketIds = userSocketMap[senderId];
        if (senderSocketIds?.size > 0) {
            for (const socketId of senderSocketIds) {
                io.to(socketId).emit("latestMessage", { userId: recieverId, message: newMessage });
            }
        }

        res.status(201).json({ success: true, message: newMessage });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.searchUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { query } = req.params; // frontend will send in params...
        if (!query) {
            return res.status(400).json({ success: false, message: "Query required" });
        }

        // Example with MongoDB User model
        let users = await User.find({
            firstName: { $regex: query, $options: "i" } // case-insensitive search
        }).select("firstName lastName profilePic email bio"); // only send selected fields


        // filter out current logged-in user
        users = users.filter(user => user._id.toString() !== userId.toString());

        return res.json({ success: true, users: users });
    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


