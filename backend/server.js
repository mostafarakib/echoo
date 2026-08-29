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
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import User from "./models/userModel.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:3000";

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

app.get("/", (req, res) => res.send("API is running"));

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = initSocket(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigin,
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const rawCookies = socket.handshake.headers.cookie;
    if (!rawCookies) return next(new Error("Authentication error"));

    const parsed = cookie.parse(rawCookies);
    const token = parsed.jwt;
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return next(new Error("Authentication error"));

    socket.data.userId = String(user._id);
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io", socket.data.userId);
  socket.join(socket.data.userId);

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
    socket.to(room).emit("typing", { room, senderId }),
  );
  socket.on("stop typing", (room, senderId) =>
    socket.to(room).emit("stop typing", { room, senderId }),
  );

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;

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
