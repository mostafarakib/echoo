import { authMiddleware } from "@/lib/middleware/auth";

const proxy = authMiddleware;

export const config = {
  matcher: ["/chats/:path*", "/login", "/signup"],
};

export default proxy;
