import React, { useEffect, useState } from "react";
import "./incidence.css";
import { useCreateIncidence, useEditIncidence } from "../handkey-module/state";

export const Incidence = ({
  onClose,
  options,
  currEmployeeId,
  currDate,
  currIncidence,
}) => {
  const createIncidence = useCreateIncidence();
  const editIncidence = useEditIncidence();

  const [selectedOption, setSelectedOption] = useState("");

  const optionToId = {
    "Retardo": "r",
    "Falta": "f",
    "Día Económico": "de",
    "Vacaciones": "vac",
    "Permuta": "perm",
    "Incapacidad": "inc",
    "Justificación Entrada": "je",
    "Justificación salida": "js",
    "Retardo Leve": "rl",
    "Retardo Grave": "rg",
    "Correcto": "ok",
    "Permiso Sindical": "ps",
    "Falta Entrada": "fe",
    "Falta Salida": "fs",
    "Descanso": "d",
    "Lic. con goce de sueldo": "lcgs",
    "Lic. sin goce de sueldo": "lsgs",
    "Onomástico": "ono",
  };

  const idToOption = {
    "r": "Retardo",
    "f": "Falta",
    "de": "Día Económico",
    "vac": "Vacaciones",
    "perm": "Permuta",
    "inc": "Incapacidad",
    "je": "Justificación Entrada",
    "js": "Justificación salida",
    "rl": "Retardo Leve",
    "rg": "Retardo Grave",
    "ok": "Correcto",
    "ps": "Permiso Sindical",
    "fe": "Falta Entrada",
    "fs": "Falta Salida",
    "d": "Descanso",
    "lcgs": "Lic. con goce de sueldo",
    "lsgs": "Lic. sin goce de sueldo",
    'ono': "Onomástico",
  };

  useEffect(() => {
    setSelectedOption(idToOption[currIncidence]);
  }, [currIncidence]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSave = () => {
    if (selectedOption) {
      if (currIncidence === "") {
        createIncidence(currEmployeeId, currDate, optionToId[selectedOption]);
      } else {
        editIncidence(
          currEmployeeId,
          currDate.getTime(),
          optionToId[selectedOption],
        );
      }
      onClose();
    } else {
      alert("Por favor, selecciona una opción antes de guardar.");
    }
  };

  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <div className="topContent">
          <div className="containerIncidencia">
            <h1>Incidencia</h1>
          </div>
          {/* Movemos el botón X al lado izquierdo del título Incidencia */}
          <button className="crossButton" onClick={handleCloseModal}>
            <span className="font-bold text-xl">X</span>
          </button>
        </div>

        <div className="optionContainer">
          {options.map((option, index) => (
            <div key={index} className="marginOptions">
              <label htmlFor={option} className="labelMap">
                <input
                  className="incidenceOption"
                  type="radio"
                  id={option}
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                <span className="incidenceText">{option}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="containerIncidencia">
          <button className="saveButton" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Incidence;
