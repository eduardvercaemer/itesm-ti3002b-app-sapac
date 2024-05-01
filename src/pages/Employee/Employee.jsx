import "./Employee.css";
import { useAllDataForExport } from "../../handkey-module/state";

function Employee() {
  const exportData = useAllDataForExport();

  const handleClick = () => {
    console.log(exportData);
  }

  return (
    <>
      <button onClick={handleClick}>
        Testing
      </button>
    </>
  );
}

export default Employee;
