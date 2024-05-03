import "./Preview.css";
import PreviewTable from "../../components/preview-table";
import testingData from "../../../testing-array";
import ExportXLSX from "../../components/export.jsx";

function Preview() {
  return (
    <main className="mainContainer">
      <PreviewTable data={testingData} />
      <ExportXLSX/>
    </main>
  );
}

export default Preview;
