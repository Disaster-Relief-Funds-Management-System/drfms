import { useContext } from "react";
import { useState } from "react";
import { createRef } from "react";
import { BlockchainContext } from "../../store/blockchain-context";
import { hash } from "../../utils/shortenAddress";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";

const DeleteFunds = () => {
  const fundsAddressRef = createRef();
  const { deleteFunds, isLoading } = useContext(BlockchainContext);
  const [showSuccessModal, setShowSuccessModal] = useState(undefined);
  const [showErrorModal, setShowErrorModal] = useState(undefined);

  const deleteFundsSubmitHandler = async (e) => {
    e.preventDefault();

    const fundsAddress = fundsAddressRef.current.value;
    const result = await deleteFunds(fundsAddress);

    if (result.error) {
      console.log(result.error);
      const errArray = result.error.split(":");
      setShowErrorModal({
        title: errArray[0].trim().toUpperCase(),
        error: errArray[1].trim().toUpperCase(),
      });
    } else {
      setShowSuccessModal({
        title: "Successfully Deleted the Relief Funds",
        hash: result.hash,
        fundsAddress: fundsAddress,
      });
    }
  };
  return (
    <div className="container mb-5">
      <form onSubmit={deleteFundsSubmitHandler}>
        <legend className="mt-5">Terminate Relief Funds</legend>
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
            className="btn btn-danger"
            disabled={isLoading.deleteReliefFunds}
            type="submit"
          >
            {isLoading.deleteReliefFunds ? <Loader /> : "Delete Relief Funds"}
          </button>
        </div>
      </form>
      {showSuccessModal && (
        <Modal
          dismissModal={setShowSuccessModal}
          title={showSuccessModal.title}
          message={
            <>
              Terminated{" "}
              <em>
                <u>{hash(showSuccessModal.fundsAddress)}</u>
              </em>{" "}
              relief funds.
              <br />
              Manager details removed.
              <br />
              <em>
                <u>{hash(showSuccessModal.fundsAddress)}</u>
              </em>{" "}
              available for new relief funds.
              <br />
              <a
                href={`https://goerli.etherscan.io/tx/${showSuccessModal.hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hash(showSuccessModal.hash)}
              </a>
            </>
          }
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

export default DeleteFunds;
