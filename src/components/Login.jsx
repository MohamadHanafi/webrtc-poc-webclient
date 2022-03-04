import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { loginRequest } from "../redux/actions/loginActions";

const Login = () => {
  const { userInfo, error } = useSelector((state) => state.login);
  const { socket } = useSelector((state) => state.socket);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      socket.emitUserJoined(userInfo);
    }
  }, [userInfo, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      window.alert("Please enter your email and password");
      return;
    }

    dispatch(loginRequest(email, password));
  };

  return (
    !userInfo && (
      <Form className="mt-3" onSubmit={handleSubmit}>
        <h1>Log In</h1>
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword" className="mb-3">
          <Form.Label>Password address</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mb-3">
          Login
        </Button>
        {error && <p className="text-danger">{error}</p>}
      </Form>
    )
  );
};

export default Login;
