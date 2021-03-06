import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import { HistoricalTotals, MeterTypes } from "../api";
import { withRouter } from "react-router";
import PrintData from "../components/CurrentYearView";
import { Spinner, Button } from "@blueprintjs/core";
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";

function getTotal(all: HistoricalTotals) {
  const output: { [date: string]: number } = {};
  let t = 0;
  for (const date in all) {
    output[date] =
      all[date][MeterTypes.TOTAL_UNITS_OUTPUT] - all[date][MeterTypes.DUPLEX];
    t += all[date][MeterTypes.TOTAL_UNITS_OUTPUT];
  }
  console.log(t, "units output");
  return output;
}

function getMomentFormatter(format: string): IDateFormatProps {
  // note that locale argument comes from locale prop and may be undefined
  return {
    formatDate: (date: Date, locale: string) =>
      moment(date)
        .locale(locale)
        .format(format),
    parseDate: (str: string, locale: string) => {
      const date = moment.utc(str, format).locale(locale);
      if (!date.isValid()) {
        return false;
      } else {
        return date.toDate();
      }
    },
    placeholder: format
  };
}

const API_HOST =
  process.env.REACT_APP_API_HOST || "https://printmon.potatofrom.space";

const CURRENT_SCHOOL_YEAR = 2019;

function Home() {
  const [startDate, setStartDate] = useState(
    moment(`${CURRENT_SCHOOL_YEAR}-07-01`)
  );
  const [endDate, setEndDate] = useState(moment.utc());
  const [dailyTotals, setDailyTotals] = useState<HistoricalTotals | undefined>(
    undefined
  );

  const updateTotals = useCallback(async () => {
    setDailyTotals(undefined);
    const values = await fetch(
      `${API_HOST}/api/historical?startDate=${startDate.format(
        "YYYY-MM-DD"
      )}&endDate=${endDate.format("YYYY-MM-DD")}`
    );
    setDailyTotals(await values.json());
  }, [startDate, endDate]);

  useEffect(() => {
    updateTotals();
  }, [updateTotals]);

  return (
    <>
      <h1>ABRHS Paper Consumption</h1>
      <em>
        From{" "}
        <DateInput
          {...getMomentFormatter("LL")}
          canClearSelection={false}
          value={startDate.toDate()}
          maxDate={endDate.toDate()}
          onChange={(e, isUserChange) => {
            if (isUserChange) {
              setStartDate(moment(e));
            }
          }}
          locale="en"
        />{" "}
        to{" "}
        <DateInput
          {...getMomentFormatter("LL")}
          canClearSelection={false}
          value={endDate.toDate()}
          minDate={startDate.toDate()}
          maxDate={new Date()}
          onChange={(e, isUserChange) => {
            if (isUserChange) {
              setEndDate(moment(e));
            }
          }}
          locale="en"
        />
        ...
      </em>{" "}
      <Button
        onClick={() => {
          setStartDate(moment(`${CURRENT_SCHOOL_YEAR}-07-01`));
          setEndDate(moment());
        }}
      >
        This Year to Date
      </Button>{" "}
      <Button
        onClick={() => {
          setStartDate(moment(`${CURRENT_SCHOOL_YEAR - 1}-07-01`));
          setEndDate(moment(`${CURRENT_SCHOOL_YEAR}-06-30`));
        }}
      >
        All of Last Year
      </Button>{" "}
      <Button
        onClick={() => {
          setStartDate(moment(`${CURRENT_SCHOOL_YEAR - 1}-07-01`));
          setEndDate(moment().subtract(1, "year"));
        }}
      >
        This Time Last Year
      </Button>
      <br />
      <br />
      {dailyTotals !== undefined ? (
        <>
          <PrintData
            data={getTotal(dailyTotals)}
            days={endDate.diff(startDate, "days")}
          />
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Spinner />

          <p>Loading...</p>
        </div>
      )}
      <h2>Questions</h2>
      <p>
        If you have any questions on the data provided or our paper usage as a
        whole, please contact us at{" "}
        <a href="mailto:ABPaperProject@gmail.com">ABPaperProject@gmail.com</a>.
      </p>
    </>
  );
}

export default withRouter(Home);
