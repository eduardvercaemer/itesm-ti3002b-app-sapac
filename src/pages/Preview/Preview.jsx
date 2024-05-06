import React, { useState, useEffect } from "react";
import "./Preview.css";
import { useAllDataForPreview } from "../../handkey-module/state";
import PreviewTable from "../../components/preview-table";
import ExportXLSX from "../../components/export.jsx";
import InputSelect from "../../components/InputSelect";
import {
  useResetEntries,
  useResetEmployees,
  useResetDates,
} from "../../handkey-module/state";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

function Preview() {
  const allDataForPreview = useAllDataForPreview();

  const navigate = useNavigate();
  const resetEntries = useResetEntries();
  const resetEmployees = useResetEmployees();
  const resetDates = useResetDates();

  const [filteredData, setFilteredData] = useState({
    timeFrame: "",
    days: [],
    addresses: [],
    data: [],
  });
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    localStorage.setItem("comesFromPreview", false);
    if (allDataForPreview) {
      if (selectedDepartment === "SA") {
        setFilteredData(allDataForPreview);
      } else {
        const tempFilteredData = allDataForPreview;
        tempFilteredData.data = allDataForPreview?.data
          ? allDataForPreview.data.filter((employees) => {
              return (
                selectedDepartment.replace(/\s/g, "") ===
                employees.address.replace(/\s/g, "")
              );
            })
          : [];
        setFilteredData(tempFilteredData);
      }
    }
  }, [selectedDepartment]);

  const handleSelectChange = (event) => {
    const option = event.target.value;
    setSelectedDepartment(option);
  };

  const handleResetClick = () => {
    Swal.fire({
      title: "Advertencia",
      text: "Estás a punto de eliminar todo tu progreso. Si procedes, tendrás que empezar desde cero. ¿Estás seguro de que deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("currIndex");
        resetDates();
        resetEntries();
        resetEmployees();
        navigate("/");
      }
    });
  };

  return (
    <main className="mainContainer">
      <p className="section">Previsualizaci&oacute;n</p>
      <img src="/sapac-logo.png" width="70" height="80" className="logo"></img>
      <div className="mid-container">
        <div className="header">
          <div className="deleteButton" onClick={handleResetClick}>
            <FontAwesomeIcon icon={faTrashCan} />
          </div>
          <InputSelect
            selectedOption={selectedDepartment}
            onChange={handleSelectChange}
            label="Seleccionar Direcci&oacute;n"
            options={allDataForPreview ? allDataForPreview.addresses : []}
          />
          <ExportXLSX />
        </div>
        {/* Pasa los datos filtrados al `PreviewTable` */}
        <PreviewTable allDataForPreview={filteredData} />
      </div>
    </main>
  );
}

export default Preview;
