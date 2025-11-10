import Notification from "../models/notificationModel.js";

const getNotifications = async (req, res) => {
  try {
    const returnAll = String(req.query.all).toLowerCase() === "true";
    const filter = { recipient: req.user._id };

    if (!returnAll) {
      // only unread by default
      filter.isRead = false;
    }
    const notifications = await Notification.find(filter)
      .sort({ isRead: 1, createdAt: -1 })
      .populate("sender", "name pic email")
      .populate({
        path: "chat",
        select: "chatName isGroupChat users",
        populate: { path: "users", select: "name pic email" },
      })
      .populate("message", "content");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

const markAsRead = async (req, res) => {
  try {
    const { chatId, ids } = req.body;

    if (ids && Array.isArray(ids) && ids.length > 0) {
      await Notification.updateMany(
        {
          _id: { $in: ids },
          recipient: req.user._id,
        },
        { $set: { isRead: true } }
      );
      // no early return — continue to fetch remaining unread
    } else if (chatId) {
      await Notification.updateMany(
        {
          chat: chatId,
          recipient: req.user._id,
        },
        { $set: { isRead: true } }
      );
    } else {
      // fallback: mark all for this user as read
      await Notification.updateMany(
        { recipient: req.user._id },
        { $set: { isRead: true } }
      );
    }

    // Return the remaining unread notifications for the user
    const unread = await Notification.find({
      recipient: req.user._id,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name pic email")
      .populate({
        path: "chat",
        select: "chatName isGroupChat users",
        populate: { path: "users", select: "name pic email" },
      })
      .populate("message", "content");

    return res.status(200).json({ success: true, unread });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500);
    throw new Error(error.message);
  }
};

export { getNotifications, markAsRead };
