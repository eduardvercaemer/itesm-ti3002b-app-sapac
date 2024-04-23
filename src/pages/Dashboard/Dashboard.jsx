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
        incidencia: "POP",
        observaciones: "NA",
        acciones: "Editar"
    },
    {
        fecha: "11-11-2024",
        entrada: "8:03",
        salida: "16:03",
        incidencia: "ROCK",
        observaciones: "NA",
        acciones: "Editar"
    },
    {
        fecha: "10-10-2024",
        entrada: "8:06",
        salida: "16:06",
        incidencia: "R&B",
        observaciones: "NA",
        acciones: "Editar"
    },
    {
        fecha: "21-11-2024",
        entrada: "8:09",
        salida: "16:09",
        incidencia: "POP",
        observaciones: "NA",
        acciones: "Editar"
    },
]

const formatEntries = (employee) => {
    if(employee.entries !== undefined){
        const formattedEntries = [];
        const date_from = parseInt(localStorage.getItem("date_from"), 10) * 1000;
        const date_to = parseInt(localStorage.getItem("date_to"), 10) * 1000;

        const endDate = new Date(date_to);

        for (var d = new Date(date_from); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
            const day = d.getUTCDate();
            const month = d.getUTCMonth() + 1;
            const year = d.getUTCFullYear();

            const formattedDate = `${day}-${month}-${year}`;

            formattedEntries.push({
                fecha: formattedDate,
                entrada: "",
                salida: "",
                incidencia: "",
                observaciones: "",
                acciones: ""
            });
        }

        return formattedEntries;
    }
    else{
        return [];
    }
}


function Dashboard() {
    const employees = useEmployeeList();
    const [ currIndex, setCurrIndex ] = useState(2);
    const [ currEmployeeId, setCurrEmployeeId ] = useState('0');
    const [ currEmployee, setCurrEmployee ] = useState(defaultEmployee);
    const [ currEntries, setCurrEntries ] = useState([]);

    const employee = useEmployee(employees[currIndex]);

    useEffect(() => {
        setCurrEmployeeId(employees[currIndex]);
        setCurrEmployee(employee);
        console.log(employee);
        setCurrEntries(formatEntries(employee));
    }, [currIndex, employees, employee]);

    const handleBackClick = () => {
        setCurrIndex(currIndex - 1);
    }
    

    const handleNextClick = () => {
        setCurrIndex(currIndex + 1);
    }

    return (
        <div>
            <div>{currEmployeeId}</div>
            <div className='dashboard-container'>
                <div className='cardPerson'>{currEmployee.employee.name}</div>
                <div className='cardTable'>
                    <Board objeto={currEntries} />
                </div>
            </div>
            <div className='button-container'>
            {currIndex > 0 && <button className='button left-button' onClick={handleBackClick}>Anterior</button>}
            {currIndex < employees.length && <button className='button right-button' onClick={handleNextClick}>Siguiente</button>}
            </div>
        </div>
        
    )
}

export default Dashboard;   