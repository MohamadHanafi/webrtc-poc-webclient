import {
  ACCEPT_CALL,
  GOT_USER_AUDIO,
  REQUEST_AUDIO_PERMISSION,
  SET_PEER_CONNECTION,
} from "../constants/callConstants";

export const callReducer = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_AUDIO_PERMISSION:
      return {
        ...state,
        audioStream: action.payload.audioStream,
        error: action.payload.error,
      };
    case GOT_USER_AUDIO:
      return { ...state, userAudio: action.payload };
    case ACCEPT_CALL:
      return { ...state, callAccepted: true };
      case SET_PEER_CONNECTION:
        return { ...state, peerConnection: action.payload}
    default:
      return state;
  }
};
