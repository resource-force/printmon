import React from "react";

import styles from "./TreeDisplay.module.scss";
import paperToTrees from "../../trees";
const tree = require("../../images/tree.png");

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
  const treesConsumed = paperToTrees(unrecycledPaperTotal, recycledPaperTotal);
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
          [...Array(Math.min(treesConsumed, 300)).keys()].map(i => (
            <Tree key={i} isStump={true} />
          ))}
        {treesRemaining > 0 &&
          [...Array(treesRemaining).keys()].map(i => (
            <Tree key={i} isStump={false} />
          ))}
      </div>
    </div>
  );
}
