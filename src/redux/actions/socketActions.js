import { Socket } from "../../webrtc/Socket";
import {
  GET_ONLINE_USERS,
  LISTEN_INCOMING_CALL,
  LISTEN_MY_SOCKET_ID,
  SOCKET_CONNECT,
} from "../constants/socketConstants";

export const connectSocket = (serverURL) => async (dispatch) => {
  const socket = new Socket(serverURL);
  dispatch({
    type: SOCKET_CONNECT,
    payload: socket,
  });
};

export const getOnlineUsers = () => async (dispatch, getState) => {
  const { socket } = getState().socket;
  socket.listener("newUser", (users) => {
    dispatch({
      type: GET_ONLINE_USERS,
      payload: users,
    });
  });
};

export const listenForIncomingCall = () => async (dispatch, getState) => {
  const { socket } = getState().socket;
  socket.listener("callUser", ({ offer, from: { socketId, name } }) => {
    console.log("callUser", offer, socketId, name);
    dispatch({
      type: LISTEN_INCOMING_CALL,
      payload: {
        isReceivingCall: true,
        offer,
        caller: {
          name,
          socketId,
        },
      },
    });
  });
};

export const listenForMySocketId = () => async (dispatch, getState) => {
  const { socket } = getState().socket;
  socket.listener("me", (socketId) => {
    dispatch({
      type: LISTEN_MY_SOCKET_ID,
      payload: socketId,
    });
  });
};
