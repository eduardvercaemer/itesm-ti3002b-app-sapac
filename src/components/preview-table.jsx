import PreviewRow from "./preview-row";
import "./preview-table.css";
import React, { useState, useEffect } from 'react';


const previewTable = ({data}) =>{

    const headers = ["ID", "Nombre", "Días", "Observaciones", "Acciones"];
    const [columnWidths, setColumnWidths] = useState([]);
    const [adjustedHeaders, setAdjustedHeaders] = useState();

    useEffect(() => {

        setAdjustedHeaders(headers.map((key, index) => (
            <th key={key} style={{ "width": `${columnWidths[index]/16}em` }}>{headers[index]}</th>
        )));

    }, [columnWidths]);
    
    const onWidthsCalculated = (widths) => {
        setColumnWidths(widths);
    };

    return (
        <div className="tableContainer">

            <table>
                <tr className="headerContainer">
                    {adjustedHeaders}
                </tr>

                <tbody className="bottomTable"> 
                    {data.map((element, index) =>
                        <PreviewRow key={element.key} row={element} rowKey={headers[index]} onWidthsCalculated={onWidthsCalculated} />
                    )}
                </tbody>
            </table>
            
        </div>
    )

}

export default previewTable;