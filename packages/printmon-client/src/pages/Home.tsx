import React, { useState, useEffect } from "react";
import moment from "moment";
import { HistoricalTotals, MeterTypes } from "../api";
import MomentDate from "../components/MomentDate";
import { withRouter } from "react-router";
import PrintData from "../components/CurrentYearView";

function getTotal(all: HistoricalTotals) {
  const output: { [date: string]: number } = {};
  for (const date in all) {
    output[date] =
      all[date][MeterTypes.TOTAL_UNITS_OUTPUT] - all[date][MeterTypes.DUPLEX];
  }
  return output;
}

const API_HOST =
  process.env.REACT_APP_API_HOST || "https://printmon.potatofrom.space";

function Home() {
  const [startDate, setStartDate] = useState(moment.utc("2018-07-01"));
  const [endDate, setEndDate] = useState(moment.utc());
  const [dailyTotals, setDailyTotals] = useState<HistoricalTotals | undefined>(
    undefined
  );


  async function updateTotals() {
    const values = await fetch(
      `${API_HOST}/api/historical?startDate=${startDate.format(
        "YYYY-MM-DD"
      )}&endDate=${endDate.format("YYYY-MM-DD")}`
    );
    setDailyTotals(await values.json());
  }

  useEffect(() => {
    updateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        AB Print Data from <MomentDate date={startDate} /> to{" "}
        <MomentDate date={endDate} />
      </h1>
      {dailyTotals !== undefined && <PrintData data={getTotal(dailyTotals)} />}
      <p>
        Select Date Range:{" "}
        <input
          type="date"
          value={startDate.format("YYYY-MM-DD")}
          onChange={e => setStartDate(moment(e.target.value))}
          onBlur={updateTotals}
        />{" "}
        to
        <input
          type="date"
          value={endDate.format("YYYY-MM-DD")}
          onChange={e => setEndDate(moment(e.target.value))}
          onBlur={updateTotals}
        />
      </p>
    

      </>
  );
}

export default withRouter(Home);
