import { useAllDataForExport } from "../handkey-module/state";
import ExcelJS from 'exceljs';
import '../utils/colors.css';

export function ExportCsv() {

  const filteredData = useAllDataForExport();
  const defaultBorders = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  }

  const palette = {
    'f': 'ff3b30', 'de': 'ffcc00', 'vac': 'ffcc00', 'perm': 'ff2d54',
    'inc': '007bff', 'je': '00c7be', 'js': '00c7be', 'lcgs': '55bef0',
    'r': 'ff9500', 'ok': '34c759', 'lsgs': '55bef0', 'ono': 'af52de',
    'rl': 'ff9500', 'rg': 'ff9500', 'j': '00c7be', 'fs': '8e8e93',
    'fe': '8e8e93', 'd': 'ffcc00', 'undefinedColor': 'FFFFFF', 'ps': '00c7be'
  };

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

  const fillIncidences = (worksheet, start, end, rowIndex, incidences) =>{
    let letter = letterToNumber(start);
    let current = 0;
    let color = "";
    const delta = letterToNumber(end) - letterToNumber(start);

    for(let s = 0; s <= delta; s++){
      current = numberToLetter(letter + s);
      incidences[s] !== null ? color = incidences[s] : color = "undefinedColor"

      worksheet.getCell(`${current}+${rowIndex}`).value = incidences[s];

      worksheet.getCell(`${current}+${rowIndex}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: `${palette[color]}` }
      };

      worksheet.getCell(`${current}+${rowIndex}`).style.border = {
        top: { style: 'thin', color: { argb: 'FFFFFF' } },
        left: { style: 'thin', color: { argb: 'FFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFF' } }
      };

      worksheet.getCell(`${current}+${rowIndex}`).style.font = { bold: true, color: { argb: coloredLetter(palette[color])} };
      worksheet.getCell(`${current}+${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

      worksheet.getRow(rowIndex).height = 22;
    }
  } 

  const getDayOfWeekFromDate = (dateString) => {
    const dateParts = dateString.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const date = new Date(year, month, day);
    const dayOfWeek = date.toLocaleDateString('es-MX', { weekday: 'short' });
    return dayOfWeek;
  }

  const fillDays = (worksheet, start, end, rowIndex, days) =>{

    let letter = letterToNumber(start);
    let current = 0;
    const delta = letterToNumber(end) - letterToNumber(start);

    for (let s = 0; s <= delta; s++) {
      current = numberToLetter(letter + s);

      worksheet.getCell(`${current}+${rowIndex}`).value = getDayOfWeekFromDate(days[s]);
      worksheet.getCell(`${current}+${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`${current}+${rowIndex}`).style.border = defaultBorders;
      worksheet.getCell(`${current}+${rowIndex}`).style.font = { bold: true };

    }

    let dateParts = "";
    let day = 0;
    rowIndex++;

    for (let s = 0; s <= delta; s++) {
      current = numberToLetter(letter + s);

      dateParts = days[s].split('/');
      day = parseInt(dateParts[0], 10);

      worksheet.getCell(`${current}+${rowIndex}`).value = day;
      worksheet.getCell(`${current}+${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`${current}+${rowIndex}`).style.border = defaultBorders;
      worksheet.getCell(`${current}+${rowIndex}`).style.font = { bold: true };

    }

  }

  //// Contrast with palette colors ////
  const luminance = (hexColor) => {
    const r = parseInt(hexColor.substr(0, 2), 16) / 255;
    const g = parseInt(hexColor.substr(2, 2), 16) / 255;
    const b = parseInt(hexColor.substr(4, 2), 16) / 255;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b);
  }

  const contrastRatio = (color1, color2) => {
    const luminance1 = luminance(color1);
    const luminance2 = luminance(color2);
    const brighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (brighter + 0.05) / (darker + 0.05);
  }

  const coloredLetter = (backGroundColor) =>{
    const contrastWithWhite = contrastRatio(backGroundColor, 'FFFFFF');
    const contrastWithBlack = contrastRatio(backGroundColor, '000000');

    return contrastWithBlack > contrastWithWhite ? '000000' : 'FFFFFF';
  }
  //// End Contrast with palette colors ////

  const onClick = async() => {

    if (Object.keys(filteredData).length === 0 || filteredData === null) {
      return;
    }
    

    const daysLength = filteredData.days.length;
    const finalDayInChar = numberToLetter(2 + daysLength);
    const observationDayInChar = numberToLetter(3 + daysLength);
    const workbook = new ExcelJS.Workbook();

    for (let p = 0; p < filteredData.addresses.length; p++) {

      // create a worksheet for every address
      const currWorksheet = workbook.addWorksheet(filteredData.addresses[p]);

      //////////////////// Headers ////////////////////
      currWorksheet.mergeCells(`A1:${observationDayInChar}1`);
      currWorksheet.getCell('A1').value = "ASIMILADOS"; // 1
      currWorksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      currWorksheet.getCell('A1').style.border = defaultBorders;
      currWorksheet.getCell('A1').style.font = { bold:true };

      currWorksheet.mergeCells(`A3:${observationDayInChar}3`);
      currWorksheet.getCell('A3').value = `INCIDENCIAS DEL ${filteredData.timeFrame}`;
      currWorksheet.getCell('A3'). alignment = { horizontal: 'center', vertical: 'middle' };
      currWorksheet.getCell('A3').style.border = defaultBorders;
      
      currWorksheet.getCell('A3').style.font = { bold: true };


      currWorksheet.mergeCells('A5:A6');
      currWorksheet.getCell('A5').value = "ID";
      currWorksheet.getCell('A5').alignment = { horizontal: 'center', vertical: 'middle' };
      currWorksheet.getCell('A5').style.border = defaultBorders;
      currWorksheet.getCell('A5').style.font = { bold: true };


      currWorksheet.mergeCells('B5:B6');
      currWorksheet.getCell('B5').value = "Nombre";
      currWorksheet.getCell('B5').alignment = { horizontal: 'center', vertical: 'middle' };
      currWorksheet.getColumn(2).width = 40;
      currWorksheet.getCell('B5').style.border = defaultBorders;
      currWorksheet.getCell('B5').style.font = { bold: true };

      currWorksheet.getRow(5).height = 22;
      currWorksheet.getRow(6).height = 22;


      fillDays(currWorksheet, 'C', finalDayInChar, 5, filteredData.days);

      currWorksheet.mergeCells(`${observationDayInChar}5:${observationDayInChar}6`);
      currWorksheet.getCell(`${ observationDayInChar }5`).value = "Observaciones";
      currWorksheet.getCell(`${observationDayInChar}5`).alignment = { horizontal: 'center', vertical: 'middle' };
      currWorksheet.getColumn(daysLength+3).width = 20;
      currWorksheet.getCell(`${observationDayInChar}5`).style.border = defaultBorders;
      currWorksheet.getCell(`${observationDayInChar}5`).style.font = { bold: true };

      //////////////////// END Headers ////////////////////

      let rowIndex = 7; // Initial row Index

      for (let z = 0; z < filteredData.data[p].employees.length; z++) {
        // Fill Rows
        const currentEmployee = filteredData.data[p].employees[z];
        currWorksheet.getCell(`A${rowIndex}`).value = currentEmployee.id;
        currWorksheet.getCell(`A${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

        currWorksheet.getCell(`B${ rowIndex }`).value = currentEmployee.name;
        currWorksheet.getCell(`B${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

        fillIncidences(currWorksheet, 'C', finalDayInChar, rowIndex, currentEmployee.incidences);

        currWorksheet.getCell(`Q${rowIndex}`).value = currentEmployee.observations;
        currWorksheet.getCell(`Q${rowIndex}`).alignment = { horizontal: 'center', vertical: 'middle' };

        rowIndex++;
      }
    }

    //// Generate and download excel file ////
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

  return <button onClick={onClick}>Export</button>;
}