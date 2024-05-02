import "./Preview.css";
import PreviewTable from "../../components/preview-table";
import testingData from "../../../testing-array";
import { ExportCsv } from "../../components/export.jsx";

function Preview() {
  return (
    <main>
      <PreviewTable data={testingData} />
      <ExportCsv/>
    </main>
  );
}

export default Preview;
