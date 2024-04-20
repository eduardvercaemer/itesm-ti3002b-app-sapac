import { useEffect, useMemo, useState } from "react";

import { FileDrop } from "./components/file-drop.jsx";
import { FileUploaded } from "./components/file-uploaded.jsx";
import { ExportCsv } from "./components/export.jsx";

import "./App.css";
import { useEmployee, useEmployeeList, useSetEmployeesFile, useSetEntriesFile } from "./handkey-module/state.js";
import { Link, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const id = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get('id');
  }, [location]);

  const [incidenceUploaded, setIncidenceUploaded] = useState(false);
  const [handkeyUploaded, setHandkeyUploaded] = useState(false);

  const setEmployeesFile = useSetEmployeesFile();
  const setEntriesFile = useSetEntriesFile();

  const employees = useEmployeeList();
  const employee = useEmployee(id);

  const handleEmployeesFileDrop = (file) => {
    // Lógica para subir el archivo y actualizar el estado
    setEmployeesFile(file, () => setIncidenceUploaded(true));
  };

  const handleEntriesFileDrop = (file) => {
    // Lógica para subir el archivo de entradas (si es necesario)
    setEntriesFile(file, () => setHandkeyUploaded(true));
  };

  return (
    <main className="blue-square">

      <p>
        {JSON.stringify(employee)}
      </p>

      <div className="title-container">
        <h1 className="title">Sube tus archivos de Excel</h1>
      </div>

      <div className="container">

        <div className="file-drop-container">
          <h2 className="file-drop-title">Plantilla Incidentes</h2>

          {/* Si se subio el archivo muestra FileUploaded, caso contrario FileDrop */}
          {incidenceUploaded ? (
            <FileUploaded />
          ) : (
            <FileDrop onFileDrop={handleEmployeesFileDrop} />
          )}

        </div>

        <div className="file-drop-container">
          <h2 className="file-drop-title">Archivo Handkey</h2>

          {/* Si se subio el archivo muestra FileUploaded, caso contrario FileDrop */}
          {handkeyUploaded ? (
            <FileUploaded />
          ) : (
            <FileDrop onFileDrop={handleEntriesFileDrop} />
          )}
        </div>

      </div>

      <div className="bottom-container">
        <button className="bottom-btn">Iniciar</button>
        <a className="bottom-preview">Previsualizar</a>
        <ExportCsv />
      </div>

      <menu>
        {employees.map(id => <li><Link to={`/?id=${id}`}>{id}</Link></li>)}
      </menu>

    </main>
  );
}

export default App;
