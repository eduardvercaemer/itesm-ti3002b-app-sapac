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
  const e = useEmployee("124");
  console.debug(e);

  return (
    <main>
      <div>Dashboard</div>
      <button
        onClick={() => {
          createIncidence("124", new Date(), { foo: "bar" });
        }}
      >
        click me to add an incidence
      </button>
      <button
        onClick={() => {
          const date = e.employee.incidences[0].date;
          editIncidence("124", date, { foo: "new bar" });
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
