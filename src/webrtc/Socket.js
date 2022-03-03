import { io } from "socket.io-client";

export class Socket {
  socket;
  mySocketId;
  onlineUsers = [];
  call = {};

  constructor(serverURL) {
    this.socket = io(serverURL);
  }

  emitter = (message, data) => {
    this.socket.emit(message, data);
  };

  listener = (message, callback) => {
    this.socket.on(message, (data) => {
      if (callback) {
        callback(data);
      }
    });
  };

  listenForMySocketId = () => {
    this.listener("me", (id) => {
      this.mySocketId = id;
    });
  };

  listenForOnlineUsers = () => {
    this.listener("newUser", (users) => (this.onlineUsers = users));
  };

  listenForIncomingCall = () => {
    this.listener("callUser", ({ offer, from: { socketId, name } }) => {
      this.call = {
        isReceivingCall: true,
        offer,
        caller: {
          name,
          socketId,
        },
      };
    });
  };

  emitUserJoined = (userInfo) => {
    this.emitter("userJoined", userInfo);
  };
}
