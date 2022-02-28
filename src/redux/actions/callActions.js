import {
  ACCEPT_CALL,
  GOT_USER_AUDIO,
  REQUEST_AUDIO_PERMISSION,
  SET_PEER_CONNECTION,
} from "../constants/callConstants";
import {
  EMIT_NEW_ICE_CANDIDATE,
  LISTEN_CALL_ACCEPTED,
  LISTEN_NEW_ICE_CANDIDATE,
} from "../constants/socketConstants";
import { emitter, listener } from "./socketActions";
import { gotStream } from "../../helpers";

const peerConfiguration = {
  iceServers: [
    { urls: ["stun:fr-turn1.xirsys.com"] },
    {
      username:
        "ZXsuA3mlsPL_M_6NcBBqGj-YVmYBix9uKBOkjrPQZikUNhbR3Exs0yPsq2R8z79CAAAAAGIV3q5Nb2hhbWFkSGFuYWZp",
      credential: "2652ca44-9478-11ec-aaf8-0242ac120004",
      urls: [
        "turn:fr-turn1.xirsys.com:80?transport=udp",
        "turn:fr-turn1.xirsys.com:3478?transport=udp",
        "turn:fr-turn1.xirsys.com:80?transport=tcp",
        "turn:fr-turn1.xirsys.com:3478?transport=tcp",
        "turns:fr-turn1.xirsys.com:443?transport=tcp",
        "turns:fr-turn1.xirsys.com:5349?transport=tcp",
      ],
    },
  ],
};

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
};

export const getAudioStream = () => async (dispatch) => {
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    dispatch({
      type: REQUEST_AUDIO_PERMISSION,
      payload: {
        audioStream,
        error: null,
      },
    });
  } catch (err) {
    dispatch({
      type: REQUEST_AUDIO_PERMISSION,
      payload: {
        audioStream: null,
        error: err,
      },
    });
  }
};

export const callUser = (id) => async (dispatch, getState) => {
  const { audioStream } = getState().call;
  const { userInfo } = getState().login;
  const { mySocketId } = getState().socket;

  const peerConnection = new RTCPeerConnection(peerConfiguration);

  if (audioStream) {
    gotStream(audioStream, peerConnection);
  }

  const offer = await peerConnection.createOffer(offerOptions);
  await peerConnection.setLocalDescription(offer);
  dispatch(
    emitter("callUser", {
      offer,
      userToCall: id,
      callerId: mySocketId,
      name: userInfo.name,
    })
  );

  dispatch(listener("callAccepted", LISTEN_CALL_ACCEPTED));

  const { answer } = getState().socket;
  await peerConnection.setRemoteDescription(answer);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      dispatch(
        emitter(
          "newIceCandidate",
          { candidate: event.candidate, to: id },
          EMIT_NEW_ICE_CANDIDATE
        )
      );
    }
  };

  peerConnection.oniceconnectionstatechange = (event) => {
    console.log(`ICE connection state: ${peerConnection.iceConnectionState}`);
    console.log("ICE state change event: ", event);
  };

  dispatch(listener("newIceCandidate", LISTEN_NEW_ICE_CANDIDATE));

  const { candidate } = getState().socket;
  if (candidate) {
    await peerConnection.addIceCandidate(candidate);
  }

  peerConnection.ontrack = (event) => {
    console.log("ontrack event: ", event);
    dispatch({ type: GOT_USER_AUDIO, payload: event.streams[0] });
  };

  dispatch({ type: SET_PEER_CONNECTION, payload: peerConnection });
};

const answerCall = () => async (dispatch, getState) => {
  const { call } = getState().socket;
  const { audioStream } = getState().call;

  dispatch(ACCEPT_CALL);

  const peerConnection = new RTCPeerConnection(peerConfiguration);

  peerConnection.onicecandidate = (event) => {
    console.log("icecandidate event: ", event);
    if (event.candidate) {
      dispatch(
        emitter("newIceCandidate", EMIT_NEW_ICE_CANDIDATE, {
          candidate: event.candidate,
          to: call.caller.socketId,
        })
      );
    }
  };

  peerConnection.oniceconnectionstatechange = (event) => {
    console.log(`ICE connection state: ${peerConnection.iceConnectionState}`);
    console.log("ICE state change event: ", event);
  };

  dispatch(listener("newIceCandidate", LISTEN_NEW_ICE_CANDIDATE));
  const { candidate } = getState().socket;
  if (candidate) {
    await peerConnection.addIceCandidate(candidate);
  }

  peerConnection.ontrack = (event) => {
    console.log("ontrack event: ", event);
    dispatch({ type: GOT_USER_AUDIO, payload: event.streams[0] });
  };

  if (audioStream) {
    gotStream(audioStream, peerConnection);
  }
};
