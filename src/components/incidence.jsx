import React, { useEffect, useState } from "react";
import "./incidence.css";
import {
  useCreateIncidence,
  useEditIncidence,
  useCreateObservation,
  useEditObservation,
} from "../handkey-module/state";

const penalties = {
  rl: 0.25,
  rg: 0.5,
  lsgs: "lsgs",
  f: "f",
  fe: "fe",
  fs: "fs"
};

const calculateNumToHave = (delays) => Math.floor((delays.length - 1) / 3);

const checkForDelays = (
  currIncidence,
  currObservation,
  currEmployeeId,
  delays,
  delaysWithObservation,
  editObservation,
) => {
  if (currIncidence === "r") {
    const numToHave = calculateNumToHave(delays);
    if (currObservation === "") {
      if (numToHave !== delaysWithObservation.length) {
        editObservation(currEmployeeId, delaysWithObservation[0].getTime(), "");
      }
    } else {
      if (numToHave !== delaysWithObservation.length - 1) {
        let observationToChange =
          delays.find(
            (day) =>
              !delaysWithObservation.some(
                (obsDay) => obsDay.toISOString() === day.toISOString(),
              ),
          ) || delays[0];
        editObservation(currEmployeeId, observationToChange.getTime(), 0.25);
      }
    }
  }
};

const handleObservationCreationOrEdit = (
  currObservation,
  currEmployeeId,
  currDate,
  value,
  createObservation,
  editObservation,
) => {
  if (currObservation === null) {
    createObservation(currEmployeeId, currDate, value);
  } else {
    editObservation(currEmployeeId, currDate.getTime(), value);
  }
};

const automatedObservations = (
  currIncidence,
  selectedIncidence,
  currObservation,
  currEmployeeId,
  currDate,
  delays,
  delaysWithObservation,
  createObservation,
  editObservation,
) => {
  if (selectedIncidence in penalties) {
    handleObservationCreationOrEdit(
      currObservation,
      currEmployeeId,
      currDate,
      penalties[selectedIncidence],
      createObservation,
      editObservation,
    );
  } else if (selectedIncidence === "r") {
    const value = (delays.length + 1) % 3 === 0 ? 0.25 : "";
    handleObservationCreationOrEdit(
      currObservation,
      currEmployeeId,
      currDate,
      value,
      createObservation,
      editObservation,
    );
  } else if (currObservation !== null) {
    editObservation(currEmployeeId, currDate.getTime(), "");
  }
  checkForDelays(
    currIncidence,
    currObservation,
    currEmployeeId,
    delays,
    delaysWithObservation,
    editObservation,
  );
};

export const Incidence = ({
  onClose,
  options,
  currEmployeeId,
  currDate,
  currIncidence,
  currObservation,
  delays,
  delaysWithObservation,
}) => {
  const createIncidence = useCreateIncidence();
  const editIncidence = useEditIncidence();
  const createObservation = useCreateObservation();
  const editObservation = useEditObservation();

  const [selectedOption, setSelectedOption] = useState("");

  const optionToId = {
    Retardo: "r",
    Falta: "f",
    "Día económico": "de",
    Vacaciones: "vac",
    "Permuta": "perm",
    Incapacidad: "inc",
    "Justificación entrada": "je",
    "Justificación salida": "js",
    "Retardo leve": "rl",
    "Retardo grave": "rg",
    Correcto: "ok",
    "Permiso sindical": "ps",
    "Falta entrada": "fe",
    "Falta salida": "fs",
    Descanso: "d",
    "Lic. con goce de sueldo": "lcgs",
    "Lic. sin goce de sueldo": "lsgs",
    Onomástico: "ono",
  };

  const idToOption = {
    r: "Retardo",
    f: "Falta",
    de: "Día económico",
    vac: "Vacaciones",
    perm: "Permuta",
    inc: "Incapacidad",
    je: "Justificación entrada",
    js: "Justificación salida",
    rl: "Retardo leve",
    rg: "Retardo grave",
    ok: "Correcto",
    ps: "Permiso sindical",
    fe: "Falta entrada",
    fs: "Falta salida",
    d: "Descanso",
    lcgs: "Lic. con goce de sueldo",
    lsgs: "Lic. sin goce de sueldo",
    ono: "Onomástico",
  };

  useEffect(() => {
    setSelectedOption(idToOption[currIncidence]);
  }, [currIncidence]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSave = () => {
    console.log(selectedOption);
    if (selectedOption) {
      const selectedIncidence = optionToId[selectedOption];
      if (currIncidence === "") {
        createIncidence(currEmployeeId, currDate, selectedIncidence);
      } else {
        editIncidence(currEmployeeId, currDate.getTime(), selectedIncidence);
      }

      automatedObservations(
        currIncidence,
        selectedIncidence,
        currObservation,
        currEmployeeId,
        currDate,
        delays,
        delaysWithObservation,
        createObservation,
        editObservation,
      );

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
