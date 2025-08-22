let io = null;
const userSocketMap = {}; // userId => Set of socket IDs
 const { Server } = require("socket.io");
const initSocket = (server) => {
 

 const allowedOrigins = [
  "https://chatt-app-rosy.vercel.app",
  "https://chatt-app-git-main-rituranjan-kumars-projects.vercel.app",
  "https://chatt-ixnitmu25-rituranjan-kumars-projects.vercel.app",
  "http://localhost:3000"
];

io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: allowedOrigins,
    credentials: true,
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
