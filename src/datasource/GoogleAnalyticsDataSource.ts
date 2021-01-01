/**
 * Google Analytics データソース
 */
class GoogleAnalyticsDataSource {
  private sheet: GoogleAppsScript.Spreadsheet.Sheet;

  /**
   * コンストラクタ
   */
  constructor(spreadSheetUrl: string, sheetName: string) {
    const spreadSheet = SpreadsheetApp.openByUrl(spreadSheetUrl);
    const sheet: GoogleAppsScript.Spreadsheet.Sheet | null = spreadSheet.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("spreadSheet cant't read");
    }
    this.sheet = sheet;
  }

  /**
   * レポートリスト取得
   */
  get reportList(): { title: string; text: string }[] {
    // const startrow = 1;
    const startrow = 2;
    // const startcol = 1;
    const lastrow: number = this.sheet.getLastRow();
    const lastcol: number = this.sheet.getLastColumn();
    const startcol: number = lastcol;

    const data = this.sheet
      .getSheetValues(startrow, startcol, lastrow, lastcol)
      .map((item) => item.join(''))
      .filter((item) => item.length);
    const reportList: { title: string; text: string[] }[] = [];
    let index = 0;
    const separator = '---';
    data.forEach((row) => {
      if (row === separator) {
        index += 1;
        return;
      }
      if (!reportList[index]) {
        reportList[index] = {
          title: row,
          text: [],
        };
      } else {
        reportList[index].text.push(row);
      }
    });

    return reportList.map(({ title, text }: { title: string; text: string[] }): {
      title: string;
      text: string;
    } => ({
      title,
      text: text.join('\n'),
    }));
  }
}

export { GoogleAnalyticsDataSource };
