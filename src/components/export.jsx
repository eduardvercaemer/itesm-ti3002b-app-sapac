import { useCallback, useMemo } from "react";
import Papa from 'papaparse';

import { useData } from "../handkey-module/state";

const df = new Intl.DateTimeFormat('es-MX', {
  timeZone: "America/Mexico_City",
  dateStyle: "short",
  timeStyle: "short",
});

export function ExportCsv() {
  const data = useData();
  const rows = useMemo(() => {
    if (!data) {
      return null;
    }

    return Array.from(data).flatMap(employeeToRows);
  }, [data])

  const onClick = useCallback(() => {
    if (!rows) {
      return;
    }

    const csv = Papa.unparse({
      fields: ['ID', 'Nombre', 'Tiempo'],
      data: rows,
    });


    console.log(csv);
  }, [rows]);
  return <button onClick={onClick}>export csv</button>
}

function employeeToRows([key, value]) {
  return value.entries.map(e => [key, value.name, df.format(new Date(e))]);
}
