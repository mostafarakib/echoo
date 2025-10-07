import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChatExist = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChatExist = await User.populate(isChatExist, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChatExist.length > 0) {
    res.send(isChatExist[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {}
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    // load chat and its admin
    const chat = await Chat.findById(chatId).populate(
      "groupAdmin",
      "-password"
    );
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // ensure requester is admin
    if (chat.groupAdmin._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admins can add member!" });
    }

    // add user to chat
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } }, // use $addToSet to avoid duplicates
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(added);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    // load chat and its admin
    const chat = await Chat.findById(chatId).populate(
      "groupAdmin",
      "-password"
    );
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // ensure requester is admin
    if (chat.groupAdmin._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only admins can remove member!" });
    }

    // remove user from chat
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(removed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
