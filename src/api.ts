import { PrintRecord } from "./store";

export async function getPreviousCounts() {
  return JSON.stringify(await PrintRecord.findAll());
}