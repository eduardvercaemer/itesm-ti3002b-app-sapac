import React, { useState } from 'react';
import './Board.css';
import Incidence from './incidence';

// Componente para renderizar una fila de la tabla
function TableRow({ user, onEdit }) {
    const incidencias = {
        "": { backgroundColor: '#ccc', label: "Indefinido" },
        "f": { backgroundColor: '#ff3b30', label: "Falta" },
        "de": { backgroundColor: '#ffcc00', label: "Día económico" },
        "vac": { backgroundColor: '#ffcc00', label: "Vacaciones" },
        "perm": { backgroundColor: '#ff2d54', label: "Permuta" },
        "inc": { backgroundColor: '#007bff', label: "Incapacidad" },
        "je": { backgroundColor: '#00c7be', label: "Justificación entrada" },
        "js": { backgroundColor: '#00c7be', label: "Justificación salida" },
        "lcgs": { backgroundColor: '#55bef0', label: "Lic. con goce de sueldo" },
        "r": { backgroundColor: '#ff9500', label: "Retardo" },
        "ok": { backgroundColor: '#34c759', label: "Correcto" },
        "lsgs": { backgroundColor: '#55bef0', label: "Lic. sin goce de sueldo" },
        "ono": { backgroundColor: '#af52de', label: "Onomástico" },
        "rl": { backgroundColor: '#ff9500', label: "Retardo leve" },
        "rg": { backgroundColor: '#ff9500', label: "Retardo grave" },
        "j": { backgroundColor: '#00c7be', label: "Justificación" },
        "fs": { backgroundColor: '#8e8e93', label: "Falta salida" },
        "fe": { backgroundColor: '#8e8e93', label: "Falta entrada" },
        "d": { backgroundColor: '#ffcc00', label: "Descanso" }
    };

    // Obtener el estilo y la etiqueta de la incidencia actual
    const { backgroundColor, label } = incidencias[user.incidencia] || {};

    return (
        <tr>
            <td>{user.fecha}</td>
            <td>{user.entrada}</td>
            <td>{user.salida}</td>
            <td>
                <p style={backgroundColor ? { backgroundColor } : {}}>
                    {label || user.incidencia}
                </p>
            </td>
            <td>{user.observaciones}</td>
            <td><button className='button' onClick={() => onEdit(user.unformattedDate, user.incidencia)}>Editar</button></td>
        </tr>
    );
}

function Board({ objeto, date_from, date_to, currEmployeeId }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentIncidence, setCurrentIncidence] = useState(null);

    const handleEdit = (date, incidence) => {
        setSelectedDate(date);
        setCurrentIncidence(incidence);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <h1 className='periodo'>Período {`${date_from.getUTCDate()}/${date_from.getUTCMonth() + 1}/${date_from.getUTCFullYear()} - ${date_to.getUTCDate()}/${date_to.getUTCMonth() + 1}/${date_to.getUTCFullYear()}`}</h1>
            <div className='one'>
                <table className='cont'>
                    <thead className='navbar'>
                        <tr>
                            <th>Fecha</th>
                            <th>Entrada</th>
                            <th>Salida</th>
                            <th>Incidencia</th>
                            <th>Observaciones</th>
                            <th style={{ textAlign: 'start' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='navbar'>
                        {objeto.map((user, i) => (
                            <TableRow key={i} user={user} onEdit={handleEdit} />
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && <Incidence onClose={handleCloseModal} currEmployeeId={currEmployeeId} currDate={selectedDate}  currIncidence={currentIncidence} options={['Falta', 'Día Económico', 'Vacaciones', 'Permuta','Incapacidad','Justificación Entrada', 'Justificación salida','Retardo','Retardo Leve','Retardo Grave','Correcto','Justificación','Falta Entrada']}/>}
        </>
    );
}

export default Board;
