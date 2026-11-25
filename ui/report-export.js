import {
  AlignmentType, Document, Footer, HeadingLevel, Packer, PageNumber, PageOrientation, Paragraph,
  Table, TableCell, TableLayoutType, TableRow, TextRun, VerticalAlign, WidthType
} from 'docx';
import ExcelJS from 'exceljs';
import pdfMake from 'pdfmake/build/pdfmake.js';
import fonts from 'pdfmake/build/vfs_fonts.js';

const navy = '183153';
const light = 'F0F5FA';
const ink = '24364B';
const border = 'CBD8E6';

function columnWeight(label) {
  if (label === 'Họ và tên') return 2.7;
  if (/nộp/.test(label)) return 2;
  if (/^(STT|Hạng|Lớp|Khối)$/.test(label)) return 0.7;
  if (/Thời gian/.test(label)) return 1.4;
  return 1.15;
}

function alignedLeft(label) {
  return label === 'Họ và tên';
}

function wordFile({ title, subtitle, headers, values, widths }) {
  const margins = { top: 720, bottom: 720, left: 720, right: 720 };
  const pageSize = { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE };
  const tableWidth = pageSize.height - margins.left - margins.right;
  const columnWidths = widths.map(width => Math.floor(width * tableWidth));
  const rows = [headers, ...values].map((row, index) => new TableRow({
    tableHeader: index === 0,
    cantSplit: true,
    children: row.map((value, col) => new TableCell({
      width: { size: columnWidths[col], type: WidthType.DXA },
      shading: { fill: index === 0 ? navy : index % 2 ? 'FFFFFF' : light },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: alignedLeft(headers[col]) ? AlignmentType.LEFT : AlignmentType.CENTER,
        children: [new TextRun({
          text: String(value ?? ''), bold: index === 0,
          color: index === 0 ? 'FFFFFF' : ink
        })]
      })]
    }))
  }));
  const line = { style: 'single', size: 4, color: border };
  return Packer.toBlob(new Document({
    title,
    styles: { default: { document: { run: { font: 'Arial', size: 19 } } } },
    sections: [{
      properties: { page: { size: pageSize, margin: margins } },
      footers: { default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ children: ['Trang ', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES] })]
      })] }) },
      children: [
        new Paragraph({ text: title, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: subtitle, alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
        new Table({
          rows, columnWidths, layout: TableLayoutType.FIXED,
          width: { size: tableWidth, type: WidthType.DXA },
          margins: { top: 85, bottom: 85, left: 80, right: 80 },
          borders: { top: line, bottom: line, left: line, right: line, insideHorizontal: line, insideVertical: line }
        }),
        ...(values.length ? [] : [new Paragraph({ text: 'Không có dữ liệu.', spacing: { before: 160 } })])
      ]
    }]
  }));
}

async function excelFile({ title, subtitle, headers, values }) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Báo cáo', {
    views: [{ state: 'frozen', ySplit: 4, showGridLines: false }],
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, printTitlesRow: '4:4' }
  });
  sheet.columns = headers.map(label => ({ width: Math.max(label.length + 3, columnWeight(label) * 13) }));
  sheet.mergeCells(1, 1, 1, headers.length);
  sheet.mergeCells(2, 1, 2, headers.length);
  sheet.getCell('A1').value = title;
  sheet.getCell('A1').font = { name: 'Arial', size: 17, bold: true, color: { argb: 'FF' + navy } };
  sheet.getCell('A2').value = subtitle;
  sheet.getCell('A2').font = { name: 'Arial', size: 10, color: { argb: 'FF' + ink } };
  sheet.getCell('A2').alignment = { vertical: 'middle', wrapText: true };
  sheet.getRow(1).height = 30;
  sheet.getRow(2).height = 25;
  [headers, ...values].forEach((row, index) => {
    const excelRow = sheet.getRow(index + 4);
    excelRow.height = index === 0 ? 32 : 30;
    row.forEach((value, col) => {
      const cell = excelRow.getCell(col + 1);
      cell.value = value ?? '';
      if (index > 0 && /\(%\)|Tỉ lệ/.test(headers[col]) && typeof value === 'string' && /^\d+(\.\d+)?%$/.test(value)) {
        cell.value = Number(value.slice(0, -1)) / 100;
        cell.numFmt = '0%';
      }
      if (index > 0 && typeof value === 'number' && /^Điểm/.test(headers[col])) cell.numFmt = '0.0#';
      cell.font = { name: 'Arial', size: 10, bold: index === 0, color: { argb: 'FF' + (index === 0 ? 'FFFFFF' : ink) } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (index === 0 ? navy : index % 2 ? 'FFFFFF' : light) } };
      cell.alignment = { vertical: 'middle', horizontal: alignedLeft(headers[col]) ? 'left' : 'center', wrapText: true };
    });
  });
  if (values.length) sheet.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4 + values.length, column: headers.length } };
  else sheet.getCell('A5').value = 'Không có dữ liệu.';
  return new Blob([await workbook.xlsx.writeBuffer()], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

function pdfFile({ title, subtitle, headers, values, widths }) {
  pdfMake.addVirtualFileSystem(fonts);
  const body = [headers, ...values].map((row, index) => row.map((value, col) => ({
    text: String(value ?? ''),
    bold: index === 0,
    color: index === 0 ? '#FFFFFF' : '#' + ink,
    alignment: alignedLeft(headers[col]) ? 'left' : 'center',
    fillColor: '#' + (index === 0 ? navy : index % 2 ? 'FFFFFF' : light)
  })));
  return pdfMake.createPdf({
    info: { title },
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [36, 32, 36, 38],
    defaultStyle: { fontSize: 9 },
    footer: (page, count) => ({ text: `Trang ${page} / ${count}`, alignment: 'right', margin: [36, 8, 36, 0], color: '#' + ink }),
    content: [
      { text: title, fontSize: 19, bold: true, alignment: 'center', margin: [0, 0, 0, 6] },
      { text: subtitle, fontSize: 10, alignment: 'center', margin: [0, 0, 0, 16] },
      {
        layout: {
          hLineColor: () => '#' + border, vLineColor: () => '#' + border,
          paddingTop: () => 5, paddingBottom: () => 5
        },
        table: { headerRows: 1, dontBreakRows: true, widths: widths.map(width => Math.floor(width * (768 - 9 * headers.length))), body }
      },
      ...(values.length ? [] : [{ text: 'Không có dữ liệu.', margin: [0, 8, 0, 0] }])
    ]
  }).getBlob();
}

export function createReportFile(format, { title, scope, rows }) {
  const [headers, ...values] = rows;
  const weights = headers.map(columnWeight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const report = {
    title, headers, values,
    subtitle: `${scope}  •  ${values.length.toLocaleString('vi-VN')} dòng dữ liệu`,
    widths: weights.map(weight => weight / total)
  };
  if (format === 'docx') return wordFile(report);
  if (format === 'xlsx') return excelFile(report);
  return pdfFile(report);
}
