import "./preview-row.css";
import React, { useLayoutEffect, useRef } from 'react';

const previewRow = ({row, onWidthsCalculated}) =>{
    
    const palette = { "correcto": "#C9E8E8", "permuta": "#E1E6F0", "vacaciones": "#CBDCF9", "Indefinido": "#A020F0", "retardo_leve": " #FFF3DD", "retardo_grave": "#F3D4D1 "};
    const days = row.days;
    const cellsRef = useRef([]);

    useLayoutEffect(() => {

        const cells = cellsRef.current;
        const calculatedWidths = [];

        cells.forEach((cell, index) => {
            const width = cell.clientWidth;
            calculatedWidths[index] = width;
        });

        onWidthsCalculated(calculatedWidths);

    }, [row]);


    return(
        <div className="outerContainer">
            
            <div className="rowContainer" ref={(e) =>{cellsRef.current[5] = e}}>

                <div className="idMicroContainer" ref={(e) => {cellsRef.current[0] = e}}>
                    {row.id}
                </div>

                <div className="nameMicroContainer" ref={(e) => { cellsRef.current[1] = e }}>
                    {row.name}
                </div>

                <div className="daysMicroContainer" ref={(e) => { cellsRef.current[2] = e}}>
                    { 
                        days.map((element) => {
                            return (<div key={element.key} className="square" style={{ backgroundColor: `${palette[element]}` }}>
                                    
                            </div>)
                        })
                        
                    }
                </div>

                <div className="observationsMicroContainer" ref={(e) => { cellsRef.current[3] = e }}>
                    {row.observations}
                </div>

                <div className="accionesMicroContainer" ref={(e) => { cellsRef.current[4] = e }}>
                    <button>
                        Editar
                    </button>
                </div>

            </div>

            <div className="line"> </div>

        </div>
    )
}

export default previewRow;