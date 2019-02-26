import React, { useEffect } from "react";
import { VictoryPie } from "victory";

export default () => {
  useEffect(() => {
    (async () => {
      const values = await fetch("/api/historical?startDate=2017-01-01");
      console.log(await values.json());
    })();
  }, []);
  return <VictoryPie />;
};
