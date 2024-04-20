import { atom, selector, selectorFamily, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Papa from "papaparse";

import { cleanupAlgorithm } from "./cleanup-algorithm.js";
import { useCallback, useEffect } from "react";

const employees$ = atom({
  key: 'employees',
  default: new Map(),
});

const entries$ = atom({
  key: 'entries',
  default: new Map(),
});

const employeeSelector$ = selectorFamily({
  key: 'employee-selector',
  get: id => ({ get }) => {
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
  }
})

const employeeListSelector$ = selector({
  key: 'employee-list-selector',
  get: ({ get }) => {
    const employees = get(employees$);
    return Array.from(employees.keys());
  }
})

export const useEmployee = (id) => {
  return useRecoilValue(employeeSelector$(id))
}

export const useEmployeeList = () => {
  return useRecoilValue(employeeListSelector$);
}

export const useSetEmployeesFile = () => {
  const setEmployees = useSetRecoilState(employees$);
  return useCallback((file, callback) => {
    console.debug('loading employee data from', file);

    const newEmployees = new Map();

    const complete = () => {
      setEmployees(newEmployees);
      if(callback) {
        callback();
      }
    }

    Papa.parse(file, {
      complete,
      header: true,
      step({ data }) {
        // TODO: this is not robust enough for excel file headers...
        const id = data['CLAVE'];
        const address = data['DIRECCION']
        const schedule = data['HORARIO']
        const kind = data['TIPO DE PLAZA']
        const name = data['NOMBRE']

        const match = /(\d\d?):(\d\d?) A (\d\d?):(\d\d?)/.exec(schedule);
        if (!match) {
          return;
        }

        const [_, startH, startM, endH, endM] = match;


        if (newEmployees.has(id)) {
          console.warn('found duplicate employee', id);
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
        })
      },
    })
  }, []);
}

export const useSetEntriesFile = () => {
  const setEntries = useSetRecoilState(entries$);
  return useCallback((file, callback) => {
    console.debug('loading entries from', file);

    const newEntries = new Map();

    const complete = () => {
      newEntries.forEach((value) => {
        // for entries 10 minutes apart, remove them
        value.entries = cleanupAlgorithm(
          value.originalEntries,
          10 * 60 * 1000,
        );
      });

      setEntries(newEntries);

      if(callback) {
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
            originalEntries: timestamp ? [timestamp] : [],
          });
        } else if (timestamp) {
          newEntries.get(id).originalEntries.push(timestamp);
        }
      },
    });
  }, []);
}

