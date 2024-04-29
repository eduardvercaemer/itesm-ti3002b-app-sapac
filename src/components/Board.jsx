import React, { useState } from 'react';
import './Board.css';
import ModalIncidencia from './Modal-incidencia.jsx';



// Componente para renderizar una fila de la tabla
function TableRow({ user, onEdit }) {
    return (
        <tr>
            <td>{user.fecha}</td>
            <td>{user.entrada}</td>
            <td>{user.salida}</td>
            <td><p style={user.incidencia === "POP" ? { backgroundColor: 'lightgreen' } : user.incidencia === "ROCK" ? { backgroundColor: 'Gray' } : {}}>
                {user.incidencia}
            </p></td>
            <td>{user.observaciones}</td>
            <td><button className='button' onClick={onEdit}>Editar</button></td>
        </tr>
    );
}

function Board({ objeto , date_from, date_to}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>

            <h1 className='periodo'>Período {`${date_from.getUTCDate()}/${date_from.getUTCMonth() + 1}/${date_from.getUTCFullYear()} - ${date_to.getUTCDate()}/${date_to.getUTCMonth() + 1}/${date_to.getUTCFullYear()}`}</h1>
            <table className='cont'>
                <thead className='navbar'>
                    <tr>
                        <th>Fecha</th>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th>Incidencia</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody className='navbar'>
                    {objeto.map((user, i) => (
                        <TableRow user={user} onEdit={() => setShowModal(true)} />
                    ))}
                </tbody>
            </table>
            <ModalIncidencia show={showModal} onClose={() => setShowModal(false)} options={['Falta', 'Día Económico', 'Vacaciones', 'Permuta','Incapacidad','Justificación Entrada', 'Justificación salida','Retardo','Retardo Leve','Retardo Grave','Correcto','Justificación','Falta Entrada']} />
        </div>
    );
}

export default Board;
