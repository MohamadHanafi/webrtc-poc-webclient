import React from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { answerCall } from "../redux/actions/callActions";

const Notification = () => {
  const dispatch = useDispatch();
  const { call } = useSelector((state) => state.socket);
  const { callAccepted } = useSelector((state) => state.call);

  return (
    <>
      {call?.isReceivingCall && !callAccepted && (
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
              dispatch(answerCall());
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
