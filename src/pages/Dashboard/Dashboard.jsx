import "./Dashboard.css";

import {
  useCreateIncidence,
  useEditIncidence,
  useEmployeeList,
  useEmployee,
} from "../../handkey-module/state";

function Dashboard() {
  const createIncidence = useCreateIncidence();
  const editIncidence = useEditIncidence();
  const list = useEmployeeList();
  //console.debug(list);
  const e = useEmployee("127");
  console.debug(e);

  e?.inferIncidences();

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
