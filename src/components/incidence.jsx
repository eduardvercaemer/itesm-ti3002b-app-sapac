import React, { useEffect, useState } from "react";
import "./incidence.css";
import { useCreateIncidence, useEditIncidence, useCreateObservation, useEditObservation } from "../handkey-module/state";

const penalties = {
  "rl": 0.25,
  "rg": 0.50
}

const checkForDelays = (currIncidence, currObservation, currEmployeeId, delays, delaysWithObservation, editObservation) => {
  if(currIncidence === 'r'){
    if(currObservation === ""){
      const numToHave = Math.floor((delays.length - 1) / 3);
      if(numToHave !== delaysWithObservation.length){
        editObservation(currEmployeeId, delaysWithObservation[0].getTime(), "")
      }
    }
    else{
      const numToHave = Math.floor((delays.length - 1) / 3);
      if(numToHave !== (delaysWithObservation.length - 1)){
        let observationToChange = delays[0];
        delays.every(day => {
          const dayStr = day.toISOString();
          const isNotObserved = !delaysWithObservation.some(obsDay => obsDay.toISOString() === dayStr);
        
          if (isNotObserved) {
            observationToChange = day;
            return false;
          }
          return true;
        });
        editObservation(currEmployeeId, observationToChange.getTime(), 0.25)
      }
    }
  }
}

const automatedObservations = (currIncidence, selectedIncidence, currObservation, currEmployeeId, currDate, delays, delaysWithObservation, createObservation, editObservation) => {
  if(selectedIncidence in penalties){
    if(currObservation === null){
      createObservation(currEmployeeId, currDate, penalties[selectedIncidence])
    }
    else{
      editObservation(currEmployeeId, currDate.getTime(), penalties[selectedIncidence])
    }
  }
  else if(selectedIncidence === 'r'){
    if((delays.length + 1) % 3 === 0){
      if(currObservation === null){
        createObservation(currEmployeeId, currDate, 0.25)
      }
      else{
        editObservation(currEmployeeId, currDate.getTime(), 0.25)
      }
    }
    else{
      if(currObservation === null){
        createObservation(currEmployeeId, currDate, "")
      }
      else{
        editObservation(currEmployeeId, currDate.getTime(), "")
      }
    }
    
  }
  else{
    if(currObservation !== null){
      editObservation(currEmployeeId, currDate.getTime(), "")
    }
    checkForDelays(currIncidence, currObservation, currEmployeeId, delays, delaysWithObservation, editObservation);
  }
}

export const Incidence = ({
  onClose,
  options,
  currEmployeeId,
  currDate,
  currIncidence,
  currObservation,
  delays,
  delaysWithObservation
}) => {
  const createIncidence = useCreateIncidence();
  const editIncidence = useEditIncidence();
  const createObservation = useCreateObservation();
  const editObservation = useEditObservation();

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
      const selectedIncidence = optionToId[selectedOption];
      if (currIncidence === "") {
        createIncidence(currEmployeeId, currDate, selectedIncidence);
      } else {
        editIncidence(
          currEmployeeId,
          currDate.getTime(),
          selectedIncidence,
        );
      }

      automatedObservations(currIncidence, selectedIncidence, currObservation, currEmployeeId, currDate, delays, delaysWithObservation, createObservation, editObservation);

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
