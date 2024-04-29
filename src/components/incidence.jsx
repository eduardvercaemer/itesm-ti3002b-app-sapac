import React, { useState } from 'react';
import './incidence.css';

export const Incidence = ({ onClose, options }) => {
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

  const handleSave = () => {
    if (selectedOption) {
      console.log('Opción seleccionada:', selectedOption);
      onClose();
    } else {
      alert('Por favor, selecciona una opción antes de guardar.');
    }
  };

  const handleCloseModal = () => {
    // Llama a la función onClose para cerrar el modal
    onClose();
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="modalContent bg-white rounded-lg p-6 w-[300px] h-[370px]">
        {/* Contenido del modal */}
        <div className="flex justify-between mb-4">
          <div className='container'>
            <h1>Incidencia</h1>
          </div>
          {/* Botón de cierre del modal */}
          <button className="crossButton" onClick={handleCloseModal}>
            <span className="font-bold">X</span>
          </button>
        </div>
        <div className='container'>
          <h3>Razón de Incidencia</h3>
        </div>
            
            {/* Opciones de selección */}
            <div className='optionContainer'>
              <div className="mb-4">
                {options.map((option, index) => (
                  <div key={index} className='mb-2'>
                    <label htmlFor={option} className='inline-flex items-center'>
                      <input
                      className='incidenceOption'
                      type="radio"
                      id={option}
                      value={option}
                      checked={selectedOption === option}
                      onChange={handleOptionChange}
                      />
                      <span className='incidenceText'>{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Botón de guardar */}
            <div className='container'>
              <button className="saveButton" onClick={handleSave}>
                Guardar
              </button>
            </div>
            
          </div>
        </div>
      );
}

export default Incidence;