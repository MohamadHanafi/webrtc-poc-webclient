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
  isCallAccepted;
  call;

  constructor({ localStream, socket, isInitiator = false }) {
    console.log("Peer constructor", localStream, socket, isInitiator);
    this.peerConnection = new RTCPeerConnection(this.peerConfiguration);
    this.localStream = localStream;
    this.socket = socket;
    this.initiator = isInitiator;
    this.addStream();
    this.bindListeners();
  }

  bindListeners = () => {
    this.peerConnection.onicecandidate = this.handleOnIceCandidate;
    this.peerConnection.oniceconnectionstatechange =
      this.handleOnIceConnectionStateChange;
    this.handleNewIceCandidate();
  };

  setUserToBeCalled = (id) => {
    this.userToBeCalled = id;
  };

  addStream = async () => {
    try {
      await this.peerConnection.addStream(this.localStream);
    } catch (error) {
      console.log(error);
    }
  };

  onaddstream = (callback) => {
    this.peerConnection.onaddstream = (event) => {
      console.log("ontrack", event.stream);
      this.remoteStream = event.stream;
      callback && callback(this.remoteStream);
    };
  };

  handleOffers = async ({ config = null, mySocketId, name }) => {
    try {
      if (this.initiator) {
        const offer = await this.peerConnection.createOffer(config);
        await this.peerConnection.setLocalDescription(offer);
        this.socket.emitter("callUser", {
          offer,
          userToCall: this.userToBeCalled,
          callerId: mySocketId,
          name,
        });
      } else {
        await this.peerConnection.setRemoteDescription(this.call.offer);
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleAnswers = async (callback) => {
    try {
      if (this.initiator) {
        this.socket.listener("callAccepted", async ({ answer }) => {
          await this.peerConnection.setRemoteDescription(answer);
          callback();
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
        : (to = this.call.caller.socketId);
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

  setCall = (call) => {
    this.call = call;
  };

  handleEndCall = () => {
    this.peerConnection.close();
  };
}
