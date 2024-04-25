import PreviewRow from "./preview-row";
import "./preview-table.css";
import React, { useState, useEffect } from 'react';


const previewTable = ({data}) =>{

    const headers = ["ID", "Nombre", "Días", "Observaciones"];
    const [columnWidths, setColumnWidths] = useState([]);
    const [adjustedHeaders, setAdjustedHeaders] = useState();

    console.log(columnWidths)

    useEffect(() => {

        setAdjustedHeaders(headers.map((key, index) => (
            <th key={key} style={{ "width": `${columnWidths[key]}px` }}>{headers[index]}</th>
        )));


    }, [columnWidths]);


    useEffect(()=>{
        
    },[columnWidths])
    
    const onWidthsCalculated = (widths) => {

        const exists = Object.keys(widths).some(key => key in columnWidths);

        if (!exists && Object.keys(widths).length > 0) {
            const newColumnWidths = { ...columnWidths, ...widths };

            setColumnWidths(newColumnWidths);
        }
    };

    return (
        <div className="tableContainer">

            <table>
                <tr className="headerContainer">
                    {adjustedHeaders}
                </tr>

                <tbody>
                    {data.map((element, index) =>
                        <PreviewRow key={element.key} row={element} rowKey={headers[index]} onWidthsCalculated={onWidthsCalculated} />
                    )}
                </tbody>

                
            </table>
            


        </div>
    )

}

export default previewTable;