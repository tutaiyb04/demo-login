export interface ValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

export type CsvRow = Record<string, unknown>;

export type ImportStatusInHexabase =
  | 'Uploaded'
  | 'Processing'
  | 'Registered'
  | 'Failed';

export type ImportListStatusFilter =
  | 'all'
  | 'uploaded'
  | 'processing'
  | 'registered'
  | 'failed';
