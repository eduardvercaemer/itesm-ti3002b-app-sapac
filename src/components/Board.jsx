import React, { useState, useEffect } from "react";
import "./Board.css";
import Swal from "sweetalert2";
import Incidence from "./incidence";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {
  useResetEntries,
  useResetEmployees,
  useResetDates,
} from "../handkey-module/state";
import { useNavigate } from "react-router-dom";

//Diccionario con el tipo de incidencias
const incidencias = {
  "": { backgroundColor: "#ccc", label: "Indefinido" },
  f: { backgroundColor: "#ff3b30", label: "Falta" },
  de: { backgroundColor: "#ffcc00", label: "Día económico" },
  vac: { backgroundColor: "#ffcc00", label: "Vacaciones" },
  perm: { backgroundColor: "#ff2d54", label: "Permuta" },
  inc: { backgroundColor: "#007bff", label: "Incapacidad" },
  je: { backgroundColor: "#00c7be", label: "Justificación entrada" },
  js: { backgroundColor: "#00c7be", label: "Justificación salida" },
  lcgs: { backgroundColor: "#55bef0", label: "Lic. con goce de sueldo" },
  r: { backgroundColor: "#ff9500", label: "Retardo" },
  ok: { backgroundColor: "#34c759", label: "Correcto" },
  lsgs: { backgroundColor: "#55bef0", label: "Lic. sin goce de sueldo" },
  ono: { backgroundColor: "#af52de", label: "Onomástico" },
  rl: { backgroundColor: "#ff9500", label: "Retardo Leve" },
  rg: { backgroundColor: "#ff9500", label: "Retardo Grave" },
  ps: { backgroundColor: "#00c7be", label: "Permiso Sindical" },
  fs: { backgroundColor: "#8e8e93", label: "Falta Salida" },
  fe: { backgroundColor: "#8e8e93", label: "Falta Entrada" },
  d: { backgroundColor: "#ffcc00", label: "Descanso" },
};

const options = [
  "Falta",
  "Día económico",
  "Vacaciones",
  "Permuta",
  "Incapacidad",
  "Lic. con goce de sueldo",
  "Lic. sin goce de sueldo",
  "Descanso",
  "Justificación entrada",
  "Justificación salida",
  "Onomástico",
  "Retardo",
  "Retardo leve",
  "Retardo grave",
  "Correcto",
  "Permiso sindical",
  "Falta entrada",
  "Falta salida",
];

// Componente para renderizar una fila de la tabla
function TableRow({ user, onEdit }) {
  // Obtener el estilo y la etiqueta de la incidencia actual
  const { backgroundColor, label } = incidencias[user.incidencia] || {
    backgroundColor: "#ccc",
    label: "Indefinido",
  };

  return (
    <tr>
      <td>{user.fecha}</td>
      <td>{user.entrada}</td>
      <td>{user.salida}</td>
      <td>
        <p
          className="incidenciay"
          style={backgroundColor ? { backgroundColor } : {}}
        >
          {label || user.incidencia}
        </p>
      </td>
      <td>{user.observaciones}</td>
      <td>
        <button
          className="button"
          onClick={() =>
            onEdit(user.unformattedDate, user.incidencia, user.observaciones)
          }
        >
          Editar
        </button>
      </td>
    </tr>
  );
}

function Board({ objeto, date_from, date_to, currEmployeeId, boardType }) {
  const navigate = useNavigate();
  const resetEntries = useResetEntries();
  const resetEmployees = useResetEmployees();
  const resetDates = useResetDates();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentIncidence, setCurrentIncidence] = useState(null);
  const [currentObservation, setCurrentObservation] = useState(null);
  const [delaysWithObservation, setDelaysWithObservation] = useState([]);
  const [delays, setDelays] = useState([]);

  useEffect(() => {
    const tempDelays = objeto.reduce((acc, entry) => {
      if (entry.incidencia === "r") {
        acc.push(entry.unformattedDate);
      }
      return acc;
    }, []);

    const tempDelaysWithObservation = objeto.reduce((acc, entry) => {
      if (entry.incidencia === "r" && entry.observaciones === 0.25) {
        acc.push(entry.unformattedDate);
      }
      return acc;
    }, []);

    setDelays(tempDelays);
    setDelaysWithObservation(tempDelaysWithObservation);
  }, [objeto]);

  const handleEdit = (date, incidence, observations) => {
    setSelectedDate(date);
    setCurrentIncidence(incidence);
    setCurrentObservation(observations);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleResetClick = () => {
    Swal.fire({
      title: "Advertencia",
      text: "Estás a punto de eliminar todo tu progreso. Si procedes, tendrás que empezar desde cero. ¿Estás seguro de que deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("currIndex");
        resetDates();
        resetEntries();
        resetEmployees();
        navigate("/");
      }
    });
  };

  //Obtner un aray con las labels del objeto incidencias
  const labels = Object.values(incidencias).map(
    (incidencia) => incidencia.label,
  );

  return (
    <>
      <div className="periodo">
        {boardType === "dashboard" ? (
          <h1>
            Período{" "}
            {`${date_from.getUTCDate()}/${date_from.getUTCMonth() + 1}/${date_from.getUTCFullYear()} - ${date_to.getUTCDate()}/${date_to.getUTCMonth() + 1}/${date_to.getUTCFullYear()}`}
          </h1>
        ) : (
          <h1>
            Períodooo{" "}
            {`${date_from.getUTCDate()}/${date_from.getUTCMonth() + 1}/${date_from.getUTCFullYear()} - ${date_to.getUTCDate()}/${date_to.getUTCMonth() + 1}/${date_to.getUTCFullYear()}`}
          </h1>
        )}

        <div className="deleteButton" onClick={handleResetClick}>
          <FontAwesomeIcon icon={faTrashCan} />
        </div>
      </div>
      <div className="one">
        <table className="cont">
          <thead className="navbar">
            <tr>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Incidencia</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="navbar">
            {objeto.map((user, i) => (
              <TableRow key={i} user={user} onEdit={handleEdit} />
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Incidence
          onClose={handleCloseModal}
          currEmployeeId={currEmployeeId}
          currDate={selectedDate}
          currIncidence={currentIncidence}
          options={options}
          currObservation={currentObservation}
          delays={delays}
          delaysWithObservation={delaysWithObservation}
        />
      )}
    </>
  );
}

export default Board;
