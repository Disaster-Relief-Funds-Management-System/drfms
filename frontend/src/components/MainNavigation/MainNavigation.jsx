import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

import { BlockchainContext } from "../../store/blockchain-context";

const MainNavigation = () => {
  const { connectedWallet, connectWallet } = useContext(BlockchainContext);
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
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn btn-primary" onClick={connectWallet}>
                  {connectedWallet !== "" ? "Connected" : "Connect Wallet"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainNavigation;
