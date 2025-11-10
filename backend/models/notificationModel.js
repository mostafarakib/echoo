import mongoose from "mongoose";

const notificationModel = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationModel.index({ recipient: 1, isRead: 1 });
notificationModel.index({ recipient: 1, chat: 1, sender: 1 }, { unique: true });

const Notification = mongoose.model("Notification", notificationModel);

export default Notification;
