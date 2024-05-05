import { useAllDataForPreview, useEmployee } from "../handkey-module/state";
import PreviewRow from "./preview-row";
import "./preview-table.css";
import React, { useState, useEffect } from "react";

const previewTable = ({ allDataForPreview }) => {
  const headers = ["ID", "Nombre", "Días", "Observaciones", "Acciones"];
  const [columnWidths, setColumnWidths] = useState([]);
  const [adjustedHeaders, setAdjustedHeaders] = useState();
  const [dummyRow, setDummyRow] = useState();

  const [modalDisplayed, setModalDisplayed] = useState(false);
  const [rowIndex, setRowIndex] = useState();

  useEffect(() => {
    setAdjustedHeaders(
      headers.map((key, index) => (
        <div key={key} style={{ width: `${columnWidths[index] / 16}em` }}>
          {headers[index]}
        </div>
      )),
    );
  }, [columnWidths]);

  const onWidthsCalculated = (widths) => {
    setColumnWidths(widths);
  };

  useEffect(() => {
    allDataForPreview !== null &&
      allDataForPreview?.days &&
      setDummyRow(
        <PreviewRow
          row={{
            address: "",
            id: "",
            incidences: allDataForPreview.days,
            index: -1,
            name: "",
            observations: "",
          }}
          rowKey={-1}
          onWidthsCalculated={onWidthsCalculated}
        />,
      );
  }, [allDataForPreview]);

  return (
    <div className="tableContainer">
      {allDataForPreview !== null &&
        allDataForPreview?.data &&
        modalDisplayed &&
        rowIndex && <EditPreview index={rowIndex} />}

      {!modalDisplayed && (
        <div>
          <div className="headerContainer">{adjustedHeaders}</div>

          {dummyRow}

          {allDataForPreview !== null &&
            allDataForPreview?.data?.map((element, index) => (
              <PreviewRow
                key={index}
                row={element}
                rowKey={headers[index]}
                onWidthsCalculated={onWidthsCalculated}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default previewTable;
