import React from "react";
import "./Employee.css";

function Employee() {
  return (
    <>
      <main className="employee-container">
        <div className="cardPerson">
          <h2>Información del Empleado 1</h2>
          <p>Contenido de la primera card del empleado</p>
        </div>
        <div className="cardTable">
          <h2>Información del Empleado 2</h2>
          <p>Contenido de la segunda card del empleado</p>
        </div>
      </main>
      <div className="button-container">
        <button className="button left-button">Botón Izquierdo</button>
        <button className="button right-button">Botón Derecho</button>
      </div>
    </>
  );
}

export default Employee;
