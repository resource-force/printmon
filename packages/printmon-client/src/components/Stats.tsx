import React from "react";
import RollupCounter from "./RollupCounter";

import styles from "./Stats.module.scss";

export default function Stats({ total }: { total: number }) {
  return (
    <div>
      <ul className={styles.statsList}>
        <li>
          <RollupCounter num={total} unit="sheets" subUnit="this year" />
        </li>
      </ul>
      <p>
        <em>
          Calculations by the{" "}
          <a href="https://c.environmentalpaper.org/">
            Environmental Paper Network
          </a>
        </em>
      </p>
    </div>
  );
}
