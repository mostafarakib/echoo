import { User } from "./user";
import { Message } from "./message";

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage?: Message;
  groupAdmin?: User;
  createdAt: string;
  updatedAt: string;
}
