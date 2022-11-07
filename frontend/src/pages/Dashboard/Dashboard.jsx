import { useContext } from "react";
import { createRef } from "react";
import { useState } from "react";
import DashboardTable from "../../components/DashBoardTable/DashBoardTable";
import Modal from "../../components/Modal/Modal";
import { BlockchainContext } from "../../store/blockchain-context";

const Dashboard = () => {
  const [showErrorModal, setShowErrorModal] = useState(undefined);
  const [data, setData] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [usageDataRequested, setUsageDataRequested] = useState(false);
  const [historyDataRequested, setHistoryDataRequested] = useState(false);
  const { getUsage, getDonationHistory } = useContext(BlockchainContext);
  const fundsAddressRef = createRef();

  const search = async (e) => {
    e.preventDefault();

    const fundsAddress = fundsAddressRef.current.value;
    const result = await getUsage(fundsAddress);

    if (result.error) {
      console.log(result.error);
      const errArray = result.error.split(":");
      setShowErrorModal({
        title: errArray[0].trim().toUpperCase(),
        error: errArray[1].trim().toUpperCase(),
      });
    } else {
      setData(result.data);
      setUsageDataRequested(true);
    }
  };

  const getDonationHistoryHandler = async (e) => {
    e.preventDefault();

    const fundsAddress = fundsAddressRef.current.value;
    const result = await getDonationHistory(fundsAddress);

    if (result.error) {
      console.log(result.error);
      const errArray = result.error.split(":");
      setShowErrorModal({
        title: errArray[0].trim().toUpperCase(),
        error: errArray[1].trim().toUpperCase(),
      });
    } else {
      setDonationHistory(result.donationHistory);
      console.log(result.donationHistory);
      setHistoryDataRequested(true);
    }
  };

  return (
    <div className="container my-3">
      <form>
        <div className="input-group mb-3">
          <div className="form-floating">
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
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={search}
          >
            Get Usage
          </button>
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={getDonationHistoryHandler}
          >
            Get Donation History
          </button>
        </div>
      </form>
      {data.length > 0 ? (
        <DashboardTable
          headings={["Funds Address", "Used On", "Amount (ETH)", "Reason"]}
          data={data}
        />
      ) : (
        usageDataRequested && (
          <Modal
            title={"NO DATA PROVIDED"}
            message="The funds manager has not provided any usage data yet. Please contact them."
            dismissModal={setUsageDataRequested}
          />
        )
      )}

      {donationHistory.length > 0 ? (
        <DashboardTable
          headings={["Funds Address", "Donated On", "Amount (ETH)", "Donor"]}
          data={donationHistory}
        />
      ) : (
        historyDataRequested && (
          <Modal
            title={"NO DATA AVAILABLE"}
            message="There hasn't been any donations to this relief fund."
            dismissModal={setHistoryDataRequested}
          />
        )
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

export default Dashboard;
