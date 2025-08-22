// const Group = require("../models/Group");
// const Message = require("../models/Message");
// const { uploadImageToCloudinary } = require("../utils/imageUploader");
// const { io, userSocketMap } = require("../index");

// // 🔹 Helper to join all group members to a Socket.IO room
// const joinGroupRoom = (groupId, members) => {
//   members.forEach(memberId => {
//     const socketId = userSocketMap[memberId];
//     if (socketId) {
//       const socket = io.sockets.sockets.get(socketId);
//       if (socket) socket.join(groupId.toString());
//     }
//   });
// };

// // 📌 1. Create Group
// exports.createGroup = async (req, res) => {
//   try {
//     const { name, members } = req.body;
//     const createdBy = req.user._id;

//     if (!name || !Array.isArray(members)) {
//       return res.status(400).json({ success: false, message: "Invalid group data" });
//     }

//     if (!members.includes(createdBy.toString())) members.push(createdBy);

//     const group = await Group.create({ name, members, createdBy });

//     joinGroupRoom(group._id, group.members);

//     io.to(group._id.toString()).emit("groupCreated", group);

//     res.status(201).json({ success: true, message: "Group created successfully", group });
//   } catch (err) {
//     console.error("Create Group Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // 📌 2. Send Group Message
// exports.sendGroupMessage = async (req, res) => {
//   try {
//     const senderId = req.user._id;
//     const { text } = req.body;
//     const { groupId } = req.params;

//     let imageUrl;
//     if (req?.files?.image) {
//       const uploaded = await uploadImageToCloudinary(req.files.image, "ChatApp/Groups");
//       imageUrl = uploaded.secure_url;
//     }

//     const message = await Message.create({
//       senderId,
//       groupId,
//       text,
//       image: imageUrl,
//     });

//     // Emit to entire group room
//     io.to(groupId.toString()).emit("newGroupMessage", { groupId, message });

//     res.status(201).json({ success: true, message });
//   } catch (err) {
//     console.error("Group Message Error:", err.message);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 📌 3. Rename Group
// exports.renameGroup = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { name } = req.body;
//     const userId = req.user._id;

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ success: false, message: "Group not found" });

//     if (group.createdBy.toString() !== userId.toString()) {
//       return res.status(403).json({ success: false, message: "Only creator can rename" });
//     }

//     group.name = name;
//     await group.save();

//     io.to(groupId.toString()).emit("groupRenamed", {
//       groupId: group._id,
//       newName: group.name,
//     });

//     res.status(200).json({ success: true, message: "Renamed", group });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // 📌 4. Add Members to Group
// exports.addMembersToGroup = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { members } = req.body;
//     const userId = req.user._id;

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ success: false, message: "Group not found" });

//     if (group.createdBy.toString() !== userId.toString()) {
//       return res.status(403).json({ success: false, message: "Only creator can add members" });
//     }

//     const existingIds = group.members.map(id => id.toString());
//     const newMembers = members.filter(m => !existingIds.includes(m));

//     group.members.push(...newMembers);
//     await group.save();

//     joinGroupRoom(groupId, newMembers);

//     io.to(groupId.toString()).emit("groupMembersAdded", {
//       groupId,
//       newMembers,
//     });

//     res.status(200).json({ success: true, group });
//   } catch (err) {
//     console.error("Add Members Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// //  5. Remove Member from Group
// exports.removeMemberFromGroup = async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const { memberId } = req.body;
//     const userId = req.user._id;

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ success: false, message: "Group not found" });

//     if (group.createdBy.toString() !== userId.toString()) {
//       return res.status(403).json({ success: false, message: "Only creator can remove members" });
//     }

//     if (memberId === group.createdBy.toString()) {
//       return res.status(400).json({ success: false, message: "Creator cannot remove themselves" });
//     }

//     group.members = group.members.filter(id => id.toString() !== memberId);
//     await group.save();

//     io.to(groupId.toString()).emit("groupMemberRemoved", {
//       groupId,
//       removedMemberId: memberId,
//     });

//     const removedSocketId = userSocketMap[memberId];
//     if (removedSocketId) {
//       io.sockets.sockets.get(removedSocketId)?.leave(groupId.toString());
//       io.to(removedSocketId).emit("youRemovedFromGroup", { groupId });
//     }

//     res.status(200).json({ success: true, group });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // 6. Get Group Messages
// exports.getGroupMessages = async (req, res) => {
//   try {
//     const { groupId } = req.params;

//     const messages = await Message.find({ groupId })
//       .sort({ createdAt: 1 })
//       .populate("senderId", "firstName lastName profilePic");

//     res.status(200).json({ success: true, messages });
//   } catch (error) {
//     console.error("Get Group Messages Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
