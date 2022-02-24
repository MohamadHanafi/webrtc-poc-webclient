import React, { useContext } from "react";
import { Col } from "react-bootstrap";
import { WebRTCContext } from "../context/webRTCContext";

const CallComponent = () => {
  const { myAudio, userAudio } = useContext(WebRTCContext);

  return (
    <>
      <Col md={6}>
        <video
          id="localVideo"
          playsInline
          autoPlay
          muted
          controls
          ref={myAudio}
        />
      </Col>
      <Col md={6}>
        <video id="remoteVideo" playsInline autoPlay controls ref={userAudio} />
      </Col>
    </>
  );
};

export default CallComponent;
