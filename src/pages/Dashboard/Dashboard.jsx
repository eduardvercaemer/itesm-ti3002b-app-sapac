import "./Dashboard.css";

import {
  useCreateIncidence,
  useEditIncidence,
  useEmployeeList,
  useEmployee,
} from "../../handkey-module/state";

import { useEffect, useState } from "react";

function Dashboard() {
  const createIncidence = useCreateIncidence();
  const editIncidence = useEditIncidence();
  const list = useEmployeeList();
  const e = useEmployee("127");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!e) return;
    if (ready) return;

    console.log("about to infer");
    setReady(true);
    setTimeout(() => e.inferIncidences(), 0);
  }, [e]);

  return (
    <main>
      <div>Dashboard</div>
      <button
        onClick={() => {
          createIncidence("127", new Date(), "r");
        }}
      >
        click me to add an incidence
      </button>
      <button
        onClick={() => {
          const date = e.employee.incidences[0].date;
          editIncidence("127", date, "nr");
        }}
      >
        edit incidence
      </button>
      <pre>
        <code>{JSON.stringify(e, null, 2)}</code>
      </pre>
    </main>
  );
}

export default Dashboard;
