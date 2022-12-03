import { useState } from "react";
import { createRef, useContext } from "react";
import { BlockchainContext } from "../../store/blockchain-context";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

const TokenToEth = () => {
  const amountFieldRef = createRef();
  const { tokenToEth, isLoading } = useContext(BlockchainContext);
  const [showModal, setShowModal] = useState(undefined);
  const [showErrorModal, setShowErrorModal] = useState(undefined);

  const submitHandler = async (e) => {
    e.preventDefault();

    const result = await tokenToEth(amountFieldRef.current.value);

    if (result.error) {
      setShowErrorModal({
        title: "TRADE UNSUCCESSFUL",
        error: result.error,
      });
    } else {
      setShowModal({
        title: "TRADE SUCCESSFUL",
        message: "Check wallet to confirm the receival of Ethers.",
      });
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={submitHandler}>
        <legend className="mt-3">
          PSH&nbsp;&nbsp;→&nbsp;&nbsp;ETH (1 PSH = 1 ETH)
        </legend>
        <div className="input-group mb-3">
          <div className="input-group-text">PSH</div>
          <div className="form-floating">
            <input
              required
              ref={amountFieldRef}
              step="0.00001"
              min="0.00001"
              max={Infinity}
              type="number"
              id="amount"
              className="form-control"
              placeholder="Enter donation amount here."
            />
            <label htmlFor="amount">Trade Amount</label>
          </div>
        </div>
        <div className="d-grid col-6 mx-auto">
          <button
            className="btn btn-primary"
            disabled={isLoading.tokenToEth}
            type="submit"
          >
            {isLoading.tokenToEth ? <Loader /> : "Trade"}
          </button>
        </div>
      </form>
      {showModal && (
        <Modal
          dismissModal={setShowModal}
          message={showModal.message}
          title={showModal.title}
        />
      )}
      {showErrorModal && (
        <Modal
          dismissModal={setShowErrorModal}
          message={showErrorModal.error}
          title={showErrorModal.title}
        />
      )}
    </div>
  );
};

export default TokenToEth;
