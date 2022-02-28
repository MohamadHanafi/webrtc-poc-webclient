import { io } from "socket.io-client";
import { SOCKET_CONNECT } from "../constants/socketConstants";

export const connectSocket = (serverURL) => async (dispatch) => {
  const socket = io(serverURL);
  dispatch({
    type: SOCKET_CONNECT,
    payload: socket,
  });
};

export const emitter =
  (message, data, actionType) => async (dispatch, getState) => {
    console.log("emitting... ", message);
    const { socket } = getState().socket;
    socket.emit(message, data);

    dispatch({
      type: actionType,
      payload: data,
    });
  };

export const listener = (message, actionType) => async (dispatch, getState) => {
  console.log("listening to", message);
  const { socket } = getState().socket;
  socket.on(message, (data) => {
    dispatch({
      type: actionType,
      payload: data,
    });
  });
};