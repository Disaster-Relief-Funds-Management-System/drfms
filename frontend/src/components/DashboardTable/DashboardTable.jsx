import { useEffect } from "react";
import { useState } from "react";

import classes from "./DashboardTable.module.css";

const DashboardTable = ({ data }) => {
  const [showReasonModal, setShowReasonModal] = useState(undefined);
  const [sortingOrder, setSortingOrder] = useState([true, true, true, true]);
  const [dataState, setDataState] = useState([]);

  useEffect(() => {
    setDataState(data);
  }, [data]);

  const clickHandler = (column) => {
    let order = [...sortingOrder];
    order[column] = !order[column];
    setSortingOrder([...order]);

    data = dataState.sort((usageA, usageB) => {
      if (column === 1) {
        // date
        let dateB = new Date(`${usageB[column]}`).getTime();
        let dateA = new Date(`${usageA[column]}`).getTime();

        if (dateB < dateA) {
          return order[column] === true ? 1 : -1;
        } else if (dateB > dateA) {
          return order[column] === true ? -1 : 1;
        } else {
          return 0;
        }
      } else {
        if (usageB[column] < usageA[column]) {
          return order[column] === true ? 1 : -1;
        } else if (usageB[column] > usageA[column]) {
          return order[column] === true ? -1 : 1;
        } else {
          return 0;
        }
      }
    });
    setDataState([...data]);
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered">
        <thead className={classes["table-heading"]}>
          <tr>
            <th
              onClick={() => {
                clickHandler(0);
              }}
            >
              Funds Address
            </th>
            <th
              onClick={() => {
                clickHandler(1);
              }}
            >
              Used On
            </th>
            <th
              onClick={() => {
                clickHandler(2);
              }}
            >
              Amount (ETH)
            </th>
            <th
              onClick={() => {
                clickHandler(3);
              }}
            >
              Reason
            </th>
          </tr>
        </thead>
        <tbody>
          {dataState.map((col, i) => {
            return (
              <tr key={i}>
                <td>{col[0]}</td>
                <td>{col[1]}</td>
                <td>{col[2]}</td>
                <td>{col[3]}</td>
              </tr>
              // {col.map((el, j) => {
              //   return <td key={j}>{el}</td>;
              // })}
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
