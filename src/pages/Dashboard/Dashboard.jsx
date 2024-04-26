import "./Dashboard.css";

import { useEmployeeList, useEmployee } from "../../handkey-module/state";

function Dashboard() {
  const list = useEmployeeList();
  //console.debug(list);
  const e = useEmployee("124");
  console.debug(e);

  return (
    <main>
      <div>Dashboard</div>
    </main>
  );
}

export default Dashboard;
