import { User } from "@/types/user";
import { Message } from "@/types/message";

export const getSender = (loggedUser: User, users: User[]): string => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getFullSender = (loggedUser: User, users: User[]): User => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (
  messages: Message[],
  m: Message,
  i: number,
  userId: string,
): boolean => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (
  messages: Message[],
  i: number,
  userId: string,
): boolean => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    !!messages[messages.length - 1].sender._id
  );
};
