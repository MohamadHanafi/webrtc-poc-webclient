import { Socket } from "../../webrtc/Socket";
import { SOCKET_CONNECT } from "../constants/socketConstants";

export const connectSocket = (serverURL) => async (dispatch) => {
  const socket = new Socket(serverURL);
  dispatch({
    type: SOCKET_CONNECT,
    payload: socket,
  });
};
