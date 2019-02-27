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

export default ({ data }: { data: { [date: string]: number } }) => {
  let totals = [];
  let total = 0;
  for (const date in data) {
    totals.push({
      date,
      total: data[date]
    });
    total += data[date];
  }
  return (
    <>
      <LineChart
        width={1000}
        height={700}
        data={totals}
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
      <h2>Total: {total}</h2>
    </>
  );
};
