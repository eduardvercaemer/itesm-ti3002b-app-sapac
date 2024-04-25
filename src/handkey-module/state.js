import {
  atom,
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import Papa from "papaparse";
import trigramSimilarity from "trigram-similarity";

import { cleanupAlgorithm } from "./cleanup-algorithm.js";
import { useCallback, useEffect } from "react";

const startDateState$ = atom({
  key: "startDateState",
  default: null,
});

const endDateState$ = atom({
  key: "endDateState",
  default: null,
});

const employees$ = atom({
  key: "employees",
  default: new Map(),
});

const entries$ = atom({
  key: "entries",
  default: new Map(),
});

const employeeQuery$ = atom({
  key: "employee-query",
  default: null,
});

const employeeSelector$ = selectorFamily({
  key: "employee-selector",
  get:
    (id) =>
    ({ get }) => {
      const employees = get(employees$);
      const entries = get(entries$);

      const employee = employees.get(id);
      if (!employee) {
        return null;
      }

      // TODO: further process entries by filtering with employee schedule

      return {
        employee,
        entries: entries.get(id),
      };
    },
});

const employeeQueryResultsSelector$ = selector({
  key: "employee-query-results-selector",
  get: ({ get }) => {
    let query = get(employeeQuery$);
    const employees = get(employees$);

    if (!query) {
      return null;
    }

    query = query.toLowerCase();
    const results = [];
    for (const [id, e] of employees.entries()) {
      const name = e.name.toLowerCase();
      const sim = trigramSimilarity(name, query);

      if (sim >= 0.42) {
        results.push(id);
      }
    }

    return results;
  },
});

const employeeListSelector$ = selector({
  key: "employee-list-selector",
  get: ({ get }) => {
    const employees = get(employees$);
    return Array.from(employees.keys());
  },
});

export const useEmployee = (id) => {
  return useRecoilValue(employeeSelector$(id));
};

export const useEmployeeList = () => {
  return useRecoilValue(employeeListSelector$);
};

export const useSetEmployeesFile = () => {
  const setEmployees = useSetRecoilState(employees$);
  return useCallback((file, callback) => {
    console.debug("loading employee data from", file);

    const newEmployees = new Map();

    const complete = () => {
      setEmployees(newEmployees);
      if (callback) {
        callback();
      }
    };

    Papa.parse(file, {
      complete,
      header: true,
      step({ data }) {
        // TODO: this is not robust enough for excel file headers...
        const id = data["CLAVE"];
        const address = data["DIRECCION"];
        const schedule = data["HORARIO"];
        const kind = data["TIPO DE PLAZA"];
        const name = data["NOMBRE"];

        const match = /(\d\d?):(\d\d?) A (\d\d?):(\d\d?)/.exec(schedule);
        if (!match) {
          return;
        }

        const [_, startH, startM, endH, endM] = match;

        if (newEmployees.has(id)) {
          console.warn("found duplicate employee", id);
          return;
        }

        newEmployees.set(id, {
          address,
          schedule: {
            start: parseInt(startH) * 60 + parseInt(startM),
            end: parseInt(endH) * 60 + parseInt(endM),
          },
          kind,
          name,
        });
      },
    });
  }, []);
};

export const useSetEntriesFile = () => {
  const setEntries = useSetRecoilState(entries$);
  return useCallback((file, callback) => {
    console.debug("loading entries from", file);

    const newEntries = new Map();

    const complete = () => {
      newEntries.forEach((value) => {
        // for entries 10 minutes apart, remove them
        value.entries = cleanupAlgorithm(value.originalEntries, 10 * 60 * 1000);
      });

      setEntries(newEntries);

      if (callback) {
        callback();
      }
    };

    Papa.parse(file, {
      complete,
      header: true,
      step({ data }) {
        // entry example: "07/03/2024 08:07:10 a. m."
        let timestamp;
        const [id, _, entry] = Object.values(data);
        const match =
          /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) .+$/.exec(entry);
        if (match) {
          const [, day, month, year, hour, min, sec] = match;
          timestamp = new Date(
            `${year}-${month}-${day}T${hour}:${min}:${sec}Z`,
          ).getTime();
        }

        if (!newEntries.has(id)) {
          newEntries.set(id, {
            originalEntries: timestamp ? [timestamp] : [],
          });
        } else if (timestamp) {
          newEntries.get(id).originalEntries.push(timestamp);
        }
      },
    });
  }, []);
};

export const useSetEmployeeQuery = () => {
  return useSetRecoilState(employeeQuery$);
};

export const useEmployeeQueryResults = () => {
  return useRecoilValue(employeeQueryResultsSelector$);
};

export const useStartDate = () => {
  return useRecoilValue(startDateState$);
};

export const useSetStartDate = () => {
  return useSetRecoilState(startDateState$);
};

export const useSetEndDate = () => {
  return useSetRecoilState(endDateState$);
};

export const useEndDate = () => {
  return useRecoilValue(endDateState$);
};

export const useHasEntries = () => {
  const entries = useRecoilValue(entries$);
  return entries.size > 0;
};

const STORAGE_KEY = "state";

const useLocalStorage = (name, value, setter, sed, des, should) => {
  const key = `${STORAGE_KEY}/${name}`;

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (!stored) return;

    console.debug(`loading ${name} from cache`);
    setter(des(stored));
  }, []);

  useEffect(() => {
    if (!should(value)) return;

    console.debug(`storing ${name} in cache`);
    localStorage.setItem(key, sed(value));
  }, [value]);
};

export const useInitFromLocalStorage = () => {
  const [employees, setEmployees] = useRecoilState(employees$);
  const [entries, setEntries] = useRecoilState(entries$);
  const [startDate, setStartDate] = useRecoilState(startDateState$);
  const [endDate, setEndDate] = useRecoilState(endDateState$);

  const sedMap = (m) => JSON.stringify(Array.from(m.entries()));
  const desMap = (m) => new Map(JSON.parse(m));
  const sedDate = (m) => m.getTime();
  const desDate = (m) => new Date(JSON.parse(m));

  useLocalStorage(
    "employees",
    employees,
    setEmployees,
    sedMap,
    desMap,
    (m) => m.size > 0,
  );
  useLocalStorage(
    "entries",
    entries,
    setEntries,
    sedMap,
    desMap,
    (m) => m.size > 0,
  );
  useLocalStorage(
    "start-date",
    startDate,
    setStartDate,
    sedDate,
    desDate,
    (m) => m !== null,
  );
  useLocalStorage(
    "end-date",
    endDate,
    setEndDate,
    sedDate,
    desDate,
    (m) => m !== null,
  );
};

export const useResetEntries = () => {
  const setEntries = useSetRecoilState(entries$);
  localStorage.removeItem("state/entries");
  return useCallback(() => {
    const newEntries = new Map();
    setEntries(newEntries);
  })
}

export const useResetEmployees = () => {
  const setEmployees = useSetRecoilState(employees$);
  localStorage.removeItem("state/employees");
  return useCallback(() => {
    const newEmployees = new Map();
    setEmployees(newEmployees);
  })
}

export const useHasDateRange = () => {
  const startDate = useRecoilValue(startDateState$);
  const endDate = useRecoilValue(endDateState$);
  return startDate !== null && endDate !== null;
};