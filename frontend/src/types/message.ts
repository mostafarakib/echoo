import { User } from "./user";
import { Chat } from "./chat";

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  createdAt: string;
}
