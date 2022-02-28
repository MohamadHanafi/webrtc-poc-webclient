import React, { useEffect } from "react";

import Login from "./components/Login";
import OnlineUsersList from "./components/OnlineUsersList";
import CallComponent from "./components/CallComponent";
import Notification from "./components/Notification";

import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  connectSocket,
  emitter,
  listener,
} from "./redux/actions/socketActions";
import {
  EMIT_USER_JOINED,
  LISTEN_ME,
  LISTEN_NEW_USER,
  LISTEN_CALL_USER,
} from "./redux/constants/socketConstants";

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(connectSocket(process.env.REACT_APP_SERVER_URL));
  }, []);

  useEffect(() => {
    if (userInfo) {
      dispatch(emitter("userJoined", userInfo, EMIT_USER_JOINED));
      dispatch(listener("me", LISTEN_ME));
      dispatch(listener("newUser", LISTEN_NEW_USER));
      dispatch(listener("callUser", LISTEN_CALL_USER));
    }
  }, [userInfo]);

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
