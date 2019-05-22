import React from "react";
import moment from "moment";
import Stats from "./Stats";
import HistoricalGraph from "./HistoricalGraph";
import { Card } from "@blueprintjs/core";

export default ({ data }: { data: { [date: string]: number } }) => {
  let total = 0;
  const monthlyTotals = new Map<string, number>();
  for (const date in data) {
    const roundedDate = moment(date).format("YYYY-MM");
    const oldTotal = monthlyTotals.get(roundedDate) || 0;
    monthlyTotals.set(roundedDate, data[date] + oldTotal);
    total += data[date];
  }

  const totalArray: { date: string; total: number }[] = [];
  for (const [date, total] of monthlyTotals) {
    totalArray.push({ date, total });
  }
  return (
    <>
      <Card>
        <HistoricalGraph data={totalArray} />
      </Card>
      <Stats total={total} />
    </>
  );
};
