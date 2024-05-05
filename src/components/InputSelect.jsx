import React from "react";
import "./InputSelect.css";

const InputSelect = ({ selectedOption, onChange, label, options }) => {
  return (
    <div className="select-container">
      <label htmlFor="inputSelect" className="select-label">
        {label || "Selecciona una opción"} {/* Uso del prop de etiqueta */}
      </label>
      <select
        id="inputSelect"
        value={selectedOption}
        onChange={onChange}
        className="select-input"
      >
        <option value="" disabled>
          Ninguna dirección seleccionada
        </option>
        <option value={"SA"}>Todas las direcciones</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputSelect;
