import init from "./store";
import { cwd } from "process";
import { getDeviceTotals } from "./api";
import { sanitizeDateForLaserwatch } from "./util";
import { MeterTypes } from "./laserwatch/types";

beforeAll(async () => {
  await init(cwd());
});

it("October total for one device matches LaserWatch", async () => {
  const totals = await getDeviceTotals(
    // HP Color LaserJet M452dw (10.92.3.237 / 80-CE-62-E4-92-27)
    "76512c4c-bc2d-4ad9-9d8d-6945621a0550",
    MeterTypes.TOTAL_UNITS_OUTPUT,
    sanitizeDateForLaserwatch("2018-10-17"),
    sanitizeDateForLaserwatch("2019-09-15")
  );

  expect(totals.total).toBe(3565);
});

it("October total for another device matches LaserWatch", async () => {
  const totals = await getDeviceTotals(
    // HS-103-HP3035 (10.3.7.190 / 00-1E-0B-1B-CB-61)
    "cdbb15ac-742a-2241-7999-a1299a96d6f5",
    MeterTypes.TOTAL_UNITS_OUTPUT,
    sanitizeDateForLaserwatch("2018-10-17"),
    sanitizeDateForLaserwatch("2019-09-15")
  );

  const x: number[] = [];

  for (const date in totals.daily) {
    x.push(
      totals.daily[date][
        "Impression.AllMeterTypes.AllFunctions.AllSides.AllPageSizes"
      ]
    );
  }

  console.log(JSON.stringify(x));

  expect(totals.total).toBe(1021);
});

it("June total for one device matches LaserWatch", async () => {
  const totals = await getDeviceTotals(
    // HP Color LaserJet M452dw (10.92.3.237 / 80-CE-62-E4-92-27)
    "76512c4c-bc2d-4ad9-9d8d-6945621a0550",
    MeterTypes.TOTAL_UNITS_OUTPUT,
    sanitizeDateForLaserwatch("2019-06-30"),
    sanitizeDateForLaserwatch("2019-09-15")
  );

  expect(totals.total).toBe(291);
});

it("September total for one device matches LaserWatch", async () => {
  const totals = await getDeviceTotals(
    // HP Color LaserJet M452dw (10.92.3.237 / 80-CE-62-E4-92-27)
    "76512c4c-bc2d-4ad9-9d8d-6945621a0550",
    MeterTypes.TOTAL_UNITS_OUTPUT,
    sanitizeDateForLaserwatch("2019-09-01"),
    sanitizeDateForLaserwatch("2019-09-15")
  );

  expect(totals.total).toBe(81);
});
