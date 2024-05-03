import React from 'react';
import "./InputSelect.css";

const InputSelect = ({ selectedOption, onChange, label }) => {
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
                <option value="" disabled>Selecciona una opción</option>
                <option value="OPERACIÓN">OPERACIÓN</option>
                <option value="COMERCIAL">COMERCIAL</option>
                <option value="SANEAMIENTO Y CALIDAD DEL AGUA">SANEAMIENTO Y CALIDAD DEL AGUA</option>
                <option value="OPERACIÓN">OPERACIÓN</option>
                <option value="TÉCNICA">TÉCNICA</option>
                <option value="ADMINISTRACIÓN Y FINANZAS">ADMINISTRACIÓN Y FINANZAS</option>
                <option value="UNIDAD DE COMUNICACIÓN, GESTION SOCIAL Y CULTURA AMBIENTAL">UNIDAD DE COMUNICACIÓN, GESTION SOCIAL Y CULTURA AMBIENTAL</option>
                <option value="JURIDICA">JURIDICA</option>
                <option value="GENERAL">GENERAL</option>
            </select>
        </div>
    );
};

export default InputSelect;
