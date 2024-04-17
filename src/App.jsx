import { useEffect, useState } from "react";

import { useData, useSetFile } from "./handkey-module/state.js";
import { FileDrop } from "./components/file-drop.jsx";
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
          <FileDrop
            className="file-drop"
            onFileDrop={setFile}
          >
            <img
              className="subir-a-la-nube"
              src="../public/subir-a-la-nube.png"
              alt="subir-a-la-nube"
            />
            <p className="text-gray-400">Arrastra y suelta aquí</p>
            <p className="text-gray-400 mb-1">o</p>
            <button className="button-select-file">Seleccionar archivo</button>
          </FileDrop>

          <input type="file" onChange={(e) => {
            setFile(e.target.files[0])
          }} />
        </div>

        <div className="file-drop-container">
          <h2 className="file-drop-title">Archivo Handkey</h2>
          <FileDrop
            className="file-drop"
            onFileDrop={setFile}
          >
            <img
              className="subir-a-la-nube"
              src="../public/subir-a-la-nube.png"
              alt="subir-a-la-nube"
            />
            <p className="text-gray-400">Arrastra y suelta aquí</p>
            <p className="text-gray-400 mb-1">o</p>
            <button className="button-select-file">Seleccionar archivo</button>
          </FileDrop>
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
