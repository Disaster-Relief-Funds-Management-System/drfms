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

// TODO return total amount donated from viewReliefFundsDetails function
// TODO store every donated relief funds in local storage to quickly fetch getUsage(fundsAddress) information on /dashboard page
// TODO disable buttons (other than search) when not connected
