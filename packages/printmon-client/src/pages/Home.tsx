import React, { useState, useEffect } from "react";
import moment from "moment";
import { HistoricalTotals, MeterTypes } from "../api";
import { withRouter } from "react-router";
import PrintData from "../components/CurrentYearView";
import { Spinner } from "@blueprintjs/core";
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";

function getTotal(all: HistoricalTotals) {
  const output: { [date: string]: number } = {};
  for (const date in all) {
    output[date] =
      all[date][MeterTypes.TOTAL_UNITS_OUTPUT] - all[date][MeterTypes.DUPLEX];
  }
  return output;
}

function getMomentFormatter(format: string): IDateFormatProps {
  // note that locale argument comes from locale prop and may be undefined
  return {
    formatDate: (date: Date, locale: string) =>
      moment(date)
        .locale(locale)
        .format(format),
    parseDate: (str: string, locale: string) =>
      moment(str, format)
        .locale(locale)
        .toDate(),
    placeholder: format
  };
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
    setDailyTotals(undefined);
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
      <h1>AB Paper Consumption</h1>
      <p>
        <em>
          From{" "}
          <DateInput
            {...getMomentFormatter("LL")}
            value={startDate.toDate()}
            maxDate={endDate.toDate()}
            onChange={e => {
              setStartDate(moment(e));
              updateTotals();
            }}
            locale="en"
          />{" "}
          to{" "}
          <DateInput
            {...getMomentFormatter("LL")}
            value={endDate.toDate()}
            minDate={startDate.toDate()}
            onChange={e => {
              setEndDate(moment(e));
              updateTotals();
            }}
            locale="en"
          />
          ...
        </em>
      </p>

      {dailyTotals !== undefined ? (
        <>
          <PrintData
            data={getTotal(dailyTotals)}
            days={endDate.diff(startDate, "days")}
          />
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p>
            <Spinner />
          </p>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}

export default withRouter(Home);
