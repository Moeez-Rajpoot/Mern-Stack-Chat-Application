import { io } from "socket.io-client";

let socket;

export const initializeSocket = (userId, userData) => {
  if (userData && !socket) {
    // Initialize socket only once
    socket = io("http://localhost:3000");
    console.log("User is connected:", userData);

    socket.on("connect", () => {
      console.log("User connected with socket id:", socket.id);
      socket.emit("register", userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  }
};

export const sendMessageSocket = ( SetMessage , message, receiverId , SenderId) => {
  if (socket) {
    console.log("Emit Msg is called:", message, "and receiver id:", receiverId);
    socket.emit("newMessage", { message, receiverId });
    const createdAt = new Date().toISOString();
    SetMessage((prevMessages)=> [...prevMessages , {
        Message: message,
        SenderId,
        createdAt
    }]);
  }
};

export const receiveMessageSocket = (setMessages) => {
  console.log("Receiving Socket Enabled");

  if (socket) {
    // Remove any existing listeners to avoid duplicates
    socket.off("newMessage");

    // Attach the new message listener
    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
