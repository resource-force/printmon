import React from "react";
import RollupCounter from "./RollupCounter";

import styles from "./Stats.module.scss";
import paperToTrees from "../trees";

function Counter({ num, unit }: { num: number; unit: string }) {
  return (
    <>
      <span className={styles.counter__odometer}>
        <RollupCounter num={num} />
      </span>
      <span className={styles.counter__unit}>{unit}</span>
    </>
  );
}

export default function Stats({
  unrecycledPaperTotal,
  recycledPaperTotal,
  days
}: {
  unrecycledPaperTotal: number;
  recycledPaperTotal: number;
  days: number;
}) {
  const treesKilled = paperToTrees(unrecycledPaperTotal, recycledPaperTotal);
  let woodUsed =
    (unrecycledPaperTotal / 1000) * 0.02 + (recycledPaperTotal / 1000) * 0.014;
  let amountOfEnergyWasted =
    (unrecycledPaperTotal / 1000) * 0.1 + (recycledPaperTotal / 1000) * 0.08;
  let amountOfGHGEmitted =
    (unrecycledPaperTotal / 1000) * 89.9 + (recycledPaperTotal / 1000) * 74.3;
  let amountOfWaterUsed =
    (unrecycledPaperTotal / 1000) * 107 + (recycledPaperTotal / 1000) * 104;
  let amountOfSolidWaste =
    (unrecycledPaperTotal / 1000) * 5.9 + (recycledPaperTotal / 1000) * 5.8;

  return (
    <section>
      <h2>Environmental Impact</h2>
      <p>
        Paper usage contributes to several environmental impacts. See the
        impacts here, calculated live from values provided by the{" "}
        <a href="https://c.environmentalpaper.org/">
          Environmental Paper Network
        </a>
        .
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: "2em"
        }}
      >
        Over the course of <strong>{days}</strong> days, we used...
      </p>
      <ul className={styles.statsList}>
        <li>
          <Counter
            num={unrecycledPaperTotal + recycledPaperTotal}
            unit="whole sheets of paper"
          />
        </li>
        <li>
          <Counter num={treesKilled} unit="trees" />
        </li>
        <li>
          <Counter num={amountOfGHGEmitted} unit="pounds of CO2" />
        </li>
        <li>
          <Counter num={woodUsed} unit="short tons of wood" />
        </li>
        <li>
          <Counter num={amountOfEnergyWasted} unit="BTUs of energy" />
        </li>
        <li>
          <Counter num={amountOfWaterUsed} unit="gallons of water" />
        </li>
        <li>
          <Counter num={amountOfSolidWaste} unit="pounds of solid waste" />
        </li>
      </ul>
    </section>
  );
}
