import { gotStream, handleOnIceConnectionStateChange } from "../../helpers";
import {
  ACCEPT_CALL,
  END_CALL,
  GOT_USER_AUDIO,
  REQUEST_AUDIO_PERMISSION,
  SET_PEER_CONNECTION,
} from "../constants/callConstants";
import {
  EMIT_ANSWER_CALL,
  EMIT_CALL_USER,
  EMIT_NEW_ICE_CANDIDATE,
  LISTEN_CALL_ACCEPTED,
  LISTEN_NEW_ICE_CANDIDATE,
} from "../constants/socketConstants";
import { emitter, listener } from "./socketActions";

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
  rtcpMuxPolicy: "negotiate",
};

// export const onCreateAnswerSuccess = (peerConnection) => async (dispatch, getState) => {

// }

export const getAudioStream = () => async (dispatch) => {
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
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

  peerConnection.onaddstream = (event) => {
    console.log("ontrack", event.stream);
    dispatch({ type: GOT_USER_AUDIO, payload: event.stream });
  };

  const offer = await peerConnection.createOffer({ iceRestart: true });
  await peerConnection.setLocalDescription(offer);

  dispatch(
    emitter(
      "callUser",
      {
        offer,
        userToCall: id,
        callerId: mySocketId,
        name: userInfo.name,
      },
      EMIT_CALL_USER
    )
  );

  dispatch(
    listener("callAccepted", LISTEN_CALL_ACCEPTED, async function (data) {
      dispatch({ type: ACCEPT_CALL });
      if (data.answer) {
        await peerConnection.setRemoteDescription(data.answer);
      }
    })
  );

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
    handleOnIceConnectionStateChange(event, peerConnection);
  };

  dispatch(
    listener(
      "newIceCandidate",
      LISTEN_NEW_ICE_CANDIDATE,
      async function (data) {
        if (data.candidate) {
          console.log("adding ice candidate", data.candidate);
          await peerConnection.addIceCandidate(data.candidate);
        }
      }
    )
  );

  dispatch({ type: SET_PEER_CONNECTION, payload: peerConnection });
};

export const answerCall = () => async (dispatch, getState) => {
  const { call } = getState().socket;
  const { audioStream } = getState().call;

  dispatch({ type: ACCEPT_CALL });

  const peerConnection = new RTCPeerConnection(peerConfiguration);

  if (audioStream) {
    gotStream(audioStream, peerConnection);
  }

  peerConnection.onaddstream = (event) => {
    console.log("ontrack", event.stream);
    dispatch({ type: GOT_USER_AUDIO, payload: event.stream });
  };

  const { offer } = call;
  try {
    await peerConnection.setRemoteDescription(offer);
  } catch (error) {
    console.error(error);
  }

  try {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    dispatch(
      emitter(
        "answerCall",
        {
          answer,
          to: call.caller.socketId,
        },
        EMIT_ANSWER_CALL
      )
    );
  } catch (error) {
    console.error(error);
  }

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      dispatch(
        emitter(
          "newIceCandidate",
          {
            candidate: event.candidate,
            to: call.caller.socketId,
          },
          EMIT_NEW_ICE_CANDIDATE
        )
      );
    }
  };

  peerConnection.oniceconnectionstatechange = (event) => {
    handleOnIceConnectionStateChange(event, peerConnection);
  };

  dispatch(
    listener(
      "newIceCandidate",
      LISTEN_NEW_ICE_CANDIDATE,
      async function (data) {
        if (data.candidate) {
          console.log("adding ice candidate", data.candidate);
          await peerConnection.addIceCandidate(data.candidate);
        }
      }
    )
  );

  dispatch({ type: SET_PEER_CONNECTION, payload: peerConnection });
};

export const leaveCall = () => async (dispatch, getState) => {
  const { peerConnection, audioStream } = getState().call;
  peerConnection.close();
  audioStream.getTracks().forEach((track) => track.stop());
  dispatch({ type: END_CALL });
};
