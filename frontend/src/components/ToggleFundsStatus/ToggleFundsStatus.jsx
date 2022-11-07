import { useContext } from "react";
import { useState } from "react";
import { createRef } from "react";
import { BlockchainContext } from "../../store/blockchain-context";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

const ToggleFundsStatus = () => {
  const fundsAddressRef = createRef();
  const { searchReliefFunds, toggleFunds, isLoading } =
    useContext(BlockchainContext);
  const [showSuccessModal, setShowSuccessModal] = useState(undefined);
  const [showErrorModal, setShowErrorModal] = useState(undefined);

  const toggleFundsSubmitHandler = async (e) => {
    e.preventDefault();

    const fundsAddress = fundsAddressRef.current.value;
    const result = await toggleFunds(fundsAddress);

    if (result.error) {
      console.log("hererererere  ........\n\n\n\n");
      console.log(result.error.error.message);
      const errArray = result.error.error.message.split(":");
      setShowErrorModal({
        title: errArray[0].trim().toUpperCase(),
        error: errArray[1].trim().toUpperCase(),
      });
    } else {
      const { data } = await searchReliefFunds(fundsAddress);

      setShowSuccessModal({
        title: `Successfully ${
          data.fundsNeeded === true ? "Resumed" : "Paused"
        } the Relief Funds`,
        message: (
          <>
            <em>
              <strong>Relief Fund</strong>
            </em>
            <br />
            <a
              href={`https://goerli.etherscan.io/address/${fundsAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fundsAddress}
            </a>
            <br />
            <div>
              Is now{" "}
              {data.fundsNeeded === true ? (
                <strong>ACCEPTING</strong>
              ) : (
                <strong>NOT ACCEPTING</strong>
              )}{" "}
              donations.
            </div>
          </>
        ),
      });
    }
  };
  return (
    <div className="container mb-5">
      <form onSubmit={toggleFundsSubmitHandler}>
        <legend className="mt-5">Toggle Relief Funds' Status</legend>
        <div className="form-floating my-3">
          <input
            required
            ref={fundsAddressRef}
            type="text"
            id="fundsAddress"
            className="form-control col-4"
            placeholder="Enter Funds Address here."
          />
          <label htmlFor="fundsAddress" className="form-label">
            Funds Address
          </label>
        </div>
        <div className="d-grid col-6 mx-auto">
          <button
            className="btn btn-warning"
            type="submit"
            disabled={isLoading.toggleState}
          >
            {isLoading.toggleState ? <Loader /> : "Toggle Status"}
          </button>
        </div>
      </form>
      {showSuccessModal && (
        <Modal
          dismissModal={setShowSuccessModal}
          title={showSuccessModal.title}
          message={showSuccessModal.message}
        />
      )}
      {showErrorModal && (
        <Modal
          dismissModal={setShowErrorModal}
          title={showErrorModal.title}
          message={showErrorModal.error}
        />
      )}
    </div>
  );
};

export default ToggleFundsStatus;
