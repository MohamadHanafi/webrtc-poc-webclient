export const gotStream = (stream, peerConnection) => {
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
};

export const handleOnIceConnectionStateChange = (event, peerConnection) => {
  console.log(`ICE connection state: ${peerConnection.iceConnectionState}`);
  console.log("ICE state change event: ", event);
};
