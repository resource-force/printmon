import React from "react";
import RollupCounter from "./RollupCounter";

import styles from "./Stats.module.scss";

export default function Stats({
  unrecycledPaperTotal,
  recycledPaperTotal
}: {
  unrecycledPaperTotal: number;
  recycledPaperTotal: number;
}) {
  let numOfTreesKilled =
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
    <div>
      <ul className={styles.statsList}>
        <li>
          <RollupCounter
            num={unrecycledPaperTotal + recycledPaperTotal}
            unit="whole sheets of paper"
            subUnit="this year"
          />
        </li>
        <li>
          <RollupCounter
            num={numOfTreesKilled}
            unit="short tons of wood"
            subUnit="this year"
          />
        </li>
        <li>
          <RollupCounter
            num={amountOfEnergyWasted}
            unit="BTUS of energy"
            subUnit="this year"
          />
        </li>
        <li>
          <RollupCounter
            num={amountOfGHGEmitted}
            unit="pounds of CO2"
            subUnit="this year"
          />
        </li>
        <li>
          <RollupCounter
            num={amountOfWaterUsed}
            unit="gallons of water"
            subUnit="this year"
          />
        </li>
        <li>
          <RollupCounter
            num={amountOfSolidWaste}
            unit="pounds of solid waste"
            subUnit="this year"
          />
        </li>
      </ul>
      <footer>
        <p>
          <em>
            Calculations by the{" "}
            <a href="https://c.environmentalpaper.org/">
              Environmental Paper Network
            </a>
          </em>
        </p>
      </footer>
    </div>
  );
}
