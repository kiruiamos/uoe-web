import { getAccessToken } from './googleAuth';

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
}

export interface SheetMetadata {
  properties: {
    sheetId: number;
    title: string;
    index: number;
    gridProperties?: {
      rowCount: number;
      columnCount: number;
    };
  };
}

export interface SpreadsheetDetails {
  spreadsheetId: string;
  properties: {
    title: string;
  };
  sheets: SheetMetadata[];
  spreadsheetUrl: string;
}

const getHeaders = async () => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: Google access token not found');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Lists user spreadsheets from Google Drive
 */
export const listSpreadsheets = async (): Promise<DriveSpreadsheetFile[]> => {
  const headers = await getHeaders();
  const q = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=25`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch spreadsheets (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
};

/**
 * Get spreadsheet metadata (sheet tabs, title)
 */
export const getSpreadsheetDetails = async (spreadsheetId: string): Promise<SpreadsheetDetails> => {
  const headers = await getHeaders();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,properties.title,sheets.properties,spreadsheetUrl`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to get spreadsheet details (${res.status})`);
  }

  return res.json();
};

/**
 * Read cell values for a given range (e.g. "Sheet1!A1:Z50")
 */
export const getSheetValues = async (spreadsheetId: string, range: string): Promise<string[][]> => {
  const headers = await getHeaders();
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to read values from sheet (${res.status})`);
  }

  const data = await res.json();
  return data.values || [];
};

/**
 * Creates a new Google Spreadsheet
 */
export const createSpreadsheet = async (title: string, sheets?: string[]): Promise<SpreadsheetDetails> => {
  const headers = await getHeaders();
  const url = 'https://sheets.googleapis.com/v4/spreadsheets';

  const body: any = {
    properties: {
      title,
    },
  };

  if (sheets && sheets.length > 0) {
    body.sheets = sheets.map(sheetTitle => ({
      properties: {
        title: sheetTitle,
      },
    }));
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create spreadsheet (${res.status})`);
  }

  return res.json();
};

/**
 * Appends row values to a specific sheet range
 */
export const appendSheetValues = async (
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
): Promise<any> => {
  const headers = await getHeaders();
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ values }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to append values to sheet (${res.status})`);
  }

  return res.json();
};

/**
 * Overwrite or update cell values in a range
 */
export const updateSheetValues = async (
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
): Promise<any> => {
  const headers = await getHeaders();
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ values }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to update sheet values (${res.status})`);
  }

  return res.json();
};
