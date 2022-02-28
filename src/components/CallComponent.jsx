import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getAudioStream } from "../redux/actions/callActions";

const CallComponent = () => {
  const dispatch = useDispatch();
  const { audioStream, userAudio } = useSelector((state) => state.call);

  useEffect(() => {
    if (!audioStream) {
      dispatch(getAudioStream());
    } else {
      const localAudio = document.getElementById("localVideo");
      localAudio.srcObject = audioStream;
      localAudio.play();
    }
    if (userAudio) {
      const remoteAudio = document.getElementById("remoteVideo");
      remoteAudio.srcObject = userAudio;
      remoteAudio.play();
    }
  }, [audioStream, userAudio]);

  return (
    <>
      <Col md={6}>
        {audioStream && (
          <video id="localVideo" playsInline autoPlay muted controls />
        )}
      </Col>
      <Col md={6}>
        <video id="remoteVideo" playsInline autoPlay controls />
      </Col>
    </>
  );
};

export default CallComponent;
