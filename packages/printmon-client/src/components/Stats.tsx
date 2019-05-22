import React from "react";

export default function Stats({ total }: { total: number }) {
  return (
    <div>
      <ul>
        <li>Total: {total.toLocaleString()}</li>
        <li />
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
