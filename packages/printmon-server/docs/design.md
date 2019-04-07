# Design

- Must take into account device additions
- Must be able to re-fetch historical data when new device added

# Data Outline

- fetch_history

  - meter_label
  - last_fetch

- devices

  - id
  - group_id
  - name
  - manufacturer
  - isColor
  - hasImage

- meters
  - FOREIGNKEY device_id
  - type
  - firstReportedAt
  - lastReportedAt
  - count
  - delta

# Update Flow

1. Login to LaserWatch.
2. Fetch the list of devices in the high school group - update local table.
3. MARK: declare last fetch time here
4. If any devices are newly added, for each meter, fetch all their history.
5. For each meter being tracked: fetch history from \$last_fetch onwards for all devices in the high school group.
6. Apply last fetch time update to each meter
