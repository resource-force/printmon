import React from "react";

import styles from "./TreeDisplay.module.scss";
const tree = require("../../images/tree.png");

const UNRECYCLED_SHEETS_PER_TREE = 8300;
const THIRTY_PCT_RECYCLED_SHEETS_PER_TREE = 8300 / 0.7;
const MAX_TREES = 300;

export default function TreeDisplay({
  unrecycledPaperTotal,
  recycledPaperTotal
}: {
  unrecycledPaperTotal: number;
  recycledPaperTotal: number;
}) {
  const treesRemaining = Math.round(
    300 -
      unrecycledPaperTotal / UNRECYCLED_SHEETS_PER_TREE -
      recycledPaperTotal / THIRTY_PCT_RECYCLED_SHEETS_PER_TREE
  );
  return (
    <div>
      <p>
        Of this forest of {MAX_TREES} trees, we have cut down{" "}
        {MAX_TREES - treesRemaining} trees.
      </p>
      <div className={styles.treeDisplay}>
        {[...Array(treesRemaining).keys()].map(() => {
          const variance = Math.random() * 50;
          return (
            <div
              style={{
                marginLeft: `-${variance + 75}px`,
                marginTop: `${variance}px`,
                marginBottom: "-75px"
              }}
            >
              <img src={tree} height="200" width="200" alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
