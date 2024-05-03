import { useAllDataForPreview, useEmployee } from "../handkey-module/state";
import PreviewRow from "./preview-row";
import "./preview-table.css";
import React, { useState, useEffect } from "react";

const previewTable = () => {

  const headers = ["ID", "Nombre", "Días", "Observaciones", "Acciones"];
  const [columnWidths, setColumnWidths] = useState([]);
  const [adjustedHeaders, setAdjustedHeaders] = useState();
  const allDataForPreview = useAllDataForPreview();
  const [dummyRow, setDummyRow] = useState();

  const [modalDisplayed, setModalDisplayed] = useState(false);
  const [rowIndex, setRowIndex] = useState();

  useEffect(() => {
    setAdjustedHeaders(
      headers.map((key, index) => (
        <th key={key} style={{ width: `${columnWidths[index] / 16}em` }}>
          {headers[index]}
        </th>
      )),
    );
  }, [columnWidths]);


/*   useEffect(()=>{
      allDataForPreview !== null && allDataForPreview?.days && setDummyRow(

      )

  },[allDataForPreview]) */

  const onWidthsCalculated = (widths) => {
    setColumnWidths(widths);
  };

  /* const retrieveIndex = (index) =>{
    setRowIndex(index);
  }

  const setDisplay = (boolean) =>{
    setModalDisplayed(boolean);
  } */

  useEffect(()=>{
      allDataForPreview !== null && allDataForPreview?.days && setDummyRow(<PreviewRow
          row={{ address: "", id: "", incidences: allDataForPreview.days, index: -1, name: "", observations: "" }}
          rowKey={-1}
          onWidthsCalculated={onWidthsCalculated}
          />
        )
  },[allDataForPreview])


  return (
    <div className="tableContainer">

          {allDataForPreview !== null && allDataForPreview?.data && modalDisplayed && rowIndex && (<EditPreview index={rowIndex}/>)}

      {!modalDisplayed && <table>
        <tr className="headerContainer">{adjustedHeaders}</tr>

        <tbody>
                  {dummyRow}

                  {allDataForPreview !== null && allDataForPreview?.data?.map((element, index) => (
                      <PreviewRow
                          key={element.key}
                          row={element}
                          rowKey={headers[index]}
                          onWidthsCalculated={onWidthsCalculated}
                      />
                  ))}
        </tbody>
      </table>}

    </div>
  );
};

export default previewTable;
