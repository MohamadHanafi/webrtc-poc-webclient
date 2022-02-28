export const gotStream = (stream, peerConnection) => {
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
};

export const handleIceCandidate = (event) => {};
