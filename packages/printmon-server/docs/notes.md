- Rest API calls take UTC times (GMT technically.)
- Uses the following data sets to calculate delta values:
  - The meter from _just before_ the start date
  - The meter from _just before_ the end date
- Delta values are calculated from the _previous meter not on the same day_, so you can't just sum up deltas and get the total units output, because sometimes there are multiple meters on each day.

As of 2019-09-20, most of the inaccuracies with respect to LaserWatch should be gone. There are still a few seen:

1. HS-103-HP3035, https://laserwatch2.com/app/#!devices/cdbb15ac-742a-2241-7999-a1299a96d6f5/metric/default: This is because partially on 2019-04-04 there was a count of 177,463, delta 14, but on 2019-04-08 there was 177,463, delta 2. Which makes no sense. The data must be incorrect that LaserWatch is tallying here; we are more conservative and fix the delta value.
2. HS-FS-RIC8200-A: Printmon gives ~218K from 2019-07-01 to 2019-09-20, but LaserWatch Advanced Volume Report reports 137181. Interestingly, the Metric View screen (https://laserwatch2.com/app/#!/devices/3f172b07-e821-4e3a-9154-209d038ec7e7/metric/default) is much closer to 218k. Inaccuracy in LaserWatch?
