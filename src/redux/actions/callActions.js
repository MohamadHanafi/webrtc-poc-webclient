import { Peer } from "../../webrtc/Peer";

import {
  GET_AUDIO_STREAM,
  GET_AUDIO_STREAM_FAIL,
  RESET_CALL,
  SET_CALL_ACCEPTED,
  SET_CALL_ENDED,
  SET_PEER_CONNECTION,
  SET_USER_AUDIO,
} from "../constants/callConstants";
import { RESET_INCOMING_CALL } from "../constants/socketConstants";

export const getAudioStream = () => async (dispatch) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    dispatch({
      type: GET_AUDIO_STREAM,
      payload: stream,
    });
  } catch (error) {
    dispatch({
      type: GET_AUDIO_STREAM_FAIL,
      payload: error,
    });
  }
};

export const callUser = (id) => async (dispatch, getState) => {
  const { localStream } = getState().call;
  const { socket, mySocketId } = getState().socket;
  const { userInfo } = getState().login;

  const peer = new Peer({ localStream, socket, isInitiator: true });

  peer.setUserToBeCalled(id);

  peer.onaddstream((stream) =>
    dispatch({ type: SET_USER_AUDIO, payload: stream })
  );

  await peer.handleOffers({ mySocketId, name: userInfo.name });

  const handleDispatch = () => {
    dispatch({ type: SET_CALL_ACCEPTED });
    dispatch({ type: SET_PEER_CONNECTION, payload: peer });
  };
  await peer.handleAnswers(handleDispatch);
};

export const answerCall = () => async (dispatch, getState) => {
  const { call } = getState().socket;
  const { localStream } = getState().call;
  const { socket } = getState().socket;

  dispatch({ type: SET_CALL_ACCEPTED });

  const peer = new Peer({ localStream, socket });

  peer.onaddstream((stream) =>
    dispatch({ type: SET_USER_AUDIO, payload: stream })
  );

  peer.setCall(call);

  await peer.handleOffers({});

  await peer.handleAnswers();

  dispatch({ type: SET_PEER_CONNECTION, payload: peer });
};

export const endCall = () => async (dispatch, getState) => {
  const { peerConnection, localStream } = getState().call;
  peerConnection.handleEndCall();
  await localStream.getTracks().forEach((track) => track.stop());
  dispatch({ type: SET_CALL_ENDED });
  dispatch({ type: RESET_CALL });
  dispatch({ type: RESET_INCOMING_CALL });
};
