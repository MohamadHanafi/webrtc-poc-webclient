import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { WebRTCContext } from "../context/webRTCContext";

const Notification = () => {
  const { answerCall, call, callAccepted } = useContext(WebRTCContext);
  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <h6 style={{ margin: "0 20px" }}>
            {call.caller.name} is calling you!{" "}
          </h6>
          <Button
            variant="info"
            onClick={() => {
              answerCall();
            }}
          >
            Answer
          </Button>
        </div>
      )}
    </>
  );
};

export default Notification;
