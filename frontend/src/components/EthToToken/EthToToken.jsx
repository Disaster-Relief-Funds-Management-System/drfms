import { createRef, useState } from "react";
import { useContext } from "react";
import { BlockchainContext } from "../../store/blockchain-context";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

const EthToToken = () => {
  const amountFieldRef = createRef();
  const { isLoading, ethToToken } = useContext(BlockchainContext);
  const [showErrorModal, setShowErrorModal] = useState(undefined);
  const [showModal, setShowModal] = useState(undefined);

  const submitHandler = async (e) => {
    e.preventDefault();

    const result = await ethToToken(amountFieldRef.current.value);

    if (result.error) {
      setShowErrorModal({
        title: "TRADE UNSUCCESSFUL",
        error: result.error,
      });
    } else {
      setShowModal({
        title: "TRADE SUCCESSFUL",
        message:
          'Check your wallet. If you don\'t see PSH tokens then click "Missing Tokens?" button from the navigation bar.',
      });
    }
  };

  return (
    <div className="container">
      <form onSubmit={submitHandler}>
        <legend className="mt-3">
          ETH&nbsp;&nbsp;→&nbsp;&nbsp;PSH (1 ETH = 1 PSH)
        </legend>
        <div className="input-group mb-3">
          <div className="input-group-text">ETH</div>
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
            disabled={isLoading.ethToToken}
            type="submit"
          >
            {isLoading.ethToToken ? <Loader /> : "Trade"}
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

export default EthToToken;
