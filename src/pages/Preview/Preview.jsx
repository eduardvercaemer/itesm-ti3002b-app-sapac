import React, { useState, useEffect } from 'react';
import "./Preview.css";
import { useAllDataForPreview } from "../../handkey-module/state";
import PreviewTable from "../../components/preview-table";
import ExportXLSX from "../../components/export.jsx";
import InputSelect from "../../components/InputSelect";

function Preview() {
    const allDataForPreview = useAllDataForPreview();
    

    const [filteredData, setFilteredData ] = useState({timeFrame: "", days: [], addresses: [], data: []});
    const [selectedDepartment, setSelectedDepartment] = useState("");

    useEffect(() => {
        localStorage.setItem('comesFromPreview', false)
        if(allDataForPreview){
            if(selectedDepartment === "SA"){
                setFilteredData(allDataForPreview);
            }
            else{
                const tempFilteredData = allDataForPreview;
                tempFilteredData.data = allDataForPreview?.data
                ? allDataForPreview.data.filter((employees) => {
                    return selectedDepartment.replace(/\s/g, "") === employees.address.replace(/\s/g, "");
                }) : [];
                setFilteredData(tempFilteredData);
            }
        }
    }, [selectedDepartment])
    
    
    

    const handleSelectChange = (event) => {
        const option = event.target.value;
        setSelectedDepartment(option);
    };

    return (
        <main className="mainContainer">
            <InputSelect
                selectedOption={selectedDepartment}
                onChange={handleSelectChange}
                label="Seleccionar Departamento"
                options={allDataForPreview ? allDataForPreview.addresses : []}
            />

            {/* Pasa los datos filtrados al `PreviewTable` */}
            <PreviewTable allDataForPreview={filteredData} />
            <ExportXLSX />
        </main>
    );
}

export default Preview;
