import { useState } from "react";
import { createRef, useContext } from "react";

import { BlockchainContext } from "../../store/blockchain-context";
import FundsDetails from "../../components/FundsDetails/FundsDetails";
import Loader from "../../components/Loader/Loader";
import { hash } from "../../utils/shortenAddress";

const Donors = () => {
  const ctx = useContext(BlockchainContext);
  const [descriptionStatus, setDescriptionStatus] = useState();
  const searchFieldRef = createRef();
  const amountFieldRef = createRef();

  const searchButtonHandler = async (e) => {
    const searchResult = await ctx.searchReliefFunds(
      searchFieldRef.current.value
    );
    setDescriptionStatus({
      address: searchFieldRef.current.value,
      description: searchResult[0],
      status: searchResult[1],
    });
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
  const dismissHandler = () => {
    setDescriptionStatus(undefined);
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

      {descriptionStatus !== undefined ? (
        <FundsDetails
          address={hash(descriptionStatus.address)}
          description={descriptionStatus.description}
          status={descriptionStatus.status}
          dismissHandler={dismissHandler}
        />
      ) : null}
    </div>
  );
};

export default Donors;
