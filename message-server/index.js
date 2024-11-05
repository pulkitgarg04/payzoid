import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import messageRouter from "./routes/message.route";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL || "*"}`,
    credentials: true,
  },
});

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL || "*"}`,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/message", messageRouter);

io.on("connection", (socket) => {
  const { id } = socket.client;
  console.log(`User connected: ${id}`);
});

socket.on("sendMessage", (data) => {
  console.log(data);
  io.emit("receiveMessage", data);
});

socket.on("disconnect", () => {
  console.log(`User disconnected: ${id}`);
});

const startServer = async () => {
  try {
    mongoose.connect(`${process.env.MONGO_URI}`).then(() => {
      console.log("db connected");
      app.listen(process.env.PORT || 8080, () => {
        console.log(
          `PayZoid Message Server is running on port ${process.env.PORT}`
        );
      });
    });
  } catch (error) {
    console.log("Error while connecting to Mongo DB: ", error.message);
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("Hello from PayZoid Message Server!");
});
