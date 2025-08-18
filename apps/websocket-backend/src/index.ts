import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) return;
  const token = new URLSearchParams(url.split("?")[1]).get("token") || "";

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded?.userId) return ws.terminate();
    const userId = decoded.userId;

    users.push({ ws, rooms: [], userId });
    console.log(`✅ User connected: ${userId}`);

    ws.on("message", (data) => {
      const parsedData = JSON.parse(data.toString());

      // Room join / leave
      if (parsedData.type === "join_room") {
        const user = users.find((u) => u.ws === ws);
        user?.rooms.push(parsedData.roomId);
        console.log(`✅ User ${user?.userId} joined room ${parsedData.roomId}`);
      }
      if (parsedData.type === "leave_room") {
        const user = users.find((u) => u.ws === ws);
        if (user) user.rooms = user.rooms.filter((r) => r !== parsedData.roomId);
      }

      // Chat messages
      if (parsedData.type === "CHAT") {
        const roomUsers = users.filter((u) => u.rooms.includes(parsedData.roomId));
        roomUsers.forEach((u) => u.ws.send(JSON.stringify(parsedData)));
      }

      // Whiteboard events
      if (parsedData.type === "ADD_SHAPE" || parsedData.type === "DELETE_SHAPE") {
        const roomUsers = users.filter((u) => u.rooms.includes(parsedData.roomId) && u.ws !== ws);
        roomUsers.forEach((u) => u.ws.send(JSON.stringify(parsedData)));
      }
    });

    ws.on("close", () => {
      const idx = users.findIndex((u) => u.ws === ws);
      if (idx !== -1 && users[idx]) {
        console.log(`❌ User disconnected: ${users[idx].userId}`);
        users.splice(idx, 1);
      }
    });
  } catch (e) {
    console.error("JWT verification failed:", e);
    ws.terminate();
  }
});

