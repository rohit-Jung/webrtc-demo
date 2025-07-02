import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../providers/Socket";

const Homepage = () => {
	const [emailId, setEmailId] = useState<string>("");
	const [roomId, setRoomId] = useState<string>("");
	const { socket } = useSocket();
	const navigate = useNavigate();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!emailId || !roomId) {
			alert("Please enter email and room id");
			return;
		}

		socket.emit("join:room", { email: emailId, roomId });
	};

	const handleRoomJoin = useCallback(
		({ roomId, email }: { roomId: string; email: string }) => {
			navigate(`/room/${roomId}`, { state: { roomId, email } });
		},
		[navigate]
	);

	useEffect(() => {
		socket.on("join:room", handleRoomJoin);
		return () => {
			socket.off("join:room", handleRoomJoin);
		};
	}, [socket, handleRoomJoin]);

	return (
		<form
			autoComplete="off"
			onSubmit={handleSubmit}
			className="w-full min-w-[600px] p-10 bg-white rounded-lg shadow"
			aria-label="room-form"
		>
			<h2 className="mb-10 text-3xl font-bold text-center">Join Room Form</h2>
			<div className="flex flex-col items-start mb-5 gap-y-3">
				<label
					htmlFor="email"
					className="text-sm font-medium cursor-pointer"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					value={emailId}
					onChange={(e) => setEmailId(e.target.value)}
					className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
					placeholder="Enter your email address..."
				/>
			</div>
			<div className="flex flex-col items-start mb-5 gap-y-3">
				<label
					htmlFor="roomId"
					className="text-sm font-medium cursor-pointer"
				>
					RoomID
				</label>
				<input
					id="roomId"
					value={roomId}
					onChange={(e) => setRoomId(e.target.value)}
					className="w-full p-4 bg-transparent border border-gray-200 rounded-lg outline-none"
					placeholder="Room iD"
				/>
			</div>
			<button
				type="submit"
				className="cursor-pointer inline-flex w-full items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-blue-500 rounded-lg h-[60px]"
			>
				Join Room
			</button>
		</form>
	);
};

export default Homepage;
