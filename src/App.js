import React, { useEffect } from "react";

import Login from "./components/Login";
import OnlineUsersList from "./components/OnlineUsersList";
import CallComponent from "./components/CallComponent";
import Notification from "./components/Notification";

import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  connectSocket,
  getOnlineUsers,
  listenForIncomingCall,
  listenForMySocketId,
} from "./redux/actions/socketActions";

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.login);
  const { socket } = useSelector((state) => state.socket);

  useEffect(() => {
    dispatch(connectSocket(process.env.REACT_APP_SERVER_URL));
    // dispatch(connectSocket("http://localhost:5000"));
    // dispatch(connectSocket("https://webrtc-poc-backend.herokuapp.com/"));
  }, [dispatch]);

  useEffect(() => {
    if (socket && userInfo) {
      dispatch(listenForMySocketId());
      dispatch(getOnlineUsers());
      dispatch(listenForIncomingCall());
    }
  }, [userInfo, dispatch, socket]);

  return (
    <Container>
      <Notification />
      <Row>
        <Col md={6}>
          <Login />
        </Col>
        <Col md={6}>
          <OnlineUsersList />
        </Col>
        <Row className="mt-4">
          <CallComponent />
        </Row>
      </Row>
    </Container>
  );
}

export default App;
