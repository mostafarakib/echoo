import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import path from "path";
import { initSocket } from "./config/socket.js";

dotenv.config();

connectDB();
const app = express();
app.use(express.json()); // to accept json data

const PORT = process.env.PORT || 5000;

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

// Deployment code
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });
}
// Deployment code ends

//error handling middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = initSocket(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (!userData || !userData._id) return;
    socket.join(userData._id);
    socket.data.userId = String(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  // Track which chat a user is currently viewing
  socket.on("open chat", (chatId) => {
    socket.data.activeChat = chatId;
  });

  // Clear when leaving or switching to another chat
  socket.on("close chat", () => {
    socket.data.activeChat = null;
  });

  socket.on("typing", (room, senderId) =>
    socket.to(room).emit("typing", { room, senderId })
  );
  socket.on("stop typing", (room, senderId) =>
    socket.to(room).emit("stop typing", { room, senderId })
  );

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;

      // emit to user's personal room
      io.to(user._id).emit("message received", newMessage);

      // also emit to the chat room (if they have it open)
      io.to(chat._id).emit("message received", newMessage);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.data?.userId || socket.id);
    // leave personal room if set
    if (socket.data?.userId) {
      socket.leave(socket.data.userId);
    }
  });
});
