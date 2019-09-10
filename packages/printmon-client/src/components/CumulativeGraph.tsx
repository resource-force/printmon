import React from "react";

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line
} from "recharts";
import moment from "moment";

const formatter = new Intl.NumberFormat("en-US");

function formatNumbersWithCommas(n: any) {
  if (typeof n !== "number") {
    throw new Error("Invalid number input");
  }
  return formatter.format(n);
}

export default function CumulativeGraph({
  data
}: {
  data: { [date: string]: number };
}) {
  const transposed = [];
  let total = 0;
  for (const date in data) {
    total += data[date];
    transposed.push({
      date: moment(date).format("L"),
      "Cumulative Physical Sheets": total
    });
  }

  return (
    <>
      <h2>Cumulative Sheets</h2>
      <div style={{ width: "750px", margin: "0 auto" }}>
        <LineChart
          width={750}
          height={750}
          data={transposed}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray={null} />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={formatNumbersWithCommas} />
          <Tooltip formatter={formatNumbersWithCommas} />
          <Line
            dot={false}
            type="monotone"
            dataKey="Cumulative Physical Sheets"
            stroke="#82ca9d"
          />
        </LineChart>
      </div>
    </>
  );
}
