import classes from "./TokenBalance.module.css";
import { hash } from "../../utils/shortenAddress";

const TokenBalance = ({ contract, account, balance }) => {
  return (
    <div className={classes["token-balance"]}>
      <em>
        <strong>Account</strong>
      </em>
      <br />
      <div>
        <a
          href={`https://goerli.etherscan.io/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {account}
        </a>
      </div>
      <em>
        <strong>Token</strong>
      </em>
      <br />
      <div>
        <a
          href={`https://goerli.etherscan.io/token/${contract}?a=${account}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {hash(contract)}
          {" → "}
          {hash(account)}
        </a>
      </div>
      <br />
      <em>
        <strong>Token Balance</strong>
      </em>
      <br />
      <div>{balance} (PSH)</div>
    </div>
  );
};

export default TokenBalance;
