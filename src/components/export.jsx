import { useCallback, useMemo } from "react";
import Papa from "papaparse";

const df = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  dateStyle: "short",
  timeStyle: "short",
  hourCycle: "h24",
});

export function ExportCsv() {
  const rows = useMemo(() => {
    //if (!data.entries) {
    //  return null;
    //}
    //return Array.from(data.entries).flatMap(employeeToRows);
  }, []);

  const onClick = useCallback(() => {
    if (!rows) {
      return;
    }

    const csv = Papa.unparse({
      fields: ["ID", "Nombre", "Tiempo"],
      data: rows,
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.setAttribute("href", url);
    anchor.setAttribute("download", "handkey-limpio.csv");
    anchor.setAttribute("style", "display:none");
    document.body.appendChild(anchor);
    anchor.click();
  }, [rows]);

  return <button onClick={onClick}>export csv</button>;
}

function employeeToRows([key, value]) {
  return value.entries.map((e) => [key, value.name, df.format(new Date(e))]);
}
