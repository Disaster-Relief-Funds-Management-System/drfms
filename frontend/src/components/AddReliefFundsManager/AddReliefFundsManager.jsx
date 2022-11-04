import { useState } from "react";
import { createRef, useContext } from "react";
import { BlockchainContext } from "../../store/blockchain-context";
import { hash } from "../../utils/shortenAddress";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

const AddReliefFundsManager = () => {
  const fundsAddressRef = createRef();
  const descriptionRef = createRef();
  const [showModal, setShowModal] = useState(undefined);
  const [errorModal, setErrorModal] = useState(undefined);

  const { addReliefFundsManager, isLoading } = useContext(BlockchainContext);

  const generateHandler = async (e) => {
    e.preventDefault();

    const result = await addReliefFundsManager(
      fundsAddressRef.current.value,
      descriptionRef.current.value
    );
    if (result.error) {
      console.log(result.error);
      const errArray = result.error.split(":");
      setErrorModal({
        title: errArray[0].trim().toUpperCase(),
        error: errArray[1].trim().toUpperCase(),
      });
    } else {
      setShowModal({
        title: "Relief Funds Successfully Generated",
        hash: result.hash,
      });
    }
  };

  return (
    <div className="container">
      <form onSubmit={generateHandler}>
        <legend className="mt-3">Generate New Relief Funds Form</legend>
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
        <div className="form-floating mb-3">
          <textarea
            ref={descriptionRef}
            className="form-control"
            placeholder="Leave a description here."
            id="floatingTextarea2"
            style={{ height: "100px" }}
          ></textarea>
          <label htmlFor="floatingTextarea2">
            What is the use of this relief funds?
          </label>
        </div>
        <div className="d-grid col-6 mx-auto">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading.generateNewReliefFunds}
          >
            {isLoading.generateNewReliefFunds ? <Loader /> : "Generate"}
          </button>
        </div>
      </form>
      {showModal && (
        <Modal
          dismissModal={setShowModal}
          title={showModal.title}
          message={
            <a
              href={`https://goerli.etherscan.io/tx/${showModal.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hash(showModal.hash)}
            </a>
          }
        />
      )}
      {errorModal && (
        <Modal
          dismissModal={setErrorModal}
          title={errorModal.title}
          message={errorModal.error}
        />
      )}
    </div>
  );
};

export default AddReliefFundsManager;
