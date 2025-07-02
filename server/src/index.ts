import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	})
);

const socketServer = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const socketToEmailMap = new Map<string, string>();
const emailToSocketMap = new Map<string, string>();

socketServer.on("connection", (socket) => {
	console.log(`Client connected to socket: ${socket.id}`);
	socket.onAny((event, ...args) => {
		console.log(`[SERVER] Received event: ${event}`, args);
	});

	socket.on("join:room", ({ email, roomId }) => {
		socketToEmailMap.set(socket.id, email);
		emailToSocketMap.set(email, socket.id);
		console.log(`User with email ${email} joined room ${roomId}`);

		socket.join(roomId);

		socketServer.to(roomId).emit("user:joined", { socketId: socket.id, email });
		socket.emit("join:room", { roomId, email });
	});

	socket.on("user:call", ({ to, offer }) => {
		console.log("Incoming call", to);
		socket.to(to).emit("incomming:call", { from: socket.id, offer });
	});

	socket.on("call:accepted", ({ socketId, answer }) => {
		socket.to(socketId).emit("call:accepted", { answer });
	});
});

server.listen(8081, () => {
	console.log(`Server is listening at port ${8081}`);
});
