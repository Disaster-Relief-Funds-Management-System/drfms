import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constansts";

export const BlockchainContext = createContext({
  connectedWallet: undefined,
});

const { ethereum } = window;
const ALERT_INSTALL_METAMASK =
  "Please install MetaMask from your browser's extension store!";

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
        alert(ALERT_INSTALL_METAMASK);
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setConnectedWallet(accounts[0]);
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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert(ALERT_INSTALL_METAMASK);
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setConnectedWallet(accounts[0]);
    } catch (err) {
      console.log("error occured while trying to connect the wallet\n" + err);
      throw new Error("no ethereum object detected in the window");
    }
  };

  /**
   * calls the viewReliefFundsDetails smart contract function with following parameter
   * @param {string} fundsAddress check if this fund's address is registered and accepting funds
   * @returns array with [0] being the description and [1] being the status
   */
  const searchReliefFunds = async (fundsAddress) => {
    try {
      if (!ethereum) {
        alert(ALERT_INSTALL_METAMASK);
        return;
      }

      const smartContract = getEthereumContract();
      const result = await smartContract.viewReliefFundsDetails(fundsAddress);

      return result;
    } catch (err) {
      console.log(
        "error occured while trying to search for relief funds\n" + err
      );
      return undefined, false; // undefined here refers to some error occured while sending the request
    }
  };

  /**
   * Donates amount to receiver by calling donate smart contract function.
   * @param {string} receiver wallet address of relief funds
   * @param {string} amount amount to donate
   */
  const donate = async (receiver, amount) => {
    // receiver = same as fundsAddress before
    const options = { value: ethers.utils.parseEther(amount) };
    const smartContract = getEthereumContract();
    const txHash = await smartContract.donate(receiver, options);
    console.log(`Loading - ${txHash.hash}`);
    await txHash.wait();
    console.log(`Loading - ${txHash.hash}`);
  };

  return (
    <BlockchainContext.Provider
      value={{
        connectedWallet,
        connectWallet, // TODO call this on "Connect" button press
        searchReliefFunds,
        donate,
      }}
    >
      {props.children}
    </BlockchainContext.Provider>
  );
};
