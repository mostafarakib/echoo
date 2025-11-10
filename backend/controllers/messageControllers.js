import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";
import Notification from "../models/notificationModel.js";
import { getIO } from "../config/socket.js";

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await User.populate(message, {
      path: "chat",
      populate: {
        path: "users",
        select: "name pic email",
      },
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    const recipients = (message.chat?.users || [])
      .filter((u) => String(u._id) !== String(req.user._id))
      .map((u) => String(u._id));

    let toInsert = [];
    let insertedNotifs = [];

    if (recipients.length > 0) {
      // delete existing unread notifications for this sender/chat/recipients
      await Notification.deleteMany({
        sender: req.user._id,
        chat: chatId,
        recipient: { $in: recipients },
        isRead: false,
      });

      // Then create one new notification per recipient
      toInsert = recipients.map((recipientId) => ({
        recipient: recipientId,
        sender: req.user._id,
        chat: message.chat._id,
        message: message._id,
        isRead: false,
      }));
    }

    if (toInsert.length > 0) {
      insertedNotifs = await Notification.insertMany(toInsert, {
        ordered: false,
      });
    }

    try {
      const io = getIO();

      const payloadBase = {
        chat: {
          _id: message.chat._id,
          chatName: message.chat.chatName,
          isGroupChat: message.chat.isGroupChat,
          users: message.chat.users || [],
        },
        sender: {
          _id: message.sender._id,
          name: message.sender.name,
          pic: message.sender.pic,
        },
        message: {
          _id: message._id,
          content: message.content,
        },
        createdAt: new Date().toISOString(),
      };
      // Emit to all inserted recipients
      const allToNotify = [...new Set([...recipients])];

      allToNotify.forEach((recipientId) => {
        const insertedForThis = insertedNotifs.find(
          (n) => String(n.recipient) === String(recipientId)
        );
        const payload = {
          _id: insertedForThis
            ? insertedForThis._id
            : `${message._id}-${recipientId}`, // fallback id
          ...payloadBase,
          recipient: recipientId,
          type: "replace",
        };
        try {
          io.to(String(recipientId)).emit("notification", payload);
        } catch (emitErr) {
          console.error("emit notification error to", recipientId, emitErr);
        }
      });
    } catch (ioError) {
      console.error("getIO error or emit error:", ioError);
    }

    // finally return the populated message
    res.status(201).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export { sendMessage, allMessages };
