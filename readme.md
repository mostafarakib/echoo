# Echoo 

A real-time chat app - think of a lightweight Discord/Messenger. Built solo, end to end: auth, live messaging, group chats, notifications, all wired together with sockets.

## Live app: [https://echoo-chat.vercel.app](https://echoo-chat.vercel.app)

## What it does

- Sign up / log in with secure, cookie-based auth
- One-on-one and group chats
- Messages arrive instantly — no refreshing, powered by Socket.io
- Typing indicators
- Live notifications for new messages, even when you're not in that chat
- Create groups, rename them, add/remove members, leave a group
- Search for users to start a new conversation


## Tech Stack

**Frontend** — Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Query, Zustand, Motion, Socket.io Client

**Backend** — Node.js, Express, MongoDB, Socket.io, JWT (httpOnly cookies)

**Deployed on** Vercel (frontend) + Render (backend) + MongoDB Atlas

## A bit about the build

The backend and frontend live in this repo but deploy separately. Auth uses httpOnly cookies rather than tokens in local storage, and the Socket.io connection is authenticated at the handshake — not something the client can spoof by just sending a user ID.

The frontend went through a full rebuild from an earlier React + Chakra UI version into Next.js and TypeScript, which is part of why the code is organized the way it is — API layer, hooks, and state are kept in separate, clearly scoped folders rather than everything living inside components.

## Running it locally

```bash
# backend
npm install
npm run server   # http://localhost:5000

# frontend
cd frontend
npm install
npm run dev       # http://localhost:3000
```

You'll need a `.env` in root folder (Mongo URI, JWT secret, client URL) and a `.env.local` in `frontend` (API URL, Cloudinary keys if you want profile picture uploads working).

## 📸 Screenshots

<img width="1912" height="885" alt="image" src="https://github.com/user-attachments/assets/e18a6a56-0545-4f47-bb8c-b023fd452260" />
<img width="1914" height="884" alt="image" src="https://github.com/user-attachments/assets/ac170c7c-36bf-4c0c-8d89-51d40b56c172" />
<img width="1908" height="888" alt="image" src="https://github.com/user-attachments/assets/fc1504a8-9d4b-4bb5-a3e2-c4fb6dd8b596" />
<img width="1918" height="887" alt="image" src="https://github.com/user-attachments/assets/2e372773-a892-43a4-8346-53b6d6029768" />
<img width="1897" height="886" alt="image" src="https://github.com/user-attachments/assets/5968a1e5-cf12-4ce1-9c51-672955f7aab6" />

