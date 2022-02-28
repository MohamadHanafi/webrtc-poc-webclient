import React from "react";
import ReactDOM from "react-dom";
import "./bootstrap.min.css";
import "./index.css";
import App from "./App";
import { WebRTCContextProvider } from "./context/webRTCContext";

import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WebRTCContextProvider>
        <App />
      </WebRTCContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
