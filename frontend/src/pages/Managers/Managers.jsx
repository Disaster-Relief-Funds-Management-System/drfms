import AddReliefFundsManager from "../../components/AddReliefFundsManager/AddReliefFundsManager";
import AddUsage from "../../components/AddUsage/AddUsage";
import DeleteFunds from "../../components/DeleteFunds/DeleteFunds";
import ToggleFundsStatus from "../../components/ToggleFundsStatus/ToggleFundsStatus";

const Managers = () => {
  return (
    <>
      <AddReliefFundsManager />
      <AddUsage />
      <ToggleFundsStatus />
      <DeleteFunds />
    </>
  );
};

export default Managers;
