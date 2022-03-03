export class Peer {
  peerConnection;
  peerConfiguration = {
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
  localStream;
  remoteStream;
  socket;
  initiator;
  userToBeCalled;

  constructor({ localStream, socket, isInitiator = false }) {
    this.peerConnection = new RTCPeerConnection(this.peerConfiguration);
    this.localStream = localStream;
    this.socket = socket;
    this.initiator = isInitiator;
  }

  setUserToBeCalled = (id) => {
    this.userToBeCalled = userToBeCalled;
  };

  addStream = () => {
    this.peerConnection.addStream(this.LocalStream);
  };

  handleOnAddStream = (event) => {
    console.log("ontrack", event.stream);
    this.remoteStream = event.stream;
  };

  handleOffers = async (config = null) => {
    try {
      if (this.initiator) {
        const offer = await this.peerConnection.createOffer(config);
        await this.peerConnection.setLocalDescription(offer);
        this.socket.emitter("callUser", {
          offer,
          userToCall: this.userToBeCalled,
          callerId: this.socket.mySocketId,
          name: this.socket.myName,
        });
      } else {
        await this.peerConnection.setRemoteDescription(this.call.offer);
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleAnswers = async () => {
    try {
      if (this.initiator) {
        this.socket.listener("callAccepted", async ({ answer }) => {
          await this.peerConnection.setRemoteDescription(answer);
        });
      } else {
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.socket.emitter("answerCall", {
          answer,
          to: this.call.caller.socketId,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleOnIceCandidate = (event) => {
    if (event.candidate) {
      let to;
      this.initiator
        ? (to = this.userToBeCalled)
        : (to = this.socket.call.caller.socketId);
      this.socket.emitter("newIceCandidate", {
        candidate: event.candidate,
        to,
      });
    }
  };

  handleOnIceConnectionStateChange = (event) => {
    console.log(
      `ICE connection state: ${this.peerConnection.iceConnectionState}`
    );
    console.log("ICE state change event: ", event);
  };

  handleNewIceCandidate = () => {
    this.socket.listener("newIceCandidate", async ({ candidate }) => {
      try {
        await this.peerConnection.addIceCandidate(candidate);
      } catch (error) {
        console.error(error);
      }
    });
  };
}
