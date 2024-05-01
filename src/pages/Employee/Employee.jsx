import "./Employee.css";
import { useAllDataForExport, useAllDataForPreview } from "../../handkey-module/state";

function Employee() {
  const exportData = useAllDataForExport();
  const previewData = useAllDataForPreview();

  const handleClick = () => {
    console.log(previewData);
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
