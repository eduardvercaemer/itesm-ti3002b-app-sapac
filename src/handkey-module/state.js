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
    ({ get, getCallback }) => {
      const employees = get(employees$);
      const entries = get(entries$);
      const start = get(startDateState$);
      const end = get(endDateState$);

      const employee = employees.get(id);
      if (!employee) {
        return null;
      }

      const employeeEntries = entries.get(id)?.entries ?? [];

      let days = null;

      const { start: es_start, end: es_end } = employee.schedule ?? {};

      let getEntries;
      if (es_start !== undefined && es_end !== undefined) {
        getEntries = (ts /* day timestamp */) => {
          const startTs = ts + es_start * 60 * 1000;
          const endTs = ts + (es_end === 0 ? 24 : es_end) * 60 * 1000;
          const limit = 1000 * 60 * 60 * 3;

          const startEntry =
            employeeEntries
              .filter((i) => {
                return i >= startTs - limit && i <= startTs + limit;
              })
              .sort((i) => Math.abs(startTs - i))[0] ?? null;

          const endEntry =
            employeeEntries
              .filter((i) => i >= endTs - limit && i <= endTs + limit)
              .sort((i) => Math.abs(endTs - i))[0] ?? null;

          return [startEntry, endEntry];
        };
      } else {
        // default get entries selects all entries in that day
        getEntries = (ts /* day timestamp */) =>
          employeeEntries.filter(
            (i) => i >= ts && i < ts + 1000 * 60 * 60 * 24,
          );
      }

      if (start !== null && end !== null) {
        const numberOfDays =
          1 + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        days = Array.from({ length: numberOfDays }, (_, i) => ({
          date: new Date(start.getTime() + i * 1000 * 60 * 60 * 24),
        }));

        for (const day of days) {
          const ts = day.date.getTime();
          day.incidence =
            employee.incidences.filter(
              (i) => i.date >= ts && i.date < ts + 1000 * 60 * 60 * 24,
            )[0]?.value ?? null;
          day.observation =
            employee.observations.filter(
              (i) => i.date >= ts && i.date < ts + 1000 * 60 * 60 * 24,
            )[0]?.value ?? null;
          day.entries = getEntries(ts);
        }
      }

      const inferIncidences = getCallback(({ set }) => () => {
        if (days === null) {
          return;
        }

        if (employee.inferred) {
          return;
        }

        const setEmployees = (...args) => set(employees$, ...args);

        updateEmployee(setEmployees, id, (e) => {
          e.inferred = true;
          return e;
        });
        for (const day of days) {
          if (day.entries.filter(Boolean).length === 0) {
            updateEmployee(setEmployees, id, (e) => {
              e.incidences = [
                ...e.incidences,
                { value: "f", date: day.date.getTime() },
              ];
              e.observations = [
                ...e.observations,
                { value: "f", date: day.date.getTime() },
              ];
              return e;
            });
          } else if (!day.entries[0]) {
            updateEmployee(setEmployees, id, (e) => {
              e.incidences = [
                ...e.incidences,
                { value: "fe", date: day.date.getTime() },
              ];
              e.observations = [
                ...e.observations,
                { value: "fe", date: day.date.getTime() },
              ];
              return e;
            });
          } else if (!day.entries[1]) {
            updateEmployee(setEmployees, id, (e) => {
              e.incidences = [
                ...e.incidences,
                { value: "fs", date: day.date.getTime() },
              ];
              e.observations = [
                ...e.observations,
                { value: "fs", date: day.date.getTime() },
              ];
              return e;
            });
          } else {
            updateEmployee(setEmployees, id, (e) => {
              e.incidences = [
                ...e.incidences,
                { value: "ok", date: day.date.getTime() },
              ];
              return e;
            });
          }
        }
      });

      // TODO: further process entries by filtering with employee schedule

      return {
        employee,
        entries: entries.get(id),
        days,
        inferIncidences,
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

const allEmployeesDataSelectorExport$ = selector({
  key: "all-employees-data-selector-export",
  get: ({ get }) => {
    const employeeIds = get(employeeListSelector$);
    const employees = get(employees$);
    const start = get(startDateState$);
    const end = get(endDateState$);

    const result = [];

    employeeIds.forEach((id) => {
      const employee = employees.get(id);
      if (!employee) return;

      const addressIndex = result.findIndex(
        (item) =>
          item.address.replace(/\s/g, "") ===
          employee.address.replace(/\s/g, ""),
      );

      //Get days
      let days = null;
      const incidences = [];
      const observations = [];

      if (start !== null && end !== null) {
        const numberOfDays =
          1 + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        days = Array.from({ length: numberOfDays }, (_, i) => ({
          date: new Date(start.getTime() + i * 1000 * 60 * 60 * 24),
        }));

        for (const day of days) {
          const ts = day.date.getTime();
          incidences.push(
            employee.incidences.filter(
              (i) => i.date >= ts && i.date < ts + 1000 * 60 * 60 * 24,
            )[0]?.value ?? null,
          );
          observations.push(
            employee.observations.filter(
              (i) => i.date >= ts && i.date < ts + 1000 * 60 * 60 * 24,
            )[0]?.value ?? null,
          );
        }
      }

      let observationsNumber = 0.0;
      const obervationString = {
        lsgs: 0,
        f: 0,
        fe: 0,
        fs: 0,
      }
    
      observations.forEach( element =>{
        if(element !== null && element !== ""){
          if(typeof element === 'number'){
            observationsNumber += element;
          }
          else{
            obervationString[element] = obervationString[element] += 1;
          }
        }
      })

      let observationsFormatted = observationsNumber > 0.0 ? `${observationsNumber} ` : "";
    
      observationsFormatted += obervationString.lsgs > 0 ? `${obervationString.lsgs}-lsgs ` : "";
      observationsFormatted += obervationString.f > 0 ? `${obervationString.f}-f ` : "";
      observationsFormatted += obervationString.fe > 0 ? `${obervationString.fe}-fe ` : "";
      observationsFormatted += obervationString.fs > 0 ? `${obervationString.fs}-fs ` : "";

      const employeeFormatted = {
        id: id,
        name: employee.name,
        incidences: incidences,
        observations: observationsFormatted,
      };

      if (addressIndex > -1) {
        result[addressIndex].employees.push(employeeFormatted);
      } else {
        result.push({
          address: employee.address,
          employees: [employeeFormatted],
        });
      }
    });

    return result;
  },
});

const allEmployeesDataSelectorPreview$ = selector({
  key: "all-employees-data-selector-preview",
  get: ({ get }) => {
    const employeeIds = get(employeeListSelector$);
    const employees = get(employees$);
    const start = get(startDateState$);
    const end = get(endDateState$);

    const result = {
      addresses: [],
      employees: [],
    };

    employeeIds.forEach((id, index) => {
      const employee = employees.get(id);
      if (!employee) return;

      const addressIndex = result.addresses.findIndex(
        (item) =>
          item.replace(/\s/g, "") === employee.address.replace(/\s/g, ""),
      );

      //Get days
      let days = null;
      const incidences = [];
      const observations = [];

      if (start !== null && end !== null) {
        const numberOfDays =
          1 + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        days = Array.from({ length: numberOfDays }, (_, i) => ({
          date: new Date(start.getTime() + i * 1000 * 60 * 60 * 24),
        }));

        for (const day of days) {
          const ts = day.date.getTime();
          incidences.push(
            employee.incidences.filter(
              (i) => i.date >= ts && i.date < ts + 1000 * 60 * 60 * 24,
            )[0]?.value ?? null,
          );
          observations.push(
            employee.observations.filter(
              (i) => i.date >= ts && i.date < ts + 1000 * 60 * 60 * 24,
            )[0]?.value ?? null,
          );
        }
      }

      let observationsNumber = 0.0;
      const obervationString = {
        lsgs: 0,
        f: 0,
        fe: 0,
        fs: 0,
      }
    
      observations.forEach( element =>{
        if(element !== null && element !== ""){
          if(typeof element === 'number'){
            observationsNumber += element;
          }
          else{
            obervationString[element] = obervationString[element] += 1;
          }
        }
      })

      let observationsFormatted = observationsNumber > 0.0 ? `${observationsNumber} ` : "";
    
      observationsFormatted += obervationString.lsgs > 0 ? `${obervationString.lsgs}-lsgs ` : "";
      observationsFormatted += obervationString.f > 0 ? `${obervationString.f}-f ` : "";
      observationsFormatted += obervationString.fe > 0 ? `${obervationString.fe}-fe ` : "";
      observationsFormatted += obervationString.fs > 0 ? `${obervationString.fs}-fs ` : "";

      const employeeFormatted = {
        id: id,
        name: employee.name,
        address: employee.address,
        incidences: incidences,
        observations: observationsFormatted,
        index: index,
      };

      if (addressIndex === -1) {
        result.addresses.push(employee.address);
      }
      result.employees.push(employeeFormatted);
    });

    return result;
  },
});

export const useEmployee = (id) => {
  return useRecoilValue(employeeSelector$(id));
};

export const useEmployeeList = () => {
  return useRecoilValue(employeeListSelector$);
};

export const useAllDataForExport = () => {
  const startDate = useRecoilValue(startDateState$);
  const endDate = useRecoilValue(endDateState$);
  const allEmployeeData = useRecoilValue(allEmployeesDataSelectorExport$);

  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const formattedDays = [];

  let currentDate = new Date(start);
  while (currentDate <= end) {
    formattedDays.push(
      `${currentDate.getUTCDate()}/${currentDate.getUTCMonth() + 1}/${currentDate.getUTCFullYear()}`,
    );
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  const timeFrame = `${start.getUTCDate()}/${start.getUTCMonth() + 1}/${start.getUTCFullYear()} AL ${end.getUTCDate()}/${end.getUTCMonth() + 1}/${end.getUTCFullYear()}`;

  const addresses = [];

  allEmployeeData.forEach((e) => {
    addresses.push(e.address);
  });

  return {
    timeFrame,
    days: formattedDays,
    data: allEmployeeData,
    addresses,
  };
};

export const useAllDataForPreview = () => {
  const startDate = useRecoilValue(startDateState$);
  const endDate = useRecoilValue(endDateState$);
  const allEmployeeData = useRecoilValue(allEmployeesDataSelectorPreview$);

  if (!startDate || !endDate) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const formattedDays = [];

  let currentDate = new Date(start);
  while (currentDate <= end) {
    formattedDays.push(
      `${currentDate.getUTCDate()}/${currentDate.getUTCMonth() + 1}/${currentDate.getUTCFullYear() - 2000}`,
    );
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  const timeFrame = `${start.getUTCDate()}/${start.getUTCMonth() + 1}/${start.getUTCFullYear()} AL ${end.getUTCDate()}/${end.getUTCMonth() + 1}/${end.getUTCFullYear()}`;

  return {
    timeFrame,
    days: formattedDays,
    addresses: allEmployeeData.addresses,
    data: allEmployeeData.employees,
  };
};

export const useSetEmployeesFile = () => {
  const setEmployees = useSetRecoilState(employees$);
  return useCallback((file, callback) => {
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
        const rawSchedule = data["HORARIO"];
        const kind = data["TIPO DE PLAZA"];
        const name = data["NOMBRE"];

        const match = /(\d\d?):(\d\d?) A (\d\d?):(\d\d?)/.exec(rawSchedule);
        let schedule = null;
        if (match) {
          const [_, startH, startM, endH, endM] = match;
          schedule = {
            start: parseInt(startH) * 60 + parseInt(startM),
            end: parseInt(endH) * 60 + parseInt(endM),
          };
        }

        if (newEmployees.has(id)) {
          console.warn("found duplicate employee", id);
          return;
        }

        newEmployees.set(id, {
          address,
          schedule,
          kind,
          name,
          incidences: [],
          observations: [],
        });
      },
    });
  }, []);
};

export const useSetEntriesFile = () => {
  const setEntries = useSetRecoilState(entries$);
  return useCallback((file, callback) => {
    const newEntries = new Map();

    const complete = () => {
      newEntries.forEach((value) => {
        // for entries 10 minutes apart, remove them
        value.entries = cleanupAlgorithm(value.originalEntries, 10 * 60 * 1000);
        delete value.originalEntries;
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
          /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) ([ap]).*$/.exec(
            entry,
          );
        if (match) {
          const [, day, month, year, hour, min, sec, half] = match;
          const realHour = parseInt(hour) + (half === "p" ? 12 : 0);
          const dateString = `${year}-${month}-${day}T${("0" + realHour).slice(-2)}:${min}:${sec}Z`;
          const date = new Date(dateString);
          timestamp = date.getTime();
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

    setter(des(stored));
  }, []);

  useEffect(() => {
    if (!should(value)) return;

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

export const useResetDates = () => {
  const setStartDate = useSetRecoilState(startDateState$);
  const setEndDate = useSetRecoilState(endDateState$);
  return useCallback(() => {
    const newEntries = new Map();
    localStorage.removeItem("state/start-date");
    localStorage.removeItem("state/end-date");
    setStartDate(null);
    setEndDate(null);
  });
};

export const useResetEntries = () => {
  const setEntries = useSetRecoilState(entries$);
  return useCallback(() => {
    const newEntries = new Map();
    localStorage.removeItem("state/entries");
    setEntries(newEntries);
  });
};

export const useResetEmployees = () => {
  const setEmployees = useSetRecoilState(employees$);
  return useCallback(() => {
    const newEmployees = new Map();
    localStorage.removeItem("state/employees");
    setEmployees(newEmployees);
  });
};

export const useHasDateRange = () => {
  const startDate = useRecoilValue(startDateState$);
  const endDate = useRecoilValue(endDateState$);
  return startDate !== null && endDate !== null;
};

function updateEmployee(setEmployees, id, update) {
  setEmployees((employees) => {
    const newEmployees = new Map(employees);
    const e = { ...newEmployees.get(id) };
    newEmployees.set(id, update(e));
    return newEmployees;
  });
}

export const useCreateIncidence = () => {
  const setEmployees = useSetRecoilState(employees$);

  return useCallback((employeeId, date, incidence) => {
    updateEmployee(setEmployees, employeeId, (e) => {
      e.incidences = [
        ...e.incidences,
        { value: incidence, date: date.getTime() },
      ];
      return e;
    });
  }, []);
};

export const useEditIncidence = () => {
  const setEmployees = useSetRecoilState(employees$);

  return useCallback((employeeId, date, incidence) => {
    updateEmployee(setEmployees, employeeId, (e) => {
      e.incidences = e.incidences.map((i) => {
        if (i.date === date) {
          return { value: incidence, date };
        } else {
          return i;
        }
      });
      return e;
    });
  }, []);
};

export const useDeleteIncidence = () => {
  const setEmployees = useSetRecoilState(employees$);

  return useCallback((employeeId, date, incidence) => {
    updateEmployee(setEmployees, employeeId, (e) => {
      e.incidences = e.incidences.filter((i) => i.date !== date);
      return e;
    });
  }, []);
};

export const useCreateObservation = () => {
  const setEmployees = useSetRecoilState(employees$);

  return useCallback((employeeId, date, observation) => {
    updateEmployee(setEmployees, employeeId, (e) => {
      e.observations = [
        ...e.observations,
        { value: observation, date: date.getTime() },
      ];
      return e;
    });
  }, []);
};

export const useEditObservation = () => {
  const setEmployees = useSetRecoilState(employees$);

  return useCallback((employeeId, date, observation) => {
    updateEmployee(setEmployees, employeeId, (e) => {
      e.observations = e.observations.map((o) => {
        if (o.date === date) {
          return { value: observation, date };
        } else {
          return o;
        }
      });
      return e;
    });
  }, []);
};

export const useDeleteObservation = () => {
  const setEmployees = useSetRecoilState(employees$);

  return useCallback((employeeId, date, observation) => {
    updateEmployee(setEmployees, employeeId, (e) => {
      e.observations = e.observations.filter((o) => o.date !== date);
      return e;
    });
  }, []);
};
