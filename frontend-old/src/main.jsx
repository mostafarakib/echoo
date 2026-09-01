import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "./components/ui/provider.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Homepage from "./pages/Homepage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ChatProvider from "./context/ChatProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ChatProvider>
        <App />
      </ChatProvider>
    ),
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/chats", element: <ChatPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
