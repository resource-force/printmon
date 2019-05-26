import React from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from "recharts";

export default ({ data }: { data: { date: string; total: number }[] }) => {
  return (
    <LineChart
      width={500}
      height={500}
      data={data}
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
      <Legend>Physical Sheets Printed</Legend>
      <Line type="monotone" dataKey="total" stroke="#82ca9d" />
    </LineChart>
  );
};
