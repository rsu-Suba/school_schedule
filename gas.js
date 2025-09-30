const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
const SHEET = SPREADSHEET.getSheetByName("sheet1");
const COL_INDEX = {
    TIMESTAMP: 0,
    TYPE: 1,
    VALUE: 2,
};

const WORK_TYPE_ID = 9;
const DELETE_TRIGGER_VALUE = "18";

function processSheetData(values) {
    const normalData = [];
    const workData = [];

    values.forEach((row, index) => {
        const timestampStr = row[COL_INDEX.TIMESTAMP];
        if (!timestampStr) return;

        const timestamp = new Date(timestampStr).getTime();
        const type = row[COL_INDEX.TYPE];
        const value = row[COL_INDEX.VALUE];

        if (type !== WORK_TYPE_ID) {
            normalData.push({ timestamp, type, value });
        } else {
            workData.push({ timestamp, value, rowIndex: index + 1 });
        }
    });

    return { normalData, workData };
}

function groupAndFormatData(data, isWorkData = false) {
    if (!data || data.length === 0) {
        return [];
    }

    const grouped = data.reduce((map, item) => {
        const key = new Date(item.timestamp).setHours(0, 0, 0, 0);
        if (!map.has(key)) {
            map.set(key, []);
        }
        const entry = isWorkData ? [item.value, item.rowIndex] : [item.type, item.value];
        map.get(key).push(entry);
        return map;
    }, new Map());
    const sorted = [...grouped.entries()].sort((a, b) => a[0] - b[0]);
    return sorted.map(([date, values]) => [new Date(date), values]);
}

function deleteOldRows() {
    const lastRow = SHEET.getLastRow();
    if (lastRow === 0) return;

    const allData = SHEET.getDataRange().getValues();
    const today = new Date().setHours(0, 0, 0, 0);

    const dataToKeep = allData.filter((row) => {
        const timestamp = row[COL_INDEX.TIMESTAMP];
        return timestamp && new Date(timestamp).getTime() >= today;
    });
    SHEET.clearContents();
    if (dataToKeep.length > 0) {
        SHEET.getRange(1, 1, dataToKeep.length, dataToKeep[0].length).setValues(dataToKeep);
    }
}

function doGet() {
    const cache = CacheService.getScriptCache();
    const cacheKey = "all_data_v1";
    const cached = cache.get(cacheKey);
    if (cached != null) {
        return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);
    }

    const values = SHEET.getLastRow() > 0 ? SHEET.getDataRange().getValues() : [];
    if (values.length === 0) {
        const emptyResult = JSON.stringify([[], []]);
        cache.put(cacheKey, emptyResult, 300);
        return ContentService.createTextOutput(emptyResult).setMimeType(ContentService.MimeType.JSON);
    }
    const { normalData, workData } = processSheetData(values);
    const result = [groupAndFormatData(normalData, false), groupAndFormatData(workData, true)];
    const resultString = JSON.stringify(result);
    cache.put(cacheKey, resultString, 900);

    return ContentService.createTextOutput(resultString).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    try {
        const { date, time, value } = JSON.parse(e.postData.getDataAsString());
        const isUpdateOrDelete =
            value === DELETE_TRIGGER_VALUE || (date == 0 && time == WORK_TYPE_ID) || time != WORK_TYPE_ID;
        if (!isUpdateOrDelete) {
            SHEET.appendRow([date, time, value]);
            CacheService.getScriptCache().remove("all_data_v1");
            return ContentService.createTextOutput(JSON.stringify({ valid: true, action: "append" })).setMimeType(
                ContentService.MimeType.JSON
            );
        }

        const lastRow = SHEET.getLastRow();
        let currentData = lastRow > 0 ? SHEET.getDataRange().getValues() : [];
        let dataModified = false;

        const inputTimestamp = new Date(date).getTime();

        if (value === DELETE_TRIGGER_VALUE) {
            currentData = currentData.filter((row) => {
                const rowTimestamp = new Date(row[COL_INDEX.TIMESTAMP]).getTime();
                return !(rowTimestamp === inputTimestamp && row[COL_INDEX.TYPE] == time);
            });
            dataModified = true;
        } else if (date == 0 && time == WORK_TYPE_ID) {
            const { workData } = processSheetData(currentData);
            const sortedWorkData = workData.sort((a, b) => a.timestamp - b.timestamp);

            const targetIndex = parseInt(value, 10) - 1;
            if (sortedWorkData[targetIndex]) {
                const rowToDelete = sortedWorkData[targetIndex].rowIndex;
                currentData = currentData.filter((row, index) => index + 1 !== rowToDelete);
                dataModified = true;
            }
        }

        if (!dataModified) {
            if (time != WORK_TYPE_ID) {
                currentData = currentData.filter((row) => {
                    const rowTimestamp = new Date(row[COL_INDEX.TIMESTAMP]).getTime();
                    return !(rowTimestamp === inputTimestamp && row[COL_INDEX.TYPE] == time);
                });
            }
            currentData.push([date, time, value]);
        }

        SHEET.clearContents();
        if (currentData.length > 0) {
            SHEET.getRange(1, 1, currentData.length, currentData[0].length).setValues(currentData);
        }
        CacheService.getScriptCache().remove("all_data_v1");

        return ContentService.createTextOutput(JSON.stringify({ valid: true, action: "rewrite" })).setMimeType(
            ContentService.MimeType.JSON
        );
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ valid: false, error: error.message })).setMimeType(
            ContentService.MimeType.JSON
        );
    }
}

function setupTrigger() {
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        if (trigger.getHandlerFunction() === "deleteOldRows") {
            ScriptApp.deleteTrigger(trigger);
        }
    }
    ScriptApp.newTrigger("deleteOldRows").timeBased().atHour(2).everyDays(1).create();
}
