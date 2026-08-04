import { io } from "socket.io-client";

const socket = io("http://localhost:5174", {
    transports: ["websocket"],
    autoConnect: true,
});

export default socket;