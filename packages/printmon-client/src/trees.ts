const UNRECYCLED_SHEETS_PER_TREE = 8300;
const THIRTY_PCT_RECYCLED_SHEETS_PER_TREE = 8300 / 0.7;

export default function paperToTrees(unrecycled: number, recycled: number) {
  return Math.round(
    unrecycled / UNRECYCLED_SHEETS_PER_TREE -
      recycled / THIRTY_PCT_RECYCLED_SHEETS_PER_TREE
  );
}
