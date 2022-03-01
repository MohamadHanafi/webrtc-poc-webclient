export const gotStream = (stream, peerConnection) => {
  stream.getTracks().forEach((track) => {
    console.log(`${track} is added to peerConnection`, peerConnection);
    peerConnection.addTrack(track, stream);
  });
};

export const handleOnIceConnectionStateChange = (event, peerConnection) => {
  console.log(`ICE connection state: ${peerConnection.iceConnectionState}`);
  console.log("ICE state change event: ", event);
};
