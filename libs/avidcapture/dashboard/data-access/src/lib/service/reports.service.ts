import { Injectable } from '@angular/core';
import { ExceljsType } from '@ui-coe/avidcapture/shared/types';
import { Row, Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private workBook: Workbook = new Workbook();
  private workSheet: Worksheet;

  generateTransactionCountByEntityReport(
    headers: string[],
    data: string[][][],
    reportName: string,
    customerRow: string[],
    dateSpan: string[]
  ): void {
    this.workSheet = this.workBook.addWorksheet(reportName, {
      views: [{ showGridLines: false }],
    });

    this.workSheet.addRow([]);
    this.workSheet.addRow([
      `*Report contains invoice counts from ${DateTime.fromJSDate(
        new Date(dateSpan[0])
      ).toLocaleString(DateTime.DATE_SHORT)} 12:00 AM through ${DateTime.fromJSDate(
        new Date(dateSpan[1])
      ).toLocaleString(DateTime.DATE_SHORT)} 11:59 PM`,
    ]);
    this.workSheet.addRow([]);

    this.addHeaderRow(headers);
    this.addCustomerRow(customerRow);
    this.addTransactionByEntityDataRows(data);
    this.addCustomerRow(customerRow);

    this.workSheet.addRow([]);
    this.workSheet.addRow([`Execution time: ${DateTime.local().toFormat('dd MMM y h:mma ZZZZ')}`]);

    this.workSheet.columns.forEach(column => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength;
    });

    this.exportReport(reportName);

    this.workBook.removeWorksheet(this.workSheet.id);
  }

  private async exportReport(reportName: string): Promise<void> {
    await this.workBook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], {
        type: ExceljsType.sheet,
      });

      fs.saveAs(blob, `${reportName}.xlsx`);
    });
  }

  private addHeaderRow(headers: string[]): void {
    const headerRow = this.workSheet.addRow(headers);

    headerRow.height = 40;

    headerRow.font = {
      name: 'Calibri',
      family: 4,
      size: 11,
      bold: true,
      color: { argb: 'FFFFFF' },
    };

    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '004E74' },
      };

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });
  }

  private addCustomerRow(customerRow: string[]): void {
    const row = this.workSheet.addRow(customerRow);

    row.font = {
      name: 'Calibri',
      family: 4,
      size: 11,
      bold: true,
      color: { argb: '000000' },
    };

    row.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '01A14D' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    });
  }

  private addTransactionByEntityDataRows(data: string[][][]): void {
    data.forEach((monthData, i) => {
      this.addMonthRow(monthData[i]);
      monthData.forEach(d => {
        const dataRow = this.workSheet.addRow(d);

        dataRow.font = {
          name: 'Calibri',
          family: 4,
          size: 9,
          bold: false,
          color: { argb: '000000' },
        };

        dataRow.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };

          cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        });
      });
    });
  }

  private addMonthRow(months: string[]): void {
    if (months && months.length > 0) {
      const monthRow = this.workSheet.addRow(['-', months[1], '', '', '', '', '']);

      monthRow.font = {
        name: 'Calibri',
        family: 4,
        size: 11,
        bold: true,
        color: { argb: '000000' },
      };

      monthRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'AFEEED' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      });
    }
  }
}
