import { createContext, useContext, useMemo } from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8081";

type TSocketContext = {
	socket: Socket;
} | null;

const SocketContext = createContext<TSocketContext>(null);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const socket = useMemo(() => io(SOCKET_SERVER_URL, {
		withCredentials: true
	}), []);
	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

const useSocket = (): Exclude<TSocketContext, null> => {
	const context = useContext(SocketContext);

	if (!context) {
		throw new Error("Socket Context not initialized");
	}

	return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { SocketProvider, useSocket };
