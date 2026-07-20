/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Adapter for Google Sheets integration. Supports creating dashboards and tables.
 */
export class GoogleSheetsAdapter {
  private static mockLatency() {
    return new Promise(resolve => setTimeout(resolve, 90));
  }

  /**
   * Appends a log line to a Google Sheet spreadsheet (e.g. tracking submissions or reservations).
   */
  public async appendRow(
    spreadsheetId: string,
    range: string,
    values: any[]
  ): Promise<boolean> {
    await GoogleSheetsAdapter.mockLatency();
    console.info(`[GoogleSheetsAdapter] Appending row to Sheet ID "${spreadsheetId}" range "${range}":`, values);
    return true;
  }

  /**
   * Overwrites/initializes a sheet tab with headers and row blocks.
   */
  public async overwriteSheet(
    spreadsheetId: string,
    sheetName: string,
    headers: string[],
    rows: any[][]
  ): Promise<{ success: boolean; updatedRange: string }> {
    await GoogleSheetsAdapter.mockLatency();
    const updatedRange = `'${sheetName}'!A1:${String.fromCharCode(64 + headers.length)}${rows.length + 1}`;
    console.info(`[GoogleSheetsAdapter] Overwrote sheet "${sheetName}" in doc "${spreadsheetId}". Synced ${rows.length} records.`);
    return { success: true, updatedRange };
  }
}

export const GlobalGoogleSheetsAdapter = new GoogleSheetsAdapter();
