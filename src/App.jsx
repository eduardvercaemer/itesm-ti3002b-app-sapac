import { useEffect } from "react";

import { useData, useSetFile } from "./handkey-module/state.js";
import { FileDrop } from "./components/file-drop.jsx";

import "./App.css";

function App() {
  const setFile = useSetFile();
  const data = useData();

  useEffect(() => console.debug(data), [data]);

  return (
    <main className="blue-square">

      <h1 className="title">Sube tus archivos de Excel</h1>

      <div className="container">

        <div className="file-drop-container">
          <h2 className="file-drop-title">Plantilla Incidentes</h2>
          <FileDrop
            className="file-drop"
            onFileDrop={setFile}
          >
          </FileDrop>
        </div>

        <div className="file-drop-container">
          <h2 className="file-drop-title">Archivo Handkey</h2>
          <FileDrop
            className="file-drop"
            onFileDrop={setFile}
          >
          </FileDrop>
        </div>
      </div>

      <div className="flex flex-col justify-center mt-12">
        <button className="mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48">Iniciar</button>
        <a className="flex justify-center underline my-4">Previsualizar</a>
      </div>

    </main>
  );
}

export default App;
