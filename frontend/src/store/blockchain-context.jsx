import { createContext, useState, useEffect } from "react";

export const BlockchainContext = createContext({
  connectedWallet: undefined,
});

const { ethereum } = window;

export const BlockchainContextProvider = (props) => {
  const [connectedWallet, setConnectedWallet] = useState("");

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Please install MetaMask from your browser's extension store!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setConnectedWallet(accounts[0]);
    } catch (err) {
      console.log(
        "error occured while trying to connect the wallet\nerr: " + err
      );
      throw new Error("no ethereum object detected in the window");
    }
  };

  useEffect(() => {
    connectWallet();
    return () => {};
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        connectedWallet,
      }}
    >
      {props.children}
    </BlockchainContext.Provider>
  );
};
