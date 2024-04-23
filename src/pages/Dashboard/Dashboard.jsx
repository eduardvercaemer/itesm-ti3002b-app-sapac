import { useState , useEffect, useMemo } from 'react'
import Board from '../../components/Board'
import { useEmployee, useEmployeeList } from "../../handkey-module/state.js";

import "./Dashboard.css";

const formatEntries = (employee, date_from, date_to) => {
    const formattedEntries = [];
    const startDate = new Date(date_from); // Create a new Date object

    for (var d = startDate; d <= date_to; d.setUTCDate(d.getUTCDate() + 1)) {
        const day = d.getUTCDate();
        const month = d.getUTCMonth() + 1;
        const year = d.getUTCFullYear();

        const formattedDate = `${day}-${month}-${year}`;

        // Check if there's an entry for this date
        const entry = employee.entries !== undefined ? employee.entries.entries.find(entry => {
            const entryDate = new Date(entry);
            const entryDay = entryDate.getUTCDate();
            const entryMonth = entryDate.getUTCMonth() + 1;
            const entryYear = entryDate.getUTCFullYear();
            return `${entryDay}-${entryMonth}-${entryYear}` === formattedDate;
        }) : undefined;
        

        if (entry) {
            const entryDate = new Date(entry * 1000);
            const hours = entryDate.getUTCHours();
            const minutes = "0" + entryDate.getUTCMinutes();

            formattedEntries.push({
                fecha: formattedDate,
                entrada: hours + ':' + minutes.slice(-2),
                salida: "16:00",
                incidencia: "POP",
                observaciones: "NA",
            });
        } else {
            formattedEntries.push({
                fecha: formattedDate,
                entrada: "",
                salida: "",
                incidencia: "",
                observaciones: "",
            });
        }
    }

    return formattedEntries;
}

function Dashboard() {
    const employees = useEmployeeList();
    const date_from = new Date(parseInt(localStorage.getItem("date_from"), 10) * 1000);
    const date_to = new Date(parseInt(localStorage.getItem("date_to"), 10) * 1000);
    const [ currIndex, setCurrIndex ] = useState(0);

    const currEmployee = useEmployee(employees[currIndex]);
    const currEntries = useMemo(() => formatEntries(currEmployee, date_from, date_to), [currEmployee]);
    const currEmployeeId = useMemo(() => employees[currIndex], [currIndex]);

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
                    <Board objeto={currEntries} date_from={date_from} date_to={date_to}/>
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