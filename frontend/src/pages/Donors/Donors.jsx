import { useState } from "react";
import { createRef, useContext } from "react";

import { BlockchainContext } from "../../store/blockchain-context";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/Modal";
import SearchResult from "../../components/SearchResult/SearchResult";

const Donors = () => {
  const ctx = useContext(BlockchainContext);
  const [showErrorModal, setShowErrorModal] = useState(undefined);
  const [showDetailsModal, setShowDetailsModal] = useState(undefined);
  const searchFieldRef = createRef();
  const amountFieldRef = createRef();

  const searchButtonHandler = async (e) => {
    const result = await ctx.searchReliefFunds(searchFieldRef.current.value);

    if (result.error) {
      const errArray = result.error.split(":");
      setShowErrorModal({
        title: errArray[0].trim().toUpperCase(),
        error: errArray[1].trim().toUpperCase(),
      });
    } else {
      if (
        result.data.manager === "0x0000000000000000000000000000000000000000"
      ) {
        setShowDetailsModal({
          message: (
            <SearchResult
              status="INVALID RELIEF FUNDS"
              totalAmount="N/A"
              description="N/A"
              manager="N/A"
              fundsAddress="N/A"
            />
          ),
        });
      } else if (!result.data.fundsNeeded) {
        setShowDetailsModal({
          message: (
            <SearchResult
              status="NOT ACCEPTING FUNDS"
              totalAmount={result.data.totalAmount}
              description={result.data.description}
              manager={result.data.manager}
              fundsAddress={result.data.fundsAddress}
            />
          ),
        });
      } else {
        setShowDetailsModal({
          message: (
            <SearchResult
              status="ACCEPTING FUNDS"
              totalAmount={result.data.totalAmount}
              description={result.data.description}
              manager={result.data.manager}
              fundsAddress={result.data.fundsAddress}
            />
          ),
        });
      }
    }
  };

  const donateHandler = async (e) => {
    // TODO try catch so to display message to user
    // TODO display ehterscan with txhash
    e.preventDefault();
    try {
      const result = await ctx.donate(
        searchFieldRef.current.value,
        amountFieldRef.current.value
      );
    } catch (err) {
      console.log(err.error.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={donateHandler}>
        <div className="input-group mt-3 mb-3">
          <div className="form-floating">
            <input
              required
              ref={searchFieldRef}
              type="text"
              id="fundsAddress"
              className="form-control col-4"
              placeholder="Enter Funds Address here."
            />
            <label htmlFor="fundsAddress" className="form-label">
              Funds Address
            </label>
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={searchButtonHandler}
          >
            Search
          </button>
        </div>
        <div className="input-group mb-3">
          <div className="input-group-text">ETH</div>
          <div className="form-floating">
            <input
              required
              ref={amountFieldRef}
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
            disabled={ctx.donateIsLoading}
            type="submit"
          >
            {ctx.donateIsLoading ? <Loader /> : "Donate"}
          </button>
        </div>
      </form>

      {showDetailsModal && (
        <Modal
          dismissModal={setShowDetailsModal}
          title={"Search Result"}
          message={showDetailsModal.message}
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

export default Donors;
