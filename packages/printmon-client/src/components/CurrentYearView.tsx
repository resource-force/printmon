import React from "react";
import moment from "moment";
import Stats from "./Stats";
import HistoricalGraph from "./HistoricalGraph";
import TreeDisplay from "./tree-display/TreeDisplay";

export default ({ data }: { data: { [date: string]: number } }) => {
  let unrecycledPaperTotal = 0;
  let recycledPaperTotal = 0;
  const monthlyTotals = new Map<string, number>();
  for (const date in data) {
    const roundedDate = moment(date).format("YYYY-MM");
    const oldTotal = monthlyTotals.get(roundedDate) || 0;
    monthlyTotals.set(roundedDate, data[date] + oldTotal);

    if (moment(date) < moment("2019-05-01")) {
      unrecycledPaperTotal += data[date];
    } else {
      recycledPaperTotal += data[date];
    }
  }

  const totalArray: { date: string; total: number }[] = [];
  for (const [date, total] of monthlyTotals) {
    totalArray.push({ date, total });
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TreeDisplay
          unrecycledPaperTotal={unrecycledPaperTotal}
          recycledPaperTotal={recycledPaperTotal}
        />
        <HistoricalGraph data={totalArray} />
        <Stats
          unrecycledPaperTotal={unrecycledPaperTotal}
          recycledPaperTotal={recycledPaperTotal}
        />
      </div>
    </>
  );
};