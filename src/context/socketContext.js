import React, { useState, useEffect, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { LoginContext } from "./loginContext";

const socket = io(process.env.REACT_APP_SERVER_URL);

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const { isLoggedIn, user } = useContext(LoginContext);

  const [mySocketId, setMySocketId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      socket.emit("userJoined", user);

      socket.on("me", (id) => setMySocketId(id));
    }

    socket.on("newUser", (users) => {
      setOnlineUsers(users);
    });
  }, [isLoggedIn, user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, mySocketId }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketContextProvider };
