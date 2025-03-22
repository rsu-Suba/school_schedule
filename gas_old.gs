  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("sheet1");
  var dates = [];
  var times = [];
  var values = [];
  var datesWork = [];
  var works = [];
  let worksCells = [];
  for (let i = 1; i <= sheet.getLastRow(); i++) {
      var value = sheet.getRange(i, 1).getValue();
      if (value != '') {
        if (sheet.getRange(i, 2).getValue() != 5) {
          dates.push(new Date(sheet.getRange(i, 1).getValue()).getTime());
          times.push(sheet.getRange(i, 2).getValue());
          values.push(sheet.getRange(i, 3).getValue());
        } else {
          worksCells.push(i);
          datesWork.push(new Date(sheet.getRange(i, 1).getValue()).getTime());
          works.push(sheet.getRange(i, 3).getValue());
        }
      }
  }

  const sortingDates = (sort) => {
    return (
    sort.filter(function (x, i, array) {
      return array.indexOf(x) === i;
    }).sort((a, b) => {
      return a > b ? 1 : -1;
   })
   );
  }

  const packing = (mode, numArray, sortD) => {
    let retArray = [];
    let worksNum = 0;
    for (let i = 0; i < numArray.length; i++) {
      let valuesR = [];
      for (let j = 0; j < numArray[i].length; j++) {
        if (mode == 0) {
          valuesR.push([times[numArray[i][j]], values[numArray[i][j]]]);
        } else if (mode = 1) {
          worksNum++;
          valuesR.push([works[numArray[i][j]], worksNum]);
        }
      }
      retArray.push([new Date(sortD[i]), valuesR]);
    }
    return retArray;
  }
  
  const sortNums = (sortD, notSortD) => {
    let retNums = [];
    for (let i = 0; i < sortD.length; i++) {
      let num = [];
      for (let j = 0; j < notSortD.length; j++) {
        if (notSortD[j] === sortD[i]) {
          num.push(j);
        }
      }
      retNums.push(num);
    }
    return retNums;
  }

function doPost(e) {
  const string = e.postData.getDataAsString();
  
  
      /*
  const string = JSON.stringify({
         date: "2025-02-07",
         time: "1",
         value: "18",
      })
  const string = JSON.stringify({
               date: 0,
               time: 5,
               value: 1,
      })
  */
  const JsonData = JSON.parse(string);
  const date = JsonData.date;
  const time = JsonData.time;
  const value = JsonData.value;

  if (time != 5) {
  const nameArray = sheet.getRange(2 ,1, sheet.getLastRow(), 1).getValues();
  let nameArray2 = [];
  for (let i = 0; i < nameArray.length; i++) {
    nameArray2.push(new Date(nameArray[i]).getTime());
  }

  let samecell = [];
  for (let i = 0; i < nameArray.length; i++) {
    if (nameArray2[i] == new Date(date).getTime() - 32400000) {
      samecell.push(i);
    }
  }

  let setCell = sheet.getLastRow() + 1;
  if (samecell.length > 0 && time != 5) {
    for (let i = 0; i < samecell.length; i++) {
      console.log(`samecell: ${sheet.getRange(samecell[i]+1, 2).getValue()}\nJson: ${JsonData.time}`);
      if (sheet.getRange(samecell[i]+1, 2).getValue() == JsonData.time) {
        setCell = samecell[i] + 1;
      }
    }
  }

if (value != 18) {
    sheet.getRange(setCell, 1).setValue(date);
    sheet.getRange(setCell, 2).setValue(time);
    sheet.getRange(setCell, 3).setValue(value);
  }
  if (value == 18 && setCell != undefined) {
  sheet.getRange(setCell-1, 1).clear();
  sheet.getRange(setCell-1, 2).clear();
  sheet.getRange(setCell-1, 3).clear();
  }
} else if (time == 5) {
  if (date != 0) {
  let setCell = sheet.getLastRow() + 1;
  sheet.getRange(setCell, 1).setValue(date);
  sheet.getRange(setCell, 2).setValue(time);
  sheet.getRange(setCell, 3).setValue(value);
  } else {
  let sortDatesWork = sortingDates(datesWork);
  let numsWork = sortNums(sortDatesWork, datesWork);
  let worksR = packing(1, numsWork, sortDatesWork);

  let deleteWorks = [];
  let sortWorksCells = [];
  for (let i = 0; i < numsWork.length; i++) {
    for (let j = 0; j < numsWork[i].length; j++) {
      deleteWorks.push(numsWork[i][j]);
      sortWorksCells.push(worksCells[numsWork[i][j]]);
    }
  }

  sheet.getRange(sortWorksCells[value-1], 1).clear();
  sheet.getRange(sortWorksCells[value-1], 2).clear();
  sheet.getRange(sortWorksCells[value-1], 3).clear();
}
}

  var data = { valid: true };
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);
  response.setContent(JSON.stringify(data));

  return response;
}

function doGet(e) {
  let lastRow = sheet.getLastRow();
  let i2 = 2;
    const date = new Date();
  for(i2; i2<=lastRow; i2++){
    const nameCell = sheet.getRange(i2,1);
    if(nameCell.isBlank() || (new Date(date.getFullYear(), date.getMonth(), date.getDate())).getTime() > (new Date(nameCell.getValue())).getTime()){
      sheet.deleteRow(i2);
      lastRow = sheet.getLastRow();
      i2 = i2 - 1;
    }
  }

  let sortDates = sortingDates(dates);
  let sortDatesWork = sortingDates(datesWork);
  let nums = sortNums(sortDates, dates);
  let numsWork = sortNums(sortDatesWork, datesWork);

for (let i = 0; i < nums.length; i++) {
  for (let j = 0; j < nums[i].length; j++) {
      nums[i].sort((a, b) => {
        return times[a] > times[b] ? 1 : -1;
      });    
    }
  }

  let datesR = packing(0, nums, sortDates);
  let worksR = packing(1, numsWork, sortDatesWork);
  let result = [datesR, worksR];

  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);
  response.setContent(JSON.stringify(result));
  console.log(result);

  return response;
}