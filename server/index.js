// Load environment variables
require("dotenv").config();

 
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { createServer } = require("http");

 
const { dbConnect } = require("./config/mongodbConnect");
const { cloudinaryConnect } = require("./config/cloudinaryConnect");
const messageRoute = require("./routes/messageRoute");
const userRouter = require("./routes/auth");
const { Server } = require("socket.io");

// Create Express app and HTTP server
const app = express();
const server = createServer(app);
//initialing socket.io server

const {initSocket}=require("./socket")
initSocket(server);
//   const io=new Server(server,{
//     connectionStateRecovery: {},
//     cors:{
//       origin:"*"
//     }
//   })

//   //store online users {userid:socketid}
// const userSocketMap = {}; // userId => Set of socket IDs
// module.exports={io,userSocketMap}
// io.on("connection", (socket) => {
//   const userId = socket.handshake.auth.userId;
  
// if(!userId) return ;
//   if (userId) {
//     if (!userSocketMap[userId]) {
//       userSocketMap[userId] = new Set();
//     }
//     userSocketMap[userId].add(socket.id);
//     console.log("User connected:", userId);
//   }
//       console.log("socket map ",userSocketMap);
//   // Emit online users
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", userId, socket.id);


//     if (userId && userSocketMap[userId]) {
//       userSocketMap[userId].delete(socket.id);

//       // Remove user if no sockets remain
//       if (userSocketMap[userId].size === 0) {
//         delete userSocketMap[userId];
//       }
//     }

//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });


// Connect to MongoDB
dbConnect();

// Connect to Cloudinary
cloudinaryConnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://chatt-app-rosy.vercel.app",
  "https://chatt-app-git-main-rituranjan-kumars-projects.vercel.app",
  "https://chatt-ixnitmu25-rituranjan-kumars-projects.vercel.app",
  "http://localhost:5173" // for local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

 
app.get("/", (req, res) => {
  res.send("Server is live");
});

// API Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRoute);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


 
