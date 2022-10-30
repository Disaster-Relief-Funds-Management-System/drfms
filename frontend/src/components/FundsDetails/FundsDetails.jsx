const FundsDetails = ({ address, description, status, dismissHandler }) => {
  return (
    <div
      className={`container mt-5
      }`}
      style={{ border: `2px dashed ${status === true ? "green" : "red"}` }}
    >
      <div className="row">
        <div className="col-sm-4 col-12 text-sm-end">Address</div>
        <div className="col-sm-8 col-12">{address}</div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-12 text-sm-end">Description</div>
        <div className="col-sm-8 col-12">{description}</div>
      </div>
      <div className="row">
        <div className="col-sm-4 col-12 text-sm-end">Status</div>
        <div className="col-sm-8 col-12">{status ? "true" : "false"}</div>
      </div>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-2">
        <button type="button" className="btn btn-dark" onClick={dismissHandler}>
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default FundsDetails;
