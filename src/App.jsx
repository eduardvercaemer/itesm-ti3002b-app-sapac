import { useEffect } from "react";

import { useData, useSetFile } from "./handkey-module/state.js";
import { FileDrop } from "./components/file-drop.jsx";
import { FileUploaded } from "./components/file-uploaded.jsx";
import { ExportCsv } from "./components/export.jsx";

import "./App.css";

function App() {
  const setFile = useSetFile();
  const data = useData();

  useEffect(() => console.debug(data), [data]);

  return (
    <main className="blue-square">

      <div className="title-container">
        <h1 className="title">Sube tus archivos de Excel</h1>
      </div>

      <div className="container">

        <div className="file-drop-container">
          <h2 className="file-drop-title">Plantilla Incidentes</h2>
          <FileDrop onFileDrop={setFile}/>
          <input type="file" onChange={(e) => {
            setFile(e.target.files[0])
          }} />
        </div>

        <div className="file-drop-container">
          <h2 className="file-drop-title">Archivo Handkey</h2>
          <FileDrop onFileDrop={setFile}/>
        </div>
      </div>

      <div className="bottom-container">
        <button className="bottom-btn">Iniciar</button>
        <a className="bottom-preview">Previsualizar</a>
        <ExportCsv />
      </div>

    </main>
  );
}

export default App;
