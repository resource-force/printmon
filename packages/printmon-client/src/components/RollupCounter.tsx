import React, { useState, useEffect } from "react";

//@ts-ignore
import useOdometer from "use-odometer";
import "odometer/themes/odometer-theme-car.css";

export default function RollupCounter({ num }: { num: number }) {
  const targetRef = React.useRef(null);
  // Roll up the number from zero on initial mount, have it update as num
  // changes as well.
  const [cur, setCur] = useState(0);
  useEffect(() => {
    setCur(num);
  }, [num]);
  useOdometer(targetRef, cur);

  return <span ref={targetRef} />;
}
