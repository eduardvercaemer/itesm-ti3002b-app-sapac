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

const formatEntries = (employee, date_from, date_to) => {
    console.log(employee);
    console.log(date_from);
    console.log(date_to);
    const formattedEntries = [];

    for (var d = date_from; d <= date_to; d.setUTCDate(d.getUTCDate() + 1)) {
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
    const date_from = new Date(parseInt(localStorage.getItem("date_from"), 10) * 1000);
    const date_to = new Date(parseInt(localStorage.getItem("date_to"), 10) * 1000);
    const employees = useEmployeeList();
    const [ currIndex, setCurrIndex ] = useState(0);
    const [ currEmployeeId, setCurrEmployeeId ] = useState('0');
    const [ currEmployee, setCurrEmployee ] = useState(defaultEmployee);
    const [ currEntries, setCurrEntries ] = useState([]);

    const employee = useEmployee(employees[currIndex]);

    useEffect(() => {
        setCurrEmployeeId(employees[currIndex]);
        setCurrEmployee(employee);
        setCurrEntries(formatEntries(employee, date_from, date_to));
    }, [currIndex, employees, employee]);

    const handleBackClick = () => {
        setCurrIndex(currIndex - 1);
    }
    

    const handleNextClick = () => {
        setCurrIndex(currIndex + 1);
    }

    console.log(currEntries);

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