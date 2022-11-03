import { useContext } from "react";
import { createRef } from "react";
import { useState } from "react";
import DashboardTable from "../../components/DashBoardTable/DashBoardTable";
import Modal from "../../components/Modal/Modal";
import { BlockchainContext } from "../../store/blockchain-context";

const Dashboard = () => {
  const [showErrorModal, setShowErrorModal] = useState(undefined);
  const [data, setData] = useState([]);
  const { getUsage } = useContext(BlockchainContext);
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
    }
  };

  return (
    <div className="container my-3">
      <form onSubmit={search}>
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
          <button className="btn btn-primary" type="submit">
            Get Usage
          </button>
        </div>
      </form>
      <DashboardTable data={data} />
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
