import classes from "./SearchResult.module.css";

const SearchResult = ({
  status,
  manager,
  fundsAddress,
  totalAmount,
  description,
}) => {
  return (
    <div className={classes["search-result"]}>
      <em>
        <strong>Status</strong>
      </em>
      <br />
      <div>{status}</div>
      <br />
      <em>
        <strong>Manager</strong>
      </em>
      <br />
      <div>
        <a
          href={`https://goerli.etherscan.io/address/${manager}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {manager}
        </a>
      </div>
      <br />
      <em>
        <strong>Funds Address</strong>
      </em>
      <br />
      <div>
        <a
          href={`https://goerli.etherscan.io/address/${fundsAddress}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {fundsAddress}
        </a>
      </div>
      <br />
      <em>
        <strong>Total Amount Donated</strong>
      </em>
      <br />
      <div>{totalAmount} (PSH)</div>
      <br />
      <em>
        <strong>Description</strong>
      </em>
      <br />
      <div>{description}</div>
    </div>
  );
};

export default SearchResult;
