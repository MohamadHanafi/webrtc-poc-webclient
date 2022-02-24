import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { LoginContext } from "../context/loginContext";
import { users } from "../data/users";

const Login = () => {
  const { isLoggedIn, setIsLoggedIn, setUser } = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      window.alert("Please enter your email and password");
      return;
    }
    const user = users.find((user) => user.email === email);
    if (!user) {
      window.alert("User not found");
      return;
    }
    if (user.password !== password) {
      window.alert("Incorrect password");
      return;
    }
    setUser(user);
    setIsLoggedIn(true);
  };

  return (
    !isLoggedIn && (
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
      </Form>
    )
  );
};

export default Login;
