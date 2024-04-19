import { useEffect } from "react";

import { FileDrop } from "./components/file-drop.jsx";
import { ExportCsv } from "./components/export.jsx";

import "./App.css";
import { useEmployee, useSetEmployeesFile, useSetEntriesFile } from "./handkey-module/state.js";

function App() {
  const setEmployeesFile = useSetEmployeesFile();
  const setEntriesFile = useSetEntriesFile();
  const employee = useEmployee('124');

  useEffect(() => console.debug({ employee }), [employee]);

  return (
    <main className="blue-square">

      <h1 className="title">Sube tus archivos de Excel</h1>

      <div className="container">

        <div className="file-drop-container">
          <h2 className="file-drop-title">Plantilla Incidentes</h2>
          <FileDrop
            className="file-drop"
            onFileDrop={setEmployeesFile}
          >
            <img
              className="w-16 h-16 opacity-50"
              src="../public/subir-a-la-nube.png"
              alt="subir-a-la-nube"
            />
            <p className="text-gray-400">Arrastra y suelta aquí</p>
            <p className="text-gray-400 mb-1">o</p>
            <button className="mx-auto bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded w-48">Seleccionar archivo</button>
          </FileDrop>

          <input type="file" onChange={(e) => {
            setEmployeesFile(e.target.files[0])
          }} />
        </div>

        <div className="file-drop-container">
          <h2 className="file-drop-title">Archivo Handkey</h2>
          <FileDrop
            className="file-drop-upload"
            onFileDrop={setEntriesFile}
          >
            <div class="loader"></div>
            <p className="text-white font-bold">Suelta el archivo</p>
          </FileDrop>
          <input type="file" onChange={(e) => {
            setEntriesFile(e.target.files[0])
          }} />
        </div>
      </div>

      <div className="flex flex-col justify-center mt-12">
        <button className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48">Iniciar</button>
        <a className="flex justify-center underline my-4 hover:text-blue-700 cursor-pointer">Previsualizar</a>
        <ExportCsv />
      </div>

    </main>
  );
}

export default App;
