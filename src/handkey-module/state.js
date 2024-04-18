import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Papa from "papaparse";

import { cleanupAlgorithm } from "./cleanup-algorithm.js";
import { useEffect } from "react";

const employees$ = atom({
  key: 'employees',
  default: new Map(),
});

const entries$ = atom({
  key: 'entries',
  default: new Map(),
});

const employeesFile$ = atom({
  key: 'employees-file',
  default: null,
});

const entriesFile$ = atom({
  key: 'entries-file',
  default: null,
});

export const useData = () => {
  const [employeesFile, setEmployeesFile] = useRecoilState(employeesFile$);
  const [entriesFile, setEntriesFile] = useRecoilState(entriesFile$);
  const [employees, setEmployees] = useRecoilState(employees$);
  const [entries, setEntries] = useRecoilState(entries$);

  useEffect(() => {
    if (!entriesFile) {
      return;
    }

    console.debug('loading entries from', entriesFile);

    const newEntries = new Map();

    const complete = () => {
      entries.forEach((value) => {
        // for entries 10 minutes apart, remove them
        value.entries = cleanupAlgorithm(
          value.originalEntries,
          10 * 60 * 1000,
        );
      });

      setEntries(newEntries);
    };

    Papa.parse(entriesFile, {
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

        if (!newEntries.has(id)) {
          newEntries.set(id, {
            name,
            originalEntries: timestamp ? [timestamp] : [],
          });
        } else if (timestamp) {
          newEntries.get(id).originalEntries.push(timestamp);
        }
      },
    });
  }, [entriesFile]);

  return {
    setEmployeesFile,
    setEntriesFile,
    employees,
    entries,
  }
};


