require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (s) => {
  console.log(`Socket ${s.id} connected`);
  s.on("create-room", (fileId) => {
    s.join(fileId);
  });
  s.on("send-changes", (deltas, fileId) => {
    s.to(fileId).emit("receive-changes", deltas, fileId);
  });
  s.on("send-cursor-move", (range, fileId, cursorId) => {
    s.to(fileId).emit("receive-cursor-move", range, fileId, cursorId);
  });
});

server.listen(process.env.PORT, () => {
  console.log("SERVER IS RUNNING on", process.env.PORT);
});
