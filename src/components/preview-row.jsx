import "./preview-row.css";
import React, { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const previewRow = ({ row, onWidthsCalculated}) => {
  const navigate = useNavigate();
    const palette = {
        'f': 'ff3b30', 'de': 'ffcc00', 'vac': 'ffcc00', 'perm': 'ff2d54',
        'inc': '007bff', 'je': '00c7be', 'js': '00c7be', 'lcgs': '55bef0',
        'r': 'ff9500', 'ok': '34c759', 'lsgs': '55bef0', 'ono': 'af52de',
        'rl': 'ff9500', 'rg': 'ff9500', 'j': '00c7be', 'fs': '8e8e93',
        'fe': '8e8e93', 'd': 'ffcc00', 'undefinedColor': 'FFFFFF', 'ps': '00c7be'
    };
  const incidences = row.incidences;
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


  const onClickEdit = () =>{

    /* retrieveIndex(row.id);
    modalDisplayed(true); */
    localStorage.setItem("currIndex", row.index);
    localStorage.setItem("comesFromPreview", true);

    navigate("/dashboard");



  }

  return (
    <div className="outerContainer">
      <div
        className="rowContainer"
        ref={(e) => {
          cellsRef.current[5] = e;
        }}
      >
        <div
          className="idMicroContainer"
          ref={(e) => {
            cellsRef.current[0] = e;
          }}
        >
          {row.id}
        </div>

        <div
          className="nameMicroContainer"
          ref={(e) => {
            cellsRef.current[1] = e;
          }}
        >
          {row.name}
        </div>

        <div
          className="daysMicroContainer"
          ref={(e) => {
            cellsRef.current[2] = e;
          }}
        >
          {incidences.map((element) => {
            return (
              <div
                key={element.key}
                className="square"
                style={{ backgroundColor: `#${palette[element]}` }}
              >
                <div className="innerLetter">
                    {element}
                </div>
              </div>
            );
          })}
        </div>

        <div
            className="observationsMicroContainer"
            ref={(e) => {
                cellsRef.current[3] = e;
            }}
        >
            {row.observations}
        </div>
        
              {row.index !== -1 && (<div
                  className="accionesMicroContainer"
                  ref={(e) => {
                      cellsRef.current[4] = e;
                  }}
              >
                  <button onClick={()=>onClickEdit()}> Editar </button>
              </div>) }
        

        
      </div>

      <div className="line"> </div>
    </div>
  );
};

export default previewRow;
