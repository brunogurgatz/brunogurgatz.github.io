const SHEET_NAME = "Visitas por página e hora";
const TIME_ZONE = "America/Sao_Paulo";
const SPREADSHEET_ID_PROPERTY = "SPREADSHEET_ID";
const HEADERS = [
  `Hora (${TIME_ZONE})`,
  "Página",
  "Carregamentos de página (não visitantes únicos)"
];

function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("Abra este script a partir da planilha: Extensões > Apps Script.");
  }

  PropertiesService.getScriptProperties()
    .setProperty(SPREADSHEET_ID_PROPERTY, spreadsheet.getId());

  const sheet = getOrCreateSheet_(spreadsheet);
  ensureHeaders_(sheet);
}

function doGet(event) {
  const page = event && event.parameter ? event.parameter.page : "";
  if (typeof page !== "string" || page.length > 2048 || !/^\/(?!\/)[^\s?#]*$/.test(page)) {
    return ContentService.createTextOutput("Invalid page path");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheetId = PropertiesService.getScriptProperties()
      .getProperty(SPREADSHEET_ID_PROPERTY);
    if (!spreadsheetId) {
      throw new Error("A planilha não foi configurada. Execute setup() antes de implantar o Web App.");
    }

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = getOrCreateSheet_(spreadsheet);
    ensureHeaders_(sheet);
    recordPageview_(sheet, page);
    return ContentService.createTextOutput("OK");
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet_(spreadsheet) {
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    return;
  }

  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  if (HEADERS.some((header, index) => currentHeaders[index] !== header)) {
    throw new Error(`Os cabeçalhos da aba "${SHEET_NAME}" não correspondem ao formato esperado.`);
  }
}

function recordPageview_(sheet, page) {
  const hour = Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd HH:00");
  const lastRow = sheet.getLastRow();
  let matchingRow = null;

  if (lastRow > 1) {
    const hourCells = sheet.getRange(2, 1, lastRow - 1, 1)
      .createTextFinder(hour)
      .matchEntireCell(true)
      .findAll();

    if (hourCells.length > 0) {
      let firstRow = hourCells[0].getRow();
      let finalRow = firstRow;
      hourCells.forEach((cell) => {
        firstRow = Math.min(firstRow, cell.getRow());
        finalRow = Math.max(finalRow, cell.getRow());
      });

      const pages = sheet.getRange(firstRow, 2, finalRow - firstRow + 1, 1)
        .getDisplayValues();
      for (const cell of hourCells) {
        if (pages[cell.getRow() - firstRow][0] === page) {
          matchingRow = cell.getRow();
          break;
        }
      }
    }
  }

  if (matchingRow !== null) {
    const countCell = sheet.getRange(matchingRow, 3);
    const currentCount = Number(countCell.getValue());
    if (!Number.isInteger(currentCount) || currentCount < 1) {
      throw new Error(`Contagem inválida na linha ${matchingRow} da aba "${SHEET_NAME}".`);
    }
    countCell.setValue(currentCount + 1);
    return;
  }

  const newRow = lastRow + 1;
  sheet.getRange(newRow, 1, 1, 2).setNumberFormat("@");
  sheet.getRange(newRow, 1, 1, HEADERS.length).setValues([[hour, page, 1]]);
}
