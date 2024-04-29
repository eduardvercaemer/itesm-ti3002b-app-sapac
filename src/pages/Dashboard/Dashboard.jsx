import { useState , useMemo } from 'react'
import Board from '../../components/Board'
import { useCreateIncidence, useEditIncidence, useEmployeeList, useEmployee } from "../../handkey-module/state";

import "./Dashboard.css";

const formatEntries = (employee) => {
    const formattedEntries = [];

    if(employee.days !== undefined) {
        employee.days.forEach((day) => {
            const entryDay = day.date.getUTCDate();
            const entryMonth = day.date.getUTCMonth() + 1;
            const entryYear = day.date.getUTCFullYear();
            const formattedDate = `${entryDay}-${entryMonth}-${entryYear}`;

            let entry = "";
            let exit = "";

            if(day.entries[0]) {
                const entryDate = new Date(day.entries[0]);
                const entryHours = entryDate.getUTCHours();
                const entryMinutes = "0" + entryDate.getUTCMinutes();
                entry = entryHours + ':' + entryMinutes.slice(-2)
            }
            if(day.entries[1]){
                const exitDate = new Date(day.entries[1]);
                const exitHours = exitDate.getUTCHours();
                const exitMinutes = "0" + exitDate.getUTCMinutes();
                exit = exitHours + ':' + exitMinutes.slice(-2)
            }

            formattedEntries.push({
                fecha: formattedDate,
                entrada: entry,
                salida: exit,
                incidencia: "",
                observaciones: "",
            });
        });
    }

    return formattedEntries;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}`;
}

function Dashboard() {
    const employees = useEmployeeList();
    const date_from = new Date(parseInt(localStorage.getItem("state/start-date"), 10));
    const date_to = new Date(parseInt(localStorage.getItem("state/end-date"), 10));
    const [ currIndex, setCurrIndex ] = useState(0);

    const currEmployee = useEmployee(employees[currIndex]);
    const currEntries = useMemo(() => formatEntries(currEmployee), [currEmployee]);
    const currEmployeeId = useMemo(() => employees[currIndex], [currIndex]);

    const handleBackClick = () => {
        setCurrIndex(currIndex - 1);
    }
    
    const handleNextClick = () => {
        console.log(currIndex + 1)
        setCurrIndex(currIndex + 1);
    }

    console.log(employees)
    console.log(currEmployee)

    return (
        <div className='contdash'>
            <div className='dashboard-container'>
                <div className='cardPerson'>
                    <img src='\profilepic.jpg'/>
                    <div className='employee-id'>
                        <span className='label-id'>Número de empleado:</span> {currEmployeeId}
                    </div>
                    <div className='employee-name'>
                        <span className='label'>Nombre:</span> {currEmployee.employee.name}
                    </div>
                    <div className='employee-address'>
                        <span className='label'>Dirección:</span> {currEmployee.employee.address}
                    </div>
                    <div className='employee-kind'>
                        <span className='label'>Tipo:</span> {currEmployee.employee.kind}
                    </div>
                    <div className='schedule-time'>
                        <span className='label'>Horario: </span>
                        <span>
                        {formatTime(currEmployee.employee.schedule.start)} - {formatTime(currEmployee.employee.schedule.end)}
                        </span>
                    </div>
                </div>

                <div className='cardTable'>
                    <Board objeto={currEntries} date_from={date_from} date_to={date_to}/>
                </div>
            </div>
            <div className='button-container'>
                {currIndex > 0 ?
                    <button className='button left-button' onClick={handleBackClick}>Anterior</button> :
                    <button className='button left-button disabled' disabled>Anterior</button>
                }   
                {/*currIndex > 0 && <button className='button left-button' onClick={handleBackClick}>Anterior</button>*/}
                {currIndex < employees.length && <button className='button right-button' onClick={handleNextClick}>Siguiente</button>}
            </div>
                {/*<button className='button left-button' onClick={handleBackClick} disabled={currIndex === 0}>Anterior</button>*/}
                {/*<button className={`button left-button ${currIndex === 0 ? 'gray-button' : ''}`} onClick={handleBackClick} disabled={currIndex === 0}>Anterior</button>*/}

        </div>
    )
}

export default Dashboard;
