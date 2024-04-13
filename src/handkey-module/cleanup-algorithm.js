/**
 * Given array of employee entries (timestamps) return a new array with de-bounced entries
 * @param {number[]} entries
 * @param {number} debounceThreshold
 */
export function cleanupAlgorithm(entries, debounceThreshold) {
  const debouncedEntries = [];
  let last;
  for (const entry of entries) {
    if (!last || entry - last > debounceThreshold) {
      debouncedEntries.push(entry);
    }

    last = entry;
  }

  return debouncedEntries;
}
