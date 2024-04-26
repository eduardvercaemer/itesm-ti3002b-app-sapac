import "./Dashboard.css";

import {
  useCreateIncidence,
  useEmployeeList,
  useEmployee,
} from "../../handkey-module/state";

function Dashboard() {
  const createIncidence = useCreateIncidence();
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
        click me
      </button>
    </main>
  );
}

export default Dashboard;
