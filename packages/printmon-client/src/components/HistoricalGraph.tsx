import React, { useEffect, useState } from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from "recharts";
import moment from "moment";

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
      <LineChart
        width={1000}
        height={700}
        data={totalArray}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="total" stroke="#82ca9d" />
      </LineChart>
      <p>Total: {total}</p>
    </>
  );
};
