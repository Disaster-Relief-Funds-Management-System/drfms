import { useContext, useState } from "react";
import { createRef } from "react";
import { BlockchainContext } from "../../store/blockchain-context";
import { hash } from "../../utils/shortenAddress";
import Modal from "../Modal/Modal";

const AddUsage = () => {
  const fundsAddressRef = createRef();
  const usageInfoRef = createRef(); // a.k.a. reason
  const dateRef = createRef();
  const usedAmountRef = createRef();
  const { addUsage } = useContext(BlockchainContext);
  const [showSuccessModal, setShowSuccessModal] = useState(undefined);
  const [showErrorModal, setShowErrorModal] = useState(undefined);

  const addUsageSubmitHandler = async (e) => {
    e.preventDefault();

    const usedOn = new Date(dateRef.current.value);

    const result = await addUsage(
      fundsAddressRef.current.value,
      usageInfoRef.current.value,
      usedAmountRef.current.value,
      usedOn.getTime()
    );

    if (result.error) {
      console.log(result.error);
      const errArray = result.error.split(":");
      setShowErrorModal({
        title: errArray[0].trim().toUpperCase(),
        error: errArray[1].trim().toUpperCase(),
      });
    } else {
      setShowSuccessModal({
        title: "Successfully Added Usage Information",
        hash: result.hash,
      });
    }
  };

  return (
    <div className="container">
      <form onSubmit={addUsageSubmitHandler}>
        <legend className="mt-5">Add Usage Information</legend>
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
            ref={usageInfoRef}
            className="form-control"
            placeholder="Leave a reason here."
            id="floatingTextarea2"
            style={{ height: "100px" }}
          ></textarea>
          <label htmlFor="floatingTextarea2">
            Where/How were the funds used?
          </label>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-text">
            <label htmlFor="date">Date Used</label>
          </div>
          <input
            required
            ref={dateRef}
            type="date"
            id="date"
            className="form-control"
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-text">ETH</div>
          <div className="form-floating">
            <input
              required
              ref={usedAmountRef}
              step="0.00001"
              type="number"
              id="amount"
              className="form-control"
              placeholder="Enter donation amount here."
            />
            <label htmlFor="amount">Donation Amount</label>
          </div>
        </div>
        <div className="d-grid col-6 mx-auto">
          <button
            className="btn btn-primary"
            // disabled={ctx.donateIsLoading}
            type="submit"
          >
            {/* {ctx.donateIsLoading ? <Loader /> :  */}
            Add Usage
            {/* } */}
          </button>
        </div>
      </form>
      {showSuccessModal && (
        <Modal
          dismissModal={setShowSuccessModal}
          title={showSuccessModal.title}
          message={
            <a
              href={`https://goerli.etherscan.io/tx/${showSuccessModal.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hash(showSuccessModal.hash)}
            </a>
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

export default AddUsage;
