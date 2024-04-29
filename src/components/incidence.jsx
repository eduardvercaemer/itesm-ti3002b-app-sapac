import React, { useState } from 'react';
import './incidence.css';

export const Incidence = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSave = () => {
    if (selectedOption) {
      // Guardar la información del radio button de alguna manera
      console.log('Opción seleccionada:', selectedOption);
      // Cerrar el modal
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
      <div className="bg-white rounded-lg p-6 w-[300px] h-[370px]">
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
            <div className='container'>
            <div className="mb-4">
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input type="radio" name="incidencia" className="incidenceOption" value={"retardo_leve"} onChange={handleOptionChange}/>
                  <span className="incidenceText">Retardo Leve</span>
                </label>
              </div>
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input type="radio" name="retardo_grave" className="incidenceOption" value={"retardo_grave"} onChange={handleOptionChange} />
                  <span className="incidenceText">Retardo Grave</span>
                </label>
              </div>
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input type="radio" name="vacaciones" className="incidenceOption" value={"vacaciones"} onChange={handleOptionChange}/>
                  <span className="incidenceText">Vacaciones</span>
                </label>
              </div>
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input type="radio" name="correcto" className="incidenceOption" value={"correcto"} onChange={handleOptionChange}/>
                  <span className="incidenceText">Correcto</span>
                </label>
              </div>
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