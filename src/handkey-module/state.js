import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import Papa from "papaparse";

import { cleanupAlgorithm } from "./cleanup-algorithm.js";

/**
 * Uploaded file.
 * @type {import("recoil").RecoilState<File>}
 */
const file$ = atom({
  key: "file",
  default: null,
});

/**
 * Generated data from file.
 * @type {import("recoil").RecoilValueReadOnly}
 */
const data$ = selector({
  key: "data",
  get: ({ get }) => {
    const file = get(file$);
    if (!file) {
      return null;
    }

    return new Promise((resolve) => {
      const employees = new Map();
      const complete = () => {
        employees.forEach((value) => {
          // for entries 10 minutes apart, remove them
          value.entries = cleanupAlgorithm(
            value.originalEntries,
            10 * 60 * 1000,
          );
        });

        resolve({ employees });
      };

      Papa.parse(file, {
        complete,
        header: true,
        step({ data }) {
          // entry example: "07/03/2024 08:07:10 a. m."
          let timestamp;
          const [id, name, entry] = Object.values(data);
          const match =
            /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) .+$/.exec(
              entry,
            );
          if (match) {
            const [, day, month, year, hour, min, sec] = match;
            timestamp = new Date(
              `${year}-${month}-${day}T${hour}:${min}:${sec}Z`,
            ).getTime();
          }

          if (!employees.has(id)) {
            employees.set(id, {
              name,
              originalEntries: timestamp ? [timestamp] : [],
            });
          } else if (timestamp) {
            employees.get(id).originalEntries.push(timestamp);
          }
        },
      });
    });
  },
});

export const useSetFile = () => useSetRecoilState(file$);

export const useData = () => useRecoilValue(data$);
