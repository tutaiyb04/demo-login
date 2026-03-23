export interface TableSorter {
  column: any;
  columnKey?: string;
  field?: string;
  order?: "ascend" | "descend" | null;
}

export interface NewsItem {
  id: number;
  date: string;
  title: string;
}

export interface ApprovalTaskRecord {
  key: string;
  applicationDate: string;
  applicant: string;
  type: string;
  title: string;
}

export interface TaskRecord {
  key: string;
  status: string;
  type: string;
  title: string;
  approver: string;
  updatedAt: string;
}
