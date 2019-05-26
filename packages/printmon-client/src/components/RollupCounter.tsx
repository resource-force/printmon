import React, { useState, useEffect } from "react";

import styles from "./RollupCounter.module.scss";

//@ts-ignore
import useOdometer from "use-odometer";
import "odometer/themes/odometer-theme-car.css";

export default function RollupCounter({
  num,
  unit,
  subUnit
}: {
  num: number;
  unit: string;
  subUnit: string;
}) {
  const targetRef = React.useRef(null);
  // Roll up the number from zero on initial mount, have it update as num
  // changes as well.
  const [cur, setCur] = useState(0);
  useEffect(() => {
    setCur(num);
  }, [num]);
  useOdometer(targetRef, cur, { theme: "car" });

  return (
    <>
      <span ref={targetRef} />{" "}
      <span className={styles.unit}>
        <span className={styles.primaryUnit}>{unit}</span>
        <span className={styles.subUnit}>{subUnit}</span>
      </span>
    </>
  );
}
