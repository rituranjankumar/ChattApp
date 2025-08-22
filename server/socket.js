let io = null;
const userSocketMap = {}; // userId => Set of socket IDs
 const { Server } = require("socket.io");
const initSocket = (server) => {
 

  io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) return;

    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }

    userSocketMap[userId].add(socket.id);
    console.log("User connected:", userId);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId, socket.id);
      if (userSocketMap[userId]) {
        userSocketMap[userId].delete(socket.id);
        if (userSocketMap[userId].size === 0) {
          delete userSocketMap[userId];
        }
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

const getIO = () => io;
const getUserSocketMap = () => userSocketMap;

module.exports = {
  initSocket,
  getIO,
  getUserSocketMap,
};
