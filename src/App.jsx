import { useEffect, useMemo, useState } from "react";

import { FileDrop } from "./components/file-drop.jsx";
import { FileUploaded } from "./components/file-uploaded.jsx";
import { ExportCsv } from "./components/export.jsx";

import "./App.css";
import {
  useEmployee,
  useEmployeeList,
  useEmployeeQueryResults,
  useSetEmployeeQuery,
  useSetEmployeesFile,
  useSetEntriesFile,
  useHasEntries,
  useStartDate,
  useEndDate,
  useSetStartDate,
  useSetEndDate,
  useResetEntries,
  useResetEmployees,
} from "./handkey-module/state.js";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function App() {
  const location = useLocation();
  const id = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get("id");
  }, [location]);

  const setEmployeesFile = useSetEmployeesFile();
  const setEntriesFile = useSetEntriesFile();
  const resetEntries = useResetEntries();
  const resetEmployees = useResetEmployees();

  const employees = useEmployeeList();
  const employee = useEmployee(id);
  const hasEntries = useHasEntries();

  const ready = employees.length > 0 && hasEntries;

  const setEmployeeQuery = useSetEmployeeQuery();
  const employeeQueryResults = useEmployeeQueryResults();

  const handleResetEntries = () => {
    resetEntries();
    localStorage.removeItem("state/entries")
  }

  const handleResetEmployees = () => {
    resetEmployees();
    localStorage.removeItem("state/employees");
  }

  // Estados de fechas para el análisis de documentos
  const startDate = useStartDate();
  const endDate = useEndDate();
  const setStartDate = useSetStartDate();
  const setEndDate = useSetEndDate();

  const handleDate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Seleccione las fechas de inicio y fin del análisis",
      html:
        '<input id="start" class="swal2-input" type="date" placeholder="Fecha de inicio">' +
        '<input id="end" class="swal2-input" type="date" placeholder="Fecha de fin">',
      didOpen: () => {
        const startDate = new Date().toISOString().split("T")[0];
        Swal.update({
          preConfirm: () => ({
            start: Swal.getPopup().querySelector("#start").value,
            end: Swal.getPopup().querySelector("#end").value,
          }),
        });
        Swal.getPopup().querySelector("#start").value = startDate;
        Swal.getPopup().querySelector("#end").value = startDate;
      },
      focusConfirm: false,
    });

    if (formValues) {
      const { start, end } = formValues;
      Swal.fire(
        "Fechas seleccionadas:",
        `Inicio: ${formatDate(start)} | Fin: ${formatDate(end)}`,
      );

      setStartDate(new Date(start));
      setEndDate(new Date(end));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00Z`); // Establecer la zona horaria a UTC
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000,
    ); // Ajustar a la zona horaria local
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatDateToUnix = (dateString) => {
    const date = new Date(dateString);
    return date.getTime() / 1000; // dividido por 1000 para obtener segundos en lugar de milisegundos
  };

  return (
    <main className="blue-square">

      <input
        type="search"
        name="search"
        placeholder="search"
        onChange={(e) => {
          e.preventDefault();
          setEmployeeQuery(e.target.value);
        }}
      />

      <p>{JSON.stringify(employeeQueryResults)}</p>

      <div className="title-container">
        <h1 className="title">Sube tus archivos de Excel</h1>
      </div>

      <div className="container">
        <div className="file-drop-container">
          <h2 className="file-drop-title">Plantilla Incidentes</h2>

          {/* Si se subio el archivo muestra FileUploaded, caso contrario FileDrop */}
          {employees.length > 0 ? (
            <FileUploaded deleteFile={handleResetEmployees} />
          ) : (
            <FileDrop onFileDrop={setEmployeesFile} />
          )}
        </div>

        <div className="file-drop-container">
          <h2 className="file-drop-title">Archivo Handkey</h2>

          {/* Si se subio el archivo muestra FileUploaded, caso contrario FileDrop */}
          {hasEntries ? (
            <FileUploaded deleteFile={handleResetEntries} />
          ) : (
            <FileDrop onFileDrop={setEntriesFile} />
          )}
        </div>
      </div>

      <div className="bottom-container">
        <Link
          to={!ready ? "/" : "/dashboard"}
          className="bottom-btn"
          disabled={!ready}
        >
          <button onClick={() => handleDate()} disabled={!ready}>
            Iniciar
          </button>
        </Link>
        <ExportCsv />
      </div>

      <menu>
        {employees.map((id) => (
          <li>
            <Link to={`/?id=${id}`}>{id}</Link>
          </li>
        ))}
      </menu>
    </main>
  );
}

export default App;