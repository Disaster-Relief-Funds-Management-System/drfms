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
