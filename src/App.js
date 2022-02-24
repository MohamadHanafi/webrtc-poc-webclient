import React from "react";

import Login from "./components/Login";
import OnlineUsersList from "./components/OnlineUsersList";
import CallComponent from "./components/CallComponent";
import Notification from "./components/Notification";

import { Container, Row, Col } from "react-bootstrap";

function App() {
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
