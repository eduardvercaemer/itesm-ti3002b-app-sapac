import "./Preview.css";
import PreviewTable from "../../components/preview-table";
import testingData from "../../../testing-array";

function Preview() {
    return(
        <main>
            <PreviewTable data={testingData}/>
        </main>
    )
}

export default Preview;