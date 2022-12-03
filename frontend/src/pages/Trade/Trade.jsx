import EthToToken from "../../components/EthToToken/EthToToken";
import TokenToEth from "../../components/TokenToEth/TokenToEth";
import classes from "./Trade.module.css";

const Trade = () => {
  return (
    <>
      <EthToToken />
      <TokenToEth />
    </>
  );
};

export default Trade;
