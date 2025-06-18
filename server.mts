import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt("3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle room joining
    socket.on("join-room", ({ room, username }) => {
      socket.join(room);
      console.log(`${username} joined room: ${room}`);
      socket.to(room).emit("user-joined", `${username} joined the room ${room}`);
    });

    // Handle message broadcasting
    socket.on("message", ({ room, message, sender }) => {
      socket.to(room).emit("message", { sender, message });
    });

    // Handle typing event for a specific room
    socket.on("typing", ({ room, message }) => {
      console.log("Typing Event:", message);
      socket.to(room).emit("typing", message); // broadcast typing message to others in the room
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  console.log("✅ Socket.IO server is running");

  httpServer.listen(port, hostname, () => {
    console.log(`✅ Server is running on http://${hostname}:${port}`);
  });
});