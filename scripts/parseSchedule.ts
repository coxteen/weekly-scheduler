import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ParsedEvent {
  day: string;
  dayIndex: number;
  startTime: string;
  endTime: string;
  title: string;
}

const WEEKDAY_NAMES = [
  'Luni',
  'Marți',
  'Miercuri',
  'Joi',
  'Vineri',
  'Sâmbătă',
  'Duminică',
];

const IGNORED_COLUMN_KEYWORDS = [
  'data',
  'eveniment',
  'tip de voluntar',
  'final responsabil',
  'responsabil',
  'note',
  'observatii',
];

const IGNORED_CONTENT_KEYWORDS = [
  'tipuri de voluntari',
  'persoana care este final responsabilă',
  'responsabil',
  'aranjat de sală',
];

function getSafeCellValue(cell: ExcelJS.Cell): string {
  try {
    const val = cell.value;
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val.trim();
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (val instanceof Date) return val.toISOString();

    if (typeof val === 'object') {
      if ('richText' in val && Array.isArray(val.richText)) {
        return val.richText.map((item) => item.text || '').join('').trim();
      }
      if ('result' in val && val.result !== null && val.result !== undefined) {
        return String(val.result).trim();
      }
      if ('text' in val && typeof val.text === 'string') {
        return val.text.trim();
      }
    }
    return '';
  } catch {
    return '';
  }
}

function parseCellAddress(address: string): { col: number; row: number } {
  const match = address.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return { col: 1, row: 1 };
  const colLetters = match[1].toUpperCase();
  const row = parseInt(match[2], 10);

  let col = 0;
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 64);
  }
  return { col, row };
}

function isDayColumn(headerName: string): boolean {
  const normalized = headerName.trim().toLowerCase();
  if (!normalized) return false;
  if (IGNORED_COLUMN_KEYWORDS.some((kw) => normalized.includes(kw))) {
    return false;
  }
  const isNumericDay = /^\d{1,2}$/.test(normalized);
  const isDayName = /^(luni|mar[tț]i|miercuri|joi|vineri|s[aâ]mb[aă]t[aă]|duminic[aă])/i.test(normalized);
  return isNumericDay || isDayName;
}

function isAdministrativeText(text: string): boolean {
  const lower = text.toLowerCase();
  return IGNORED_CONTENT_KEYWORDS.some((kw) => lower.includes(kw));
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map((s) => parseInt(s, 10));
  return (h || 0) * 60 + (m || 0);
}

async function parseScheduleXlsx(inputFilePath: string, outputFilePath: string): Promise<void> {
  if (!fs.existsSync(inputFilePath)) {
    console.error(`❌ Fișierul nu a fost găsit la: ${inputFilePath}`);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputFilePath);

  if (workbook.worksheets.length === 0) {
    console.error('❌ Documentul nu conține foi de calcul.');
    return;
  }

  const worksheet = workbook.worksheets[0];
  console.log(`📄 Se procesează tab-ul: "${worksheet.name}"...`);

  // 1. Mapăm intervalele orare din coloana 1
  const rowTimeMap = new Map<number, { start: string; end: string }>();
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    const rawTime = getSafeCellValue(row.getCell(1));
    if (rawTime && rawTime.includes('-') && /\d{1,2}:\d{2}/.test(rawTime)) {
      const [start, end] = rawTime.split('-').map((s) => s.trim());
      rowTimeMap.set(rowNumber, { start, end: end || start });
    }
  });

  // 2. Identificăm coloanele asociate zilelor din antet
  const dayColumns: { colIndex: number; dayName: string; dayIndex: number }[] = [];
  const headerRow = worksheet.getRow(1);
  let daySequenceIndex = 0;

  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const headerText = getSafeCellValue(cell);
    if (colNumber > 1 && isDayColumn(headerText)) {
      const mappedName = WEEKDAY_NAMES[daySequenceIndex % WEEKDAY_NAMES.length] || headerText;
      dayColumns.push({
        colIndex: colNumber,
        dayName: mappedName,
        dayIndex: daySequenceIndex,
      });
      daySequenceIndex++;
    }
  });

  const colToDayMap = new Map<number, { dayName: string; dayIndex: number }>();
  dayColumns.forEach((d) => colToDayMap.set(d.colIndex, { dayName: d.dayName, dayIndex: d.dayIndex }));

  // Dicționar pentru căutare rapidă zi după dayIndex
  const indexToDayMap = new Map<number, string>();
  dayColumns.forEach((d) => indexToDayMap.set(d.dayIndex, d.dayName));

  // 3. Extragem zonele comasate (merges)
  const rawMerges = (worksheet.model as { merges?: string[] })?.merges || [];
  const processedMergedCells = new Set<string>();
  const allEvents: ParsedEvent[] = [];

  for (const mergeRange of rawMerges) {
    const [startRef, endRef] = mergeRange.split(':');
    const startCoord = parseCellAddress(startRef);
    const endCoord = parseCellAddress(endRef);
    const masterCell = worksheet.getCell(startRef);
    const masterText = getSafeCellValue(masterCell).replace(/\r?\n|\r/g, ' ');

    if (!masterText || isAdministrativeText(masterText) || startCoord.row === 1) {
      continue;
    }

    const startDay = colToDayMap.get(startCoord.col);
    const endDay = colToDayMap.get(endCoord.col);

    // Marcăm toate celulele fizice din merge ca fiind procesate
    for (let r = startCoord.row; r <= endCoord.row; r++) {
      for (let c = startCoord.col; c <= endCoord.col; c++) {
        processedMergedCells.add(`${c}:${r}`);
      }
    }

    const startTime = rowTimeMap.get(startCoord.row)?.start;
    const endTime = rowTimeMap.get(endCoord.row)?.end || rowTimeMap.get(startCoord.row)?.end;

    if (!startTime || !endTime) continue;

    if (startDay && endDay) {
      const minDayIdx = Math.min(startDay.dayIndex, endDay.dayIndex);
      const maxDayIdx = Math.max(startDay.dayIndex, endDay.dayIndex);

      // Multiplicăm evenimentul în fiecare zi din intervalul acoperit
      for (let dIdx = minDayIdx; dIdx <= maxDayIdx; dIdx++) {
        const dayName = indexToDayMap.get(dIdx) || WEEKDAY_NAMES[dIdx % WEEKDAY_NAMES.length];
        allEvents.push({
          day: dayName,
          dayIndex: dIdx,
          startTime,
          endTime,
          title: masterText,
        });
      }
    } else if (startDay) {
      allEvents.push({
        day: startDay.dayName,
        dayIndex: startDay.dayIndex,
        startTime,
        endTime,
        title: masterText,
      });
    }
  }

  // 4. Extragem celulele simple (care nu fac parte dintr-un merge)
  for (const day of dayColumns) {
    let r = 2;
    const maxRow = worksheet.actualRowCount;

    while (r <= maxRow) {
      const cellKey = `${day.colIndex}:${r}`;
      if (processedMergedCells.has(cellKey)) {
        r++;
        continue;
      }

      const cell = worksheet.getRow(r).getCell(day.colIndex);
      const text = getSafeCellValue(cell).replace(/\r?\n|\r/g, ' ');

      if (!text || isAdministrativeText(text)) {
        r++;
        continue;
      }

      const startRow = r;
      let endRow = r;

      let lookahead = r + 1;
      while (lookahead <= maxRow) {
        if (processedMergedCells.has(`${day.colIndex}:${lookahead}`)) break;
        const nextCell = worksheet.getRow(lookahead).getCell(day.colIndex);
        const nextText = getSafeCellValue(nextCell).replace(/\r?\n|\r/g, ' ');

        if (nextText === text) {
          endRow = lookahead;
          lookahead++;
        } else {
          break;
        }
      }
      r = endRow + 1;

      const startTime = rowTimeMap.get(startRow)?.start;
      const endTime = rowTimeMap.get(endRow)?.end || rowTimeMap.get(startRow)?.end;

      if (startTime && endTime) {
        allEvents.push({
          day: day.dayName,
          dayIndex: day.dayIndex,
          startTime,
          endTime,
          title: text,
        });
      }
    }
  }

  // 5. Grupăm pe zile și ordonăm cronologic
  const groupedByDay = allEvents.reduce((acc, ev) => {
    if (!acc[ev.day]) acc[ev.day] = [];
    acc[ev.day].push(ev);
    return acc;
  }, {} as Record<string, ParsedEvent[]>);

  const outputBlocks: string[] = [`TAB SELECTAT: "${worksheet.name}"`];

  WEEKDAY_NAMES.forEach((dayName) => {
    const events = groupedByDay[dayName];
    if (events && events.length > 0) {
      // Sortare cronologică: evenimentele de dimineață primele
      events.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

      outputBlocks.push(`\n[${dayName.toUpperCase()}]`);
      events.forEach((ev) => {
        outputBlocks.push(`  ${ev.startTime} - ${ev.endTime} | ${ev.title}`);
      });
    }
  });

  const finalOutput = outputBlocks.join('\n');
  fs.writeFileSync(outputFilePath, finalOutput, 'utf-8');
  console.log(`✅ Succes! S-au extras și distribuit ${allEvents.length} evenimente în: ${outputFilePath}`);
}

const inputPath = process.argv[2] || path.join(__dirname, '../schedule.xlsx');
const outputPath = path.join(__dirname, '../parsed-schedule.txt');

parseScheduleXlsx(inputPath, outputPath).catch((err) => {
  console.error('❌ Eroare la parsare:', err);
});