import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constansts";

export const BlockchainContext = createContext({
  connectedWallet: undefined,
});

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  // console.log({
  //   provider,
  //   signer,
  //   transactionContract,
  // });
  return transactionContract;
};

export const BlockchainContextProvider = (props) => {
  const [connectedWallet, setConnectedWallet] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        alert("Please install MetaMask from your browser's extension store!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setConnectedWallet(accounts[0]);
        console.log("setting connected wallet as " + accounts[0]);
      } else {
        console.log("no wallet has given access");
      }
    } catch (err) {
      console.log(
        "error occured while trying to connect the wallet\nerr: " + err
      );
      throw new Error("no ethereum object detected in the window");
    }
  };

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
    checkIfWalletIsConnected();
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        connectedWallet,
        connectWallet, // TODO call this on "Connect" button press
      }}
    >
      {props.children}
    </BlockchainContext.Provider>
  );
};
