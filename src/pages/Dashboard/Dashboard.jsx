import { useState , useEffect } from 'react'
import Board from '../../components/Board'
import { useEmployee, useEmployeeList } from "../../handkey-module/state.js";

import "./Dashboard.css";

const defaultEmployee = {
    employee: {
        address: "",
        kind: "",
        name: "",
        schedule: {
            end: 0,
            start: 480
        }
    },
    entries: undefined
}

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
        incidencia: "ROCK",
        observaciones: "NA",
        acciones: "Editar"
    },
    {
        fecha: "10-10-2024",
        entrada: "8:06",
        salida: "16:06",
        tiempo: "Tiempo",
        incidencia: "R&B",
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
    const employees = useEmployeeList();
    const [ currIndex, setCurrIndex ] = useState(2);
    const [ currEmployeeId, setCurrEmployeeId ] = useState('0');
    const [ currEmployee, setCurrEmployee ] = useState(defaultEmployee);

    const employee = useEmployee(employees[currIndex]);

    useEffect(() => {
        setCurrEmployeeId(employees[currIndex]);
        setCurrEmployee(employee);
    }, [currIndex, employees, employee]);

    return (
        <div className='dashboard'>
            <div>{currEmployeeId}</div>
            <div className='persona'>{currEmployee.employee.name}</div>
            <Board objeto={users} />
        </div>
    )
}

export default Dashboard;   