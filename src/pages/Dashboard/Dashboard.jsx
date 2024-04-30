import { useState , useMemo, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Board from '../../components/Board'
import { useCreateIncidence, useEditIncidence, useEmployeeList, useEmployee } from "../../handkey-module/state";

import "./Dashboard.css";
import { useFetcher } from 'react-router-dom';

const formatEntries = (employee) => {
    const formattedEntries = [];

    if(employee  && employee.days) {
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
                incidencia: day.incidence ? day.incidence : "" ,
                observaciones: day.observation ? day.observation : "",
                unformattedDate: day.date
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
    const navigate = useNavigate();
    const employees = useEmployeeList();
    const date_from = new Date(parseInt(localStorage.getItem("state/start-date"), 10));
    const date_to = new Date(parseInt(localStorage.getItem("state/end-date"), 10));
    const [ currIndex, setCurrIndex ] = useState(localStorage.getItem("currIndex") !== null ? parseInt(localStorage.getItem("currIndex")) : 0);

    const currEmployee = useEmployee(employees[currIndex]);
    const currEntries = useMemo(() => formatEntries(currEmployee), [currEmployee]);
    const currEmployeeId = useMemo(() => employees[currIndex], [currIndex]);

   useEffect(() => {
        setTimeout(() => currEmployee.inferIncidences(), 0);
    }, [currEmployee]);
    

    const handleBackClick = () => {
        console.log(currEmployee);
        localStorage.setItem("currIndex", currIndex - 1)
        setCurrIndex(currIndex - 1);
    }
    
    const handleNextClick = () => {
        console.log(currEmployee);
        localStorage.setItem("currIndex", currIndex + 1)
        setCurrIndex(currIndex + 1);
    }

    const handleExportClick = () => {
        navigate("/preview");
    }

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
                    <Board objeto={currEntries} currEmployeeId={currEmployeeId} date_from={date_from} date_to={date_to}/>
                </div>
            </div>
            <div className='button-container'>
                {currIndex > 0 ?
                    <button className='button left-button' onClick={handleBackClick}>Anterior</button> :
                    <button className='button left-button disabled' disabled>Anterior</button>
                }   
                {currIndex < employees.length - 1 ? 
                    <button className='button right-button' onClick={handleNextClick}>Siguiente</button> :
                    <button className='button right-button' onClick={handleExportClick}>Exportar</button>    
                }
            </div>
        </div>
    )
}

export default Dashboard;
