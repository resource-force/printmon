import React from "react";

import styles from "./TreeDisplay.module.scss";
const tree = require("../../images/tree.png");

export default function TreeDisplay() {
  return (
    <div className={styles.treeDisplay}>
      {[...Array(20).keys()].map(() => {
        const variance = Math.random() * 50;
        return (
          <div
            style={{
              marginLeft: `-${variance + 75}px`,
              marginTop: `${variance}px`,
              marginBottom: "-75px"
            }}
          >
            {/* <Tree /> */}
            <img src={tree} height="200" width="200" alt="" />
          </div>
        );
      })}
    </div>
  );
}
