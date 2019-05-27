import React from "react";

import styles from "./TreeDisplay.module.scss";
const tree = require("../../images/tree.png");

const UNRECYCLED_SHEETS_PER_TREE = 8300;
const THIRTY_PCT_RECYCLED_SHEETS_PER_TREE = 8300 / 0.7;
const MAX_TREES = 300;

function Tree({ isStump }: { isStump: boolean }) {
  const variance = Math.random() * 50;
  return (
    <img
      className={isStump ? styles.treeStump : undefined}
      style={{
        display: "inline-block",
        position: "relative",
        left: `-${variance + 75}px`,
        top: `${variance}px`,
        marginBottom: "-75px"
      }}
      src={tree}
      height="50"
      width="50"
      alt=""
    />
  );
}

export default function TreeDisplay({
  unrecycledPaperTotal,
  recycledPaperTotal
}: {
  unrecycledPaperTotal: number;
  recycledPaperTotal: number;
}) {
  const treesConsumed = Math.round(
    unrecycledPaperTotal / UNRECYCLED_SHEETS_PER_TREE -
      recycledPaperTotal / THIRTY_PCT_RECYCLED_SHEETS_PER_TREE
  );
  const treesRemaining = 300 - treesConsumed;

  return (
    <div>
      <p>
        We have used enough paper to cut down {treesConsumed} trees.{" "}
        {treesRemaining > 0 ? (
          <>
            Of this forest of {MAX_TREES} trees, only {treesRemaining} remain.
          </>
        ) : (
          <>
            Of this forest of 300 trees, we have cut down all of them and more.
          </>
        )}
      </p>

      <div className={styles.treeDisplay}>
        {treesConsumed > 0 &&
          [...Array(Math.min(treesConsumed, 300)).keys()].map(() => (
            <Tree isStump={true} />
          ))}
        {treesRemaining > 0 &&
          [...Array(treesRemaining).keys()].map(() => <Tree isStump={false} />)}
      </div>
    </div>
  );
}
