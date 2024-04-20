import React from 'react'
import Board from './Board'

import "./Dashboard.css";

const users = [
    {
        fecha: "20-10-2024",
        entrada: "8:00",
        salida: "16:00",
        tiempo: "Tiempo",
        incidencia: "POP",
        observaciones: "NA",
        acciones: "Editar"
    },
    {
        fecha: "11-11-2024",
        entrada: "8:03",
        salida: "16:03",
        tiempo: "Tiempo",
        incidencia: "POP",
        observaciones: "NA",
        acciones: "Editar"
    },
    {
        fecha: "10-10-2024",
        entrada: "8:06",
        salida: "16:06",
        tiempo: "Tiempo",
        incidencia: "POP",
        observaciones: "NA",
        acciones: "Editar"
    },
    {
        fecha: "21-11-2024",
        entrada: "8:09",
        salida: "16:09",
        tiempo: "Tiempo",
        incidencia: "POP",
        observaciones: "NA",
        acciones: "Editar"
    },
]


function Dashboard() {
    return (
        <div className='dashboard'>
            <div className='persona'>Persona</div>
            <Board objeto={users} />
        </div>
    )
}

export default Dashboard;   