import moment from "moment";

export function sanitizeDateForLaserwatch(dateString: string) {
  return moment.utc(dateString).startOf("days");
}
