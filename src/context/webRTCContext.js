import React, { useState, useEffect, createContext, useRef } from "react";

import { useSelector } from "react-redux";

const WebRTCContext = createContext();

const WebRTCContextProvider = ({ children }) => {
  const { socket, mySocketId } = useSelector((state) => state.socket);
  const { userInfo } = useSelector((state) => state.login);

  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const [localStream, setLocalStream] = useState(null);

  const myAudio = useRef();
  const userAudio = useRef();
  const connectionRef = useRef();

  const configuration = {
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
    offerToReceiveVideo: 0,
  };

  useEffect(() => {
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true, video: false })
    //   .then((stream) => {
    //     myAudio.current.srcObject = stream;
    //     setLocalStream(stream);
    //   })
    //   .catch((err) => console.log(err));
    // socket.on("callUser", ({ offer, from }) => {
    //   setCall({
    //     isReceivingCall: true,
    //     offer,
    //     caller: {
    //       socketId: from.socketId,
    //       name: from.name,
    //     },
    //   });
    // });
  }, [socket]);

  const callUser = async (id) => {
    const PeerConnection = new RTCPeerConnection(configuration);

    // localStream
    //   .getTracks()
    //   .forEach((track) => PeerConnection.addTrack(track, localStream));
    // console.log("Added local stream tracks to peer connection");

    PeerConnection.onicecandidate = (event) => {
      console.log("icecandidate event: ", event);
      if (event.candidate) {
        socket.emit("newIceCandidate", { candidate: event.candidate, to: id });
      }
    };

    PeerConnection.oniceconnectionstatechange = (event) => {
      console.log(`ICE connection state: ${PeerConnection.iceConnectionState}`);
      console.log("ICE state change event: ", event);
    };

    socket.on("newIceCandidate", async ({ candidate }) => {
      try {
        await PeerConnection.addIceCandidate(candidate);
      } catch (err) {
        console.log(err);
      }
    });

    PeerConnection.ontrack = (event) => {
      console.log("ontrack event: ", event);
      userAudio.current.srcObject = event.streams[0];
    };

    console.log("starting creating offer");

    const offer = await PeerConnection.createOffer(offerOptions);
    console.log("created offer", offer);
    await PeerConnection.setLocalDescription(offer);
    console.log("offer set to local description");
    socket.emit("callUser", {
      offer,
      userToCall: id,
      callerId: mySocketId,
      name: userInfo.name,
    });
    console.log("awaiting answer");

    socket.on("callAccepted", async ({ answer }) => {
      setCallAccepted(true);
      console.log(`call accepted with answer: ${answer}`);
      try {
        await PeerConnection.setRemoteDescription(answer);
        console.log("answer set to remote description");
      } catch (err) {
        console.log("Error during setting remote description", err);
      }
    });

    connectionRef.current = PeerConnection;
  };

  const answerCall = async () => {
    setCallAccepted(true);
    const PeerConnection = new RTCPeerConnection(configuration);

    PeerConnection.onicecandidate = (event) => {
      console.log("icecandidate event: ", event);
      if (event.candidate) {
        socket.emit("newIceCandidate", {
          candidate: event.candidate,
          to: call.caller.socketId,
        });
      }
    };

    PeerConnection.oniceconnectionstatechange = (event) => {
      console.log(`ICE connection state: ${PeerConnection.iceConnectionState}`);
      console.log("ICE state change event: ", event);
    };

    socket.on("newIceCandidate", async ({ candidate }) => {
      console.log("new ice candidate received");
      try {
        await PeerConnection.addIceCandidate(candidate);
      } catch (err) {
        console.log(err);
      }
    });

    PeerConnection.ontrack = (event) => {
      console.log("ontrack event: ", event);
      userAudio.current.srcObject = event.streams[0];
    };

    localStream
      .getTracks()
      .forEach((track) => PeerConnection.addTrack(track, localStream));
    console.log("Added local stream tracks to peer connection");

    try {
      const offerDesc = new RTCSessionDescription(call.offer);
      await PeerConnection.setRemoteDescription(offerDesc);
      console.log("offer set to remote description");
    } catch (err) {
      console.log("Error during setting remote description", err);
    }

    console.log("starting creating answer");
    const answer = await PeerConnection.createAnswer();
    await PeerConnection.setLocalDescription(answer);
    console.log("answer set to local description");

    socket.emit("answerCall", {
      answer,
      to: call.caller.socketId,
    });

    connectionRef.current = PeerConnection;
  };

  const leaveCall = () => {
    connectionRef.current.close();
    setCall({});
    setCallAccepted(false);
    setCallEnded(true);
  };

  return (
    <WebRTCContext.Provider
      value={{
        answerCall,
        callUser,
        leaveCall,
        callAccepted,
        callEnded,
        myAudio,
        userAudio,
        call,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export { WebRTCContext, WebRTCContextProvider };
