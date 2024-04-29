import React, { useState } from 'react';
import './Modal-incidencia.css'; // Asegúrate de crear este archivo y agregar los estilos necesarios

function ModalIncidencia({show, onClose, options}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
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
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalIncidencia;