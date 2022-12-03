import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

import { BlockchainContext } from "../../store/blockchain-context";
import TokenBalance from "../TokenBalance/TokenBalance";
import Modal from "../Modal/Modal";
import { contractAddress } from "../../utils/constansts";

const MainNavigation = () => {
  const { connectedWallet, connectWallet, addTokensToWallet, getTokenBalance } =
    useContext(BlockchainContext);
  const [showTokenBalanceErrorModal, setShowTokenBalanceErrorModal] =
    useState(undefined);
  const [showTokenBalanceModal, setShowTokenBalanceModal] = useState(undefined);

  const checkBalanceHandler = async () => {
    let result = await getTokenBalance();

    if (result.error) {
      setShowTokenBalanceErrorModal({
        title: "ERROR",
        error: result.error,
      });
    } else {
      setShowTokenBalanceModal({
        title: "TOKEN BALANCE",
        message: (
          <TokenBalance
            contract={contractAddress}
            account={connectedWallet}
            balance={result.balance.toString()}
          />
        ),
      });
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className={`navbar-brand ${classes["logo"]}`}>DRFMS</div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  // style={({ isActive }) => {
                  //   return isActive
                  //     ? { color: "white", backgroundColor: "black" }
                  //     : {};
                  // }}
                  className={`nav-link ${({ isActive }) =>
                    isActive ? "active" : "inactive"}`}
                  aria-current="page"
                  to="/"
                >
                  Donors
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  // style={({ isActive }) => {
                  //   return isActive
                  //     ? { color: "white", backgroundColor: "black" }
                  //     : {};
                  // }}
                  className={`nav-link ${({ isActive }) =>
                    isActive ? "active" : "inactive"}`}
                  aria-current="page"
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  // style={({ isActive }) => {
                  //   return isActive
                  //     ? { color: "white", backgroundColor: "black" }
                  //     : {};
                  // }}
                  className={`nav-link ${({ isActive }) =>
                    isActive ? "active" : "inactive"}`}
                  aria-current="page"
                  to="/managers"
                >
                  Managers
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  // style={({ isActive }) => {
                  //   return isActive
                  //     ? { color: "white", backgroundColor: "black" }
                  //     : {};
                  // }}
                  className={`nav-link ${({ isActive }) =>
                    isActive ? "active" : "inactive"}`}
                  aria-current="page"
                  to="/trade"
                >
                  Trade
                </NavLink>
              </li>
            </ul>
            <ul className={`navbar-nav ms-auto ${classes["right-nav-items"]}`}>
              {connectedWallet !== "" && (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-secondary"
                      onClick={addTokensToWallet}
                    >
                      Missing Tokens?
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-secondary"
                      onClick={checkBalanceHandler}
                    >
                      Token Balance
                    </button>
                  </li>
                </>
              )}
              <li className="nav-item">
                <button className="btn btn-primary" onClick={connectWallet}>
                  {connectedWallet !== "" ? "Connected" : "Connect Wallet"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {showTokenBalanceModal && (
        <Modal
          dismissModal={setShowTokenBalanceModal}
          title={showTokenBalanceModal.title}
          message={showTokenBalanceModal.message}
        />
      )}

      {showTokenBalanceErrorModal && (
        <Modal
          dismissModal={setShowTokenBalanceErrorModal}
          title={showTokenBalanceErrorModal.title}
          message={showTokenBalanceErrorModal.error}
        />
      )}
    </>
  );
};

export default MainNavigation;
