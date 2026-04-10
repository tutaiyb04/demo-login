export type FilterStatus =
  | "all"
  | "pending"
  | "registering"
  | "success"
  | "failed";

export interface ImportRecord {
  id: string;
  fileName: string;
  status: "未実施" | "登録中" | "成功" | "失敗";
  uploadTime: string;
  uploaderName: string;
  completionTime: string;
}

export interface Department {
  value: string;
  label: string;
}

export interface PreviewRecord {
  id: number;
  actionType: string;
  userId: string;
  firstName: string;
  kanaFirstName: string;
  lastName: string;
  kanaLastName: string;
  userCategory: string;
  deptCode: string;
  roleCode: string;
  authId: string;
  email: string;
  startDate: string;
  staffCode: string;
  remarks: string;
}
