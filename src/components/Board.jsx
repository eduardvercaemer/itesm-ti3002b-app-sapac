import React from 'react';
import './Board.css';

// Componente para renderizar una fila de la tabla
function TableRow({ user }) {
    return (
        <tr>
            <td>{user.fecha}</td>
            <td>{user.entrada}</td>
            <td>{user.salida}</td>
            <td><p style={user.incidencia === "POP" ? { backgroundColor: 'violet' } : user.incidencia === "ROCK" ? { backgroundColor: 'Gray' } : { backgroundColor: 'blue' }}>
                {user.incidencia}
            </p></td>
            <td>{user.observaciones}</td>
            <td><button className='button'>Editar</button></td>
        </tr>
    );
}

function Board({ objeto , date_from, date_to}) {
    return (
        <div>
            <div className='periodo'>Período {`${date_from.getUTCDate()}/${date_from.getUTCMonth() + 1}/${date_from.getUTCFullYear()} - ${date_to.getUTCDate()}/${date_to.getUTCMonth() + 1}/${date_to.getUTCFullYear()}`}</div>
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
                        <TableRow key={i} user={user} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Board;
