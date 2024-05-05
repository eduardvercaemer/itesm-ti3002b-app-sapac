const formatEntries = (employee) => {
  const formattedEntries = [];

  if (employee && employee.days) {
    employee.days.forEach((day) => {
      const entryDay = day.date.getUTCDate();
      const entryMonth = day.date.getUTCMonth() + 1;
      const entryYear = day.date.getUTCFullYear();
      const formattedDate = `${entryDay}-${entryMonth}-${entryYear}`;

      let entry = "";
      let exit = "";

      if (day.entries[0]) {
        const entryDate = new Date(day.entries[0]);
        const entryHours = entryDate.getUTCHours();
        const entryMinutes = "0" + entryDate.getUTCMinutes();
        entry = entryHours + ":" + entryMinutes.slice(-2);
      }
      if (day.entries[1]) {
        const exitDate = new Date(day.entries[1]);
        const exitHours = exitDate.getUTCHours();
        const exitMinutes = "0" + exitDate.getUTCMinutes();
        exit = exitHours + ":" + exitMinutes.slice(-2);
      }

      formattedEntries.push({
        fecha: formattedDate,
        entrada: entry,
        salida: exit,
        incidencia: day.incidence ? day.incidence : "",
        observaciones: day.observation,
        unformattedDate: day.date,
      });
    });
  }

  return formattedEntries;
};

export default formatEntries;
