import {
  GET_AUDIO_STREAM,
  GET_AUDIO_STREAM_FAIL,
  RESET_CALL,
  SET_CALL_ACCEPTED,
  SET_CALL_ENDED,
  SET_PEER_CONNECTION,
  SET_USER_AUDIO,
} from "../constants/callConstants";

export const callReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_AUDIO_STREAM:
      return { ...state, localStream: action.payload };
    case GET_AUDIO_STREAM_FAIL:
      return { ...state, error: action.payload };
    case SET_PEER_CONNECTION:
      return { ...state, peerConnection: action.payload };
    case SET_CALL_ACCEPTED:
      return { ...state, callAccepted: true };
    case SET_USER_AUDIO:
      return { ...state, userAudio: action.payload };
    case SET_CALL_ENDED:
      return { ...state, callEnded: true };
    case RESET_CALL:
      return { state };
    default:
      return state;
  }
};
