import React from 'react';
import './Board.css';

// Componente para renderizar una fila de la tabla
function TableRow({ user }) {
    return (
        <tr>
            <td>{user.fecha}</td>
            <td>{user.entrada}</td>
            <td>{user.salida}</td>
            <td>{user.tiempo}</td>
            <td>{user.incidencia}</td>
            <td>{user.observaciones}</td>
            <td><button className='button'>{user.acciones}</button></td>
        </tr>
    );
}

function Board({ objeto }) {
    return (
        <div>
            <div className='periodo'>Periodo fecha - fecha</div>
            <table className='cont'>
                <thead className='navbar'>
                    <tr>
                        <th>Fecha</th>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th>Tiempo</th>
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
