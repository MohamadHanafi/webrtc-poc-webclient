import React, { useEffect } from "react";
import { Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getAudioStream, endCall } from "../redux/actions/callActions";

const CallComponent = () => {
  const dispatch = useDispatch();
  const { localStream, userAudio, callAccepted, callEnded } = useSelector(
    (state) => state.call
  );

  useEffect(() => {
    if (!localStream) {
      dispatch(getAudioStream());
    } else {
      const localAudio = document.getElementById("localVideo");
      localAudio.srcObject = localStream;
      localAudio.play();
    }
  }, [localStream, dispatch]);

  useEffect(() => {
    if (userAudio) {
      const remoteAudio = document.getElementById("remoteVideo");
      remoteAudio.srcObject = userAudio;
      remoteAudio.play();
    }
  }, [userAudio, dispatch]);

  return (
    <>
      <Col md={6}>
        {localStream && (
          <video id="localVideo" playsInline autoPlay muted controls />
        )}
      </Col>
      {userAudio && (
        <Col md={6}>
          <video id="remoteVideo" playsInline autoPlay controls />
        </Col>
      )}
      {!callEnded && callAccepted && (
        <div>
          <Button variant="danger" onClick={() => dispatch(endCall())}>
            End Call
          </Button>
        </div>
      )}
    </>
  );
};

export default CallComponent;
