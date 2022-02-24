import React from "react";
import ReactDOM from "react-dom";
import "./bootstrap.min.css";
import "./index.css";
import App from "./App";
import { LoginContextProvider } from "./context/loginContext";
import { SocketContextProvider } from "./context/socketContext";
import { WebRTCContextProvider } from "./context/webRTCContext";

ReactDOM.render(
  <React.StrictMode>
    <LoginContextProvider>
      <SocketContextProvider>
        <WebRTCContextProvider>
          <App />
        </WebRTCContextProvider>
      </SocketContextProvider>
    </LoginContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
