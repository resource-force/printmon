import React, { useState, useEffect } from "react";
import HistoricalGraph from "../components/HistoricalGraph";
import moment from "moment";
import { HistoricalTotals, MeterTypes } from "../api";
import MomentDate from "../components/MomentDate";

function getTotal(all: HistoricalTotals, type: MeterTypes) {
  const output: { [date: string]: number } = {};
  for (const date in all) {
    output[date] = all[date][type];
  }
  return output;
}

const API_HOST =
  process.env.REACT_APP_API_HOST || "https://printmon.potatofrom.space";

export default () => {
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
  }, []);

  return (
    <>
      <h1>
        AB Print Data from <MomentDate date={startDate} /> to{" "}
        <MomentDate date={endDate} />
      </h1>
      {dailyTotals !== undefined && (
        <>
          <HistoricalGraph
            data={getTotal(dailyTotals, MeterTypes.TOTAL_UNITS_OUTPUT)}
          />
          <HistoricalGraph data={getTotal(dailyTotals, MeterTypes.DUPLEX)} />
        </>
      )}
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
