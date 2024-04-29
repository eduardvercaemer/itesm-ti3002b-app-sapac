import React, { useState } from 'react';
import './Modal-incidencia.css'; // Asegúrate de crear este archivo y agregar los estilos necesarios

function ModalIncidencia({show, onClose, options}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const optionToId = {
    'Retardo': 'r',
    'Falta': 'f',
    'Día Económico': 'de',
    'Vacaciones': 'vac',
    'Permuta': 'perm',
    'Incapacidad': 'inc',
    'Justificación Entrada': 'je',
    'Justificación salida': 'js',
    'Retardo Leve': 'rl',
    'Retardo Grave': 'rg',
    'Correcto': 'ok',
    'Justificación': 'j',
    'Falta Entrada': 'fe',
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = () => {
    console.log(optionToId[selectedOption]); // Imprime el ID correspondiente a la opción seleccionada
    onClose();
  };

  if (!show) {
    return null;
  }
  
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Modal de incidencia</h2>
        </div>
        <div className="modal-options">
          {options.map((option, index) => (
            <div key={index} className="option">
              <label htmlFor={option}>{option}</label>
              <input 
                type="radio"
                id={option}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button onClick={handleButtonClick}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalIncidencia;