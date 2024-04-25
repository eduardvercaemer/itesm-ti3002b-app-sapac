import "./preview-row.css";
import React, { useState, useEffect } from 'react';



const previewRow = ({row, rowKey, onWidthsCalculated}) =>{
    
    const palette = { "correcto": "#C9E8E8", "permuta": "#E1E6F0", "vacaciones": "#CBDCF9", "Indefinido": "#A020F0", "retardo_leve": " #FFF3DD", "retardo_grave": "#F3D4D1 "};
    const classesToHeaders = {"ID": "idMicroContainer", "Nombre": "nameMicroContainer", "Días": "daysMicroContainer", "Observaciones": "observationsMicroContainer"}; 
    const days = row.days;

    useEffect(() => {

        const cells = document.querySelectorAll(`.${classesToHeaders[rowKey]}`);

        const calculatedWidths = {};

        cells.forEach((cell, index) => {
            const column = rowKey;
            const width = cell.getBoundingClientRect().width;
            calculatedWidths[column] = width;
        });

        onWidthsCalculated(calculatedWidths);


    }, [row, onWidthsCalculated]);


    return(
        <div>
            <div className="rowContainer">

                <div className="idMicroContainer">
                    {row.id}
                </div>

                <div className="nameMicroContainer">
                    {row.name}
                </div>

                <div className="daysMicroContainer">
                    { 
                        days.map((element) => {
                            return (<div key={element.key} className="square" style={{ backgroundColor: `${palette[element]}` }}>
                                    
                            </div>)
                        })
                        
                    }
                </div>

                <div className="observationsMicroContainer">
                    {row.observations}
                </div>

            </div>

            <div className="line"> </div>

        </div>
        

    )



}

export default previewRow;