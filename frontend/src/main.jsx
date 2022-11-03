import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { BlockchainContextProvider } from "./store/blockchain-context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BlockchainContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </BlockchainContextProvider>
);

// TODO store every donated relief funds in local storage to quickly fetch getUsage(fundsAddress) information on /dashboard page
// TODO Terminate should also clear usage info.
// TODO Add halt receiving funds.
// TODO Tap to show reason on modal.
// TODO Dashboard for donation history.
// TODO delete fundsDetails component from local and remote
