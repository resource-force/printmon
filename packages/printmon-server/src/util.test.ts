import { sanitizeDateForLaserwatch } from "./util";

it("sanitizes date", () => {
  const sanitized = sanitizeDateForLaserwatch("2019-09-15T04:00:00-05:00");
  expect(sanitized.isUTC()).toBe(true);
  expect(sanitized.hours()).toBe(0);
});
