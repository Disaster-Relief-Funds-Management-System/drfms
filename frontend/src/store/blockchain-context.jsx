import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constansts";

export const BlockchainContext = createContext();

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
  const [isLoading, setIsLoading] = useState({
    donate: false,
    generateNewReliefFunds: false,
    addUsageInfo: false,
    toggleState: false,
    deleteReliefFunds: false,
  });

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
        return true;
      } else {
        console.log("no wallet has given access");
        return false;
      }
    } catch (err) {
      console.log(
        "error occured while trying to connect the wallet\nerr: " + err
      );
      return false;
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
      const statusConnected = await checkIfWalletIsConnected();
      if (!statusConnected) {
        await connectWallet();
      }

      const smartContract = getEthereumContract();
      let result = await smartContract.reliefFundsManagers(fundsAddress);

      const formatedResult = {
        createdOn: result[2].toString() + "000",
        description: result[0],
        fundsNeeded: result[4],
        manager: result[1],
        totalAmount: ethers.utils.formatEther(result[3]._hex.toString()),
        fundsAddress: fundsAddress,
      };

      return { data: formatedResult };
    } catch (err) {
      console.log(
        "error occured while trying to search for relief funds\n" + err
      );
      return { error: err };
    }
  };

  /**
   * Donates amount to receiver by calling donate smart contract function.
   * @param {string} receiver wallet address of relief funds
   * @param {string} amount amount to donate
   */
  const donate = async (receiver, amount) => {
    try {
      const statusConnected = await checkIfWalletIsConnected();
      if (!statusConnected) {
        await connectWallet();
      }

      // receiver = same as fundsAddress before
      const options = { value: ethers.utils.parseEther(amount) };
      const smartContract = getEthereumContract();
      const txHash = await smartContract.donate(receiver, options);
      console.log(`Loading - ${txHash.hash}`);
      setIsLoading((prevState) => {
        return { ...prevState, donate: true };
      });
      await txHash.wait();
      setIsLoading((prevState) => {
        return { ...prevState, donate: false };
      });
      console.log(`Confirmed - ${txHash.hash}`);
      return { hash: txHash.hash };
    } catch (err) {
      console.log("error occured while trying to donate\n" + err);
      return { error: err.error.message };
    }
  };

  const getDonationHistory = async (fundsAddress) => {
    try {
      const statusConnected = await checkIfWalletIsConnected();
      if (!statusConnected) {
        await connectWallet();
      }

      const smartContract = getEthereumContract();
      let result = await smartContract.getDonationHistory(fundsAddress);

      result = result.map((donation, i) => {
        let d = new Date(0);
        d.setUTCMilliseconds(donation.donatedOn.toString() + "000");
        return [
          fundsAddress,
          d.toLocaleDateString(),
          ethers.utils.formatEther(donation.val.toString()),
          donation.donor,
        ];
      });

      return { donationHistory: result };
    } catch (err) {
      console.log(
        "error occured while trying to get usage information\n" + err
      );
      return { error: err.error.message };
    }
  };

  /**
   * Adds this relief funds to the blockchain and assigns the funds manager.
   * @param {string} fundsAddress Wallet address of the relief funds. (It can also be same as msg.sender.)
   * @param {string} description Short description about what disaster was this relief funds created to tackle.
   */
  const addReliefFundsManager = async (fundsAddress, description) => {
    try {
      const statusConnected = await checkIfWalletIsConnected();
      if (!statusConnected) {
        await connectWallet();
      }

      const smartContract = getEthereumContract();
      const result = await smartContract.addReliefFundsManager(
        fundsAddress,
        description
      );

      setIsLoading((prevState) => {
        return { ...prevState, generateNewReliefFunds: true };
      });
      await result.wait();
      setIsLoading((prevState) => {
        return { ...prevState, generateNewReliefFunds: false };
      });

      return { hash: result.hash };
    } catch (err) {
      console.log(
        "error occured while trying to add new relief funds manager\n" + err
      );
      return { error: err.error.message };
    }
  };

  // addUsage(address fundsAddress, string memory reason, uint256 val, uint256 usedOn) authorizedManager(fundsAddress) public {
  const addUsage = async (fundsAddress, reason, val, usedOn) => {
    try {
      const statusConnected = await checkIfWalletIsConnected();
      if (!statusConnected) {
        await connectWallet();
      }

      val = ethers.utils.parseEther(val);

      const smartContract = getEthereumContract();
      const result = await smartContract.addUsage(
        fundsAddress,
        reason,
        val,
        usedOn
      );

      setIsLoading((prevState) => {
        return { ...prevState, addUsageInfo: true };
      });
      await result.wait();
      setIsLoading((prevState) => {
        return { ...prevState, addUsageInfo: false };
      });

      return { hash: result.hash };
    } catch (err) {
      console.log(
        "error occured while trying to add funds usage information\n" + err
      );
      return { error: err.error.message };
    }
  };

  const toggleFunds = async (fundsAddress) => {
    try {
      const statusConnected = await checkIfWalletIsConnected();
      if (!statusConnected) {
        await connectWallet();
      }

      const smartContract = getEthereumContract();
      const result = await smartContract.toggleFundsNeeded(fundsAddress);

      setIsLoading((prevState) => {
        return { ...prevState, toggleState: true };
      });
      await result.wait();
      setIsLoading((prevState) => {
        return { ...prevState, toggleState: false };
      });

      return { hash: result.hash };
    } catch (err) {
      console.log(
        "error occured while trying to toggle funds needed status\n" + err
      );
      return { error: err };
    }
  };
  const deleteFunds = async (fundsAddress) => {
    try {
      const statusConnected = await checkIfWalletIsConnected();
      if (!statusConnected) {
        await connectWallet();
      }

      const smartContract = getEthereumContract();
      const result = await smartContract.removeReliefFunds(fundsAddress);

      setIsLoading((prevState) => {
        return { ...prevState, deleteReliefFunds: true };
      });
      await result.wait();
      setIsLoading((prevState) => {
        return { ...prevState, deleteReliefFunds: false };
      });

      return { hash: result.hash };
    } catch (err) {
      console.log("error occured while trying to close relief funds\n" + err);
      return { error: err.error.message };
    }
  };

  const getUsage = async (fundsAddress) => {
    try {
      const statusConnected = await checkIfWalletIsConnected();
      if (!statusConnected) {
        await connectWallet();
      }

      const smartContract = getEthereumContract();
      let result = await smartContract.getUsage(fundsAddress);

      result = result.map((usage, i) => {
        let d = new Date(0);
        d.setUTCMilliseconds(usage.usedOn.toString());
        return [
          fundsAddress,
          d.toLocaleDateString(),
          ethers.utils.formatEther(usage.val.toString()),
          usage.reason,
        ];
      });

      return { data: result };
    } catch (err) {
      console.log(
        "error occured while trying to get usage information\n" + err
      );
      return { error: err.error.message };
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        isLoading,
        connectedWallet,
        connectWallet,
        searchReliefFunds,
        donate,
        getDonationHistory,
        addReliefFundsManager,
        addUsage,
        getUsage,
        toggleFunds,
        deleteFunds,
      }}
    >
      {props.children}
    </BlockchainContext.Provider>
  );
};
