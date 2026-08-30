import { User } from "./user";
import { Chat } from "./chat";

export interface Notification {
  _id: string;
  recipient: string;
  sender: User;
  chat: Chat;
  message: { _id: string; content: string };
  isRead: boolean;
  createdAt: string;
}
