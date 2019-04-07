import React, { useState, useEffect } from "react";
import HistoricalGraph from "../components/HistoricalGraph";
import moment from "moment";

export default () => {
  const [startDate, setStartDate] = useState(moment.utc("2018-07-01"));
  const [endDate, setEndDate] = useState(moment.utc());
  const [dailyTotals, setDailyTotals] = useState<
    { [date: string]: number } | undefined
  >(undefined);

  async function updateTotals() {
    const values = await fetch(
      `/api/historical?startDate=${startDate.format(
        "YYYY-MM-DD"
      )}&endDate=${endDate.format("YYYY-MM-DD")}`
    );
    setDailyTotals(await values.json());
  }

  useEffect(() => {
    updateTotals();
  }, []);

  return (
    <>
      <h1>
        AB Print Data from {startDate.toString()} to {endDate.toLocaleString()}
      </h1>
      {dailyTotals !== undefined && <HistoricalGraph data={dailyTotals} />}
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
    </>
  );
};
