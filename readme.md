# Echoo – Real-Time Chat Application

A full-stack, real-time messaging application built with **React, Node.js, Express, MongoDB, and Socket.io.**  
Echoo supports instant messaging, dynamic notifications, group chats, and a clean modern UI built with **Chakra UI**.  
This project demonstrates production-level architecture, state management, authentication flows, and real-time WebSocket communication.

## 🚀 Live Demo

🔗 **Frontend (Static Hosting)**: [Click here](https://echoo-c9pm.onrender.com/)  
🔗 **Backend API**: [Click here](https://echoo-c9pm.onrender.com/)

## Features

### 🔐 Authentication

- JWT-based secure login & signup
- Persistent user sessions
- Protected routes on both frontend & backend

### Real-Time Messaging

- One-to-one & group chats
- Instant message delivery via Socket.io
- Typing indicators

### 🔔 Smart Notifications

- Real-time notifications for new messages
- Backend-merged notifications → only last message per sender shown
- No notification if the chat with sender is already active
- Auto-update and replace when new message comes

### 👥 Chat Management

- Search users
- Create group chats
- Rename group
- Add/remove users from group
- Latest message preview

### 🎨 Modern UI

- Built with Chakra UI
- Responsive SideDrawer
- Clean chat layout
- Smooth UX

### ☁️ Deployment

- Backend deployed on Render
- Frontend built with Vite and served via Render Static Site
- Automatic build pipeline for frontend from root package.json

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- Chakra UI
- React Router
- Axios
- Socket.io Client

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- Socket.io
- JSON Web Tokens (JWT)
