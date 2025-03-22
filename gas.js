const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("sheet1");

function getSheetData() {
   if (sheet.getLastRow() === 0) return { dates: [], times: [], values: [], datesWork: [], works: [], worksCells: [] };

   const data = sheet.getDataRange().getValues();
   let dates = [],
      times = [],
      values = [],
      datesWork = [],
      works = [],
      worksCells = [];

   data.forEach((row, i) => {
      if (row[0] !== "") {
         const timestamp = new Date(row[0]).getTime();
         if (row[1] !== 5) {
            dates.push(timestamp);
            times.push(row[1]);
            values.push(row[2]);
         } else {
            worksCells.push(i + 1);
            datesWork.push(timestamp);
            works.push(row[2]);
         }
      }
   });
   return { dates, times, values, datesWork, works, worksCells };
}

const sortingDates = (arr) => [...new Set(arr)].sort((a, b) => a - b);

const sortNums = (sorted, unsorted) =>
   sorted.map((d) => unsorted.map((v, i) => (v === d ? i : -1)).filter((i) => i !== -1));

const packing = (mode, numArray, sortD, times, values, works) => {
   return numArray.map((indices, i) => [
      new Date(sortD[i]),
      indices.map((j) => (mode === 0 ? [times[j], values[j]] : [works[j], j + 1])),
   ]);
};

function doPost(e) {
   const { datesWork, worksCells } = getSheetData();
   const { date, time, value } = JSON.parse(e.postData.getDataAsString());

   if (sheet.getLastRow() === 0 && value != 18) {
      sheet.appendRow([date, time, value]);
      return ContentService.createTextOutput(JSON.stringify({ valid: true })).setMimeType(ContentService.MimeType.JSON);
   }

   const data = sheet.getDataRange().getValues();
   let rowDeleted = false;
   const inputDate = new Date(date).getTime() - 32400000;

   if (value === "18") {
      rowDeleted = true;
      for (let i = data.length - 1; i >= 0; i--) {
         if (new Date(data[i][0]).getTime() == inputDate && data[i][1] == time) {
            sheet.deleteRow(i + 1);
         }
      }
   }

   if (date == 0 && time == 5) {
      rowDeleted = true;

      let numsWork = sortNums(sortingDates(datesWork), datesWork);
      let sortWorksCells = [];

      numsWork.forEach((row) => {
         row.forEach((index) => {
            sortWorksCells.push(worksCells[index]);
         });
      });

      sheet.deleteRow(sortWorksCells[value - 1]);
   }

   if (!rowDeleted) {
      if (time != 5) {
         for (let i = data.length - 1; i >= 0; i--) {
            if (new Date(data[i][0]).getTime() == inputDate && data[i][1] == time) {
               sheet.deleteRow(i + 1);
               break;
            }
         }
      }
      sheet.appendRow([date, time, value]);
   }

   return ContentService.createTextOutput(JSON.stringify({ valid: true })).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
   trashRow();
   const { dates, times, values, datesWork, works } = getSheetData();

   if (dates.length === 0 && datesWork.length === 0) {
      return ContentService.createTextOutput(JSON.stringify([[], []])).setMimeType(ContentService.MimeType.JSON);
   }

   const sortDates = sortingDates(dates);
   const sortDatesWork = sortingDates(datesWork);

   const result = [
      packing(0, sortNums(sortDates, dates), sortDates, times, values, works),
      packing(1, sortNums(sortDatesWork, datesWork), sortDatesWork, times, values, works),
   ];

   return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function trashRow() {
   if (sheet.getLastRow() === 0) return;

   const data = sheet.getDataRange().getValues();
   const today = new Date().setHours(0, 0, 0, 0);
   let i = 1;
   while (i < data.length) {
      if (!data[i][0] || new Date(data[i][0]).getTime() < today) {
         sheet.deleteRow(i + 1);
         data.splice(i, 1);
      } else {
         i++;
      }
   }
}
