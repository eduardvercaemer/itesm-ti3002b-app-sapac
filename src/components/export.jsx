import { useCallback, useEffect, useState } from "react";
import Papa from "papaparse";
import { useEmployeeList, useEmployee } from "../handkey-module/state";
import tEmployee from "../../testing-employee";
import ExcelJS from 'exceljs';
import '../utils/colors.css';

const df = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  dateStyle: "short",
  timeStyle: "short",
  hourCycle: "h24",
});

export function ExportCsv() {
  const [addresses, setAddresses] = useState(tEmployee.addresses);
  const [filteredData, setFilterData] = useState(tEmployee.data);


  const palette = {
    'f': 'ff3b30',
    'de': 'ffcc00',
    'vac': 'ffcc00',
    'perm': 'ff2d54',
    'inc': '007bff',
    'je': '00c7be',
    'js': '00c7be',
    'lcgs': '55bef0',
    'r': 'ff9500',
    'ok': '34c759',
    'lsgs': '55bef0',
    'ono': 'af52de',
    'rl': 'ff9500',
    'rg': 'ff9500',
    'j': '00c7be',
    'fs': '8e8e93',
    'fe': '8e8e93',
    'd': 'ffcc00'
  };

 /*  const getAddresses = () =>{
    // still need to update with local memo
    let decoyArr = []

    for (let x = 0; x < employees.length; x++) {

      const currEmployee = employees[x];

      if (!decoyArr.includes(currEmployee.employee.address)){
        decoyArr.push(currEmployee.employee.address);
      }

    }
    setAddresses(decoyArr);
  }

  useEffect(()=>{
    getAddresses();
  },[])


  const findIndexByKey = (array, key, value) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return i;
      }
    }
    return -1
  }

  useEffect(()=>{

    if(filteredData.length === 0){
      for (let y = 0; y < employees.length; y++) {

        let currAddress = employees[y].employee.address;

        const alreadyStored = filteredData.some(e => Object.values(e).includes(currAddress));


        if (alreadyStored) {
          //current address already exists on array
          const objectIndex = findIndexByKey(filteredData, 'address', currAddress);
          const objectCopy = filteredData[objectIndex];
          const employeesCopy = objectCopy.employees;
          employeesCopy.push(employees[y]);

          const newObject = { address: currAddress, employees: employeesCopy };
          const fullFilterDataCopy = filteredData;
          fullFilterDataCopy[objectIndex] = newObject;

          setFilterData(fullFilterDataCopy);

        }
        else {
          const newObject = { address: currAddress, employees: [employees[y]] };
          const fullFilterDataCopy = filteredData;
          fullFilterDataCopy.push(newObject);

          setFilterData(fullFilterDataCopy);
        }

      }
    }

  },[addresses]) */

  function numberToLetter(number) {
    let letter = '';
    while (number > 0) {
      const remainder = (number - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      number = Math.floor((number - remainder) / 26);
    }
    return letter;
  }

  function letterToNumber(letter) {
    return letter.charCodeAt(0) - 64;
  }



  const fillDays = (worksheet, start, end, rowIndex, incidences) =>{
    let letter = letterToNumber(start);
    let current = 0;
    const delta = letterToNumber(end) - letterToNumber(start);

    console.log(incidences);
    for(let s = 0; s <= delta; s++){
      current = numberToLetter(letter + s);

      worksheet.getCell(`${current}+${rowIndex}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: `${palette[incidences[s].value]}` }
      };;

    }

  } 

  const onClick = async() => {

    if (!filteredData) {
      return;
    }

    const workbook = new ExcelJS.Workbook();
    for (let p = 0; p < addresses.length; p++) {

      // create a worksheet for every address
      const currWorksheet = workbook.addWorksheet(addresses[p]);

      currWorksheet.getCell('A1').value = "ID";
      currWorksheet.getCell('B1').value = "Nombre";
      currWorksheet.mergeCells('C1:Q1');
      currWorksheet.getCell('C1').value = "Días";
      currWorksheet.getCell('Q1').value = "Observaciones";


      let rowIndex = 2;
      for (let z = 0; z < filteredData[p].length; z++) {
        //fill rows
        currWorksheet.getCell(`A${ rowIndex }`).value = z + 1;
        currWorksheet.getCell(`B${ rowIndex }`).value = filteredData[p].employees[z].name;
      
        fillDays(currWorksheet,'C','P',rowIndex, filteredData[p].employees[z].employee.incidences);

        currWorksheet.getCell(`Q${ rowIndex }`).value = filteredData[p].employees[z].employee.observations;
        rowIndex++;
      }

   
    } 

    // Generar y descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.setAttribute("href", url);
    anchor.setAttribute("download", "handkey-limpio.xlsx");
    anchor.setAttribute("style", "display:none");
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(anchor);

  };

  return <button onClick={onClick}>export csv</button>;
}

function employeeToRows([key, value]) {
  return value.entries.map((e) => [key, value.name, df.format(new Date(e))]);
}
