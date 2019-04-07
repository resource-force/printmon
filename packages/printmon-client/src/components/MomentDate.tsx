import React from "react";
import { Moment } from "moment";

export default function MomentDate({ date }: { date: Moment }) {
  return (
    <time dateTime={date.toISOString()}>
      {date.toDate().toLocaleDateString()}
    </time>
  );
}
