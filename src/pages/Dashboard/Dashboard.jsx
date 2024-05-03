import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../../components/Board";
import formatEntries from '../../handkey-module/formatEntries'; 

import {
  useEmployeeList,
  useEmployee,
} from "../../handkey-module/state";
import Swal from "sweetalert2";

import "./Dashboard.css";

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours < 10 ? "0" + hours : hours}:${mins < 10 ? "0" + mins : mins}`;
}

function Dashboard() {
  const navigate = useNavigate();
  const employees = useEmployeeList();
  const date_from = new Date(
    parseInt(localStorage.getItem("state/start-date"), 10),
  );
  const date_to = new Date(
    parseInt(localStorage.getItem("state/end-date"), 10),
  );
  const [currIndex, setCurrIndex] = useState(
    localStorage.getItem("currIndex") !== null
      ? parseInt(localStorage.getItem("currIndex"))
      : 0
  );

  const [comesFromPreview, setComesFromPreview] = useState(
    localStorage.getItem("comesFromPreview") !== null
      ? localStorage.getItem("comesFromPreview")
      : false
  )

  const currEmployee = useEmployee(employees[currIndex]);
  const currEntries = useMemo(
    () => formatEntries(currEmployee),
    [currEmployee],
  );

  const currEmployeeId = useMemo(() => employees[currIndex], [currIndex]);

  useEffect(() => {
    setTimeout(() => currEmployee?.inferIncidences(), 0);
  }, [currEmployee]);

  const handleBackClick = () => {
    localStorage.setItem("currIndex", currIndex - 1);
    setCurrIndex(currIndex - 1);
  };

  const handleNextClick = () => {
    localStorage.setItem("currIndex", currIndex + 1);
    setCurrIndex(currIndex + 1);
  };

  const handleExportClick = () => {
    navigate("/preview");
  };

  const handleSweetAlertClick = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Confirmas tu decisión de exportar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Exportar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleExportClick();
      }
    });
  };

  const handleGoBackToPrev = () =>{
    localStorage.setItem("comesFromPreview", false);
    navigate("/preview");

  }


  if (!currEmployee || !currEmployee.employee) return <div>Cargando...</div>;

  return (
    <div className="h-screen w-screen flex flex-col py-10">
      <div className="grow flex gap-14 px-14 overflow-hidden">
        <div className="cardPerson">
          <img className='sapacLogo' src="/sapac-logo.png" />
          <div className="employee-id">
            <span className="label-id">Número de empleado:</span>
            <br /> {currEmployeeId ? currEmployeeId : employees[currIndex]}
          </div>
          <div className="employee-name">
            <span className="label">Nombre:</span> {currEmployee.employee.name}
          </div>
          <div className="employee-address">
            <span className="label">Dirección:</span>{" "}
            {currEmployee.employee.address}
          </div>
          <div className="employee-kind">
            <span className="label">Tipo:</span> {currEmployee.employee.kind}
          </div>
          <div className="schedule-time">
            <span className="label">Horario: </span>
            <span>
              {formatTime(currEmployee.employee.schedule.start)} -{" "}
              {formatTime(currEmployee.employee.schedule.end)}
            </span>
          </div>
        </div>

        <div className="grow overflow-hidden flex flex-col gap-4">
          <div className="grow overflow-scroll">
            <div className="cardTable">
              <Board
                objeto={currEntries}
                currEmployeeId={currEmployeeId}
                date_from={date_from}
                date_to={date_to}
                boardType={'dashboard'}
              />
            </div>
          </div>
          <div className="button-container">
            {currIndex > 0 && !comesFromPreview ? (
              <button className="button left-button" onClick={handleBackClick}>
                Anterior
              </button>
            ) : (
              <button className="button left-button disabled" disabled>
                Anterior
              </button>
            )}
            { comesFromPreview? (
              <button className="button right-button" onClick={handleGoBackToPrev}>
                Regresar a previsualización
              </button>
            ) :
            (
                currIndex < employees.length - 1 ? (
                  <button className="button right-button" onClick={handleNextClick}>
                    Siguiente
                  </button>
                ) : (
                  <button
                    className="button right-ex-button"
                    onClick={handleSweetAlertClick}
                  >
                    Exportar
                  </button>
                )
            )
            
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
