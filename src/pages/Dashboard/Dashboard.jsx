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

        employee.entries.entries.forEach((entry) => {
            var date = new Date(entry);

            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
        
            var hours = date.getUTCHours();
            var minutes = "0" + date.getUTCMinutes();
    
            const formattedEntry = {
                fecha: `${day}-${month}-${year}`,
                entrada: hours + ':' + minutes.slice(-2),
                salida: "16:00",
                incidencia: "POP",
                observaciones: "NA",
                acciones: "Editar"
            }
            formattedEntries.push(formattedEntry);
        }); 

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
            <div className='dashboard'>
                <div>{currEmployeeId}</div>
                <div className='persona'>{currEmployee.employee.name}</div>
                <Board objeto={currEntries} />
            </div>
            {currIndex > 0 && <button onClick={handleBackClick}>Anterior</button>}
            {currIndex < employees.length && <button onClick={handleNextClick}>Siguiente</button>}
        </div>
        
    )
}

export default Dashboard;   