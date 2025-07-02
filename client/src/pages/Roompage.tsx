import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import peer from "../service/PeerService";

const Roompage = () => {
	const { socket } = useSocket();

	const [remoteSocketId, setRemoteSocketId] = useState<string>("");
	const [myStream, setMyStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

	const handleUserJoined = useCallback(({ socketId, email }: { socketId: string; email: string }) => {
		console.log(`User joined: ${email} with socket ID: ${socketId}`);
		setRemoteSocketId(socketId);
	}, []);

	const sendMyStream = useCallback(() => {
		if (myStream) {
			for (const track of myStream.getTracks()) {
				peer.peer?.addTrack(track, myStream);
			}
		}
	}, [myStream]);

	const handleCallUser = useCallback(async () => {
		// const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
		// setMyStream(stream);

		const offer = await peer.createOffer();
		console.log("Emitting user:call", { to: remoteSocketId, offer });
		socket.emit("user:call", { to: remoteSocketId, offer });

	}, [remoteSocketId, socket]);

	const handleIncommingCall = useCallback(
		async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
			console.log("Incomming call " + from + offer);

			setRemoteSocketId(from);
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
			setMyStream(stream);

			const answer = await peer.createAnswer(offer);
			socket.emit("call:accepted", { socketId: from, answer });
		},
		[socket]
	);

	const handleCallAccepted = useCallback(
		async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
			console.log(`Call Acceptd: ${answer}`);
			await peer.setRemoteDescription(answer);
			sendMyStream();
		},
		[sendMyStream]
	);

	useEffect(() => {
		peer.peer?.addEventListener("track", (ev) => {
			const remoteStreams = ev.streams;
			setRemoteStream(remoteStreams[0]);
		});
	}, []);

	useEffect(() => {
		socket.on("user:joined", handleUserJoined);
		socket.on("incomming:call", handleIncommingCall);
		socket.on("call:accepted", handleCallAccepted);
		return () => {
			socket.off("user:joined", handleUserJoined);
			socket.off("incomming:call", handleIncommingCall);
			socket.off("call:accepted", handleCallAccepted);
		};
	}, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted]);

	return (
		<div>
			<h1>
				{remoteSocketId ? `Connected to ${remoteSocketId}` : "No one is in the room. Please wait for someone to join"}
			</h1>

			{remoteSocketId && (
				<button
					onClick={handleCallUser}
					className="inline-flex items-center justify-center px-8 py-4 font-sans font-semibold tracking-wide text-white bg-blue-500 rounded-lg h-[60px]"
				>
					Call User
				</button>
			)}
		</div>
	);
};

export default Roompage;
