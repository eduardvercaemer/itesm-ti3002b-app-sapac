import React, { useState, useEffect } from 'react';
import "./Preview.css";
import { useAllDataForPreview } from "../../handkey-module/state";
import PreviewTable from "../../components/preview-table";
import ExportXLSX from "../../components/export.jsx";
import InputSelect from "../../components/InputSelect";
import testingArray from "../../../testing-array.js";

function Preview() {
    const allDataForPreview = useAllDataForPreview(); //
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const handleSelectChange = (event) => {
        setSelectedDepartment(event.target.value);

    };

    // Filtra los datos según el departamento seleccionado
    const filteredData = allDataForPreview?.data
        ? allDataForPreview.data.filter((element) => {
            if (!selectedDepartment) {
                return true;
            }
            return element.department === selectedDepartment;
        })
        : [];

    const departmentOptions = [
        "OPERACIÓN",
        "COMERCIAL",
        "SANEAMIENTO Y CALIDAD DEL AGUA",
        "TÉCNICA",
        "ADMINISTRACIÓN Y FINANZAS",
        "UNIDAD DE COMUNICACIÓN, GESTION SOCIAL Y CULTURA AMBIENTAL",
        "JURIDICA",
        "GENERAL",
    ];

    return (
        <main className="mainContainer">
            <InputSelect
                selectedOption={selectedDepartment}
                onChange={handleSelectChange}
                label="Seleccionar Departamento"
                options={departmentOptions}
            />

            {/* Pasa los datos filtrados al `PreviewTable` */}
            <PreviewTable data={testingArray} />
            <ExportXLSX />
        </main>
    );
}

export default Preview;
