import type { Dayjs } from "dayjs";

export interface UserFormState {
  userId: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  departmentCode: string | null;
  positionCode: string | null;
  email: string;
  startDate: Dayjs | null;
  staffCode: string;
  remarks: string;
  role: string | null;
  isApproval: boolean;
  canProxyApply: boolean;
  canProxyApprove: boolean;
}

export interface UserRecord {
  key: string;
  userId: string;
  userCode: string;
  lastName: string;
  lastNameKana: string;
  name: string;
  nameKana: string;
  departmentCode: string;
  departmentName: string;
  roleCode: string;
  roleName: string;
  manager: string;
  searchCode: string;
  usage: string;
  email: string;
  staffCode: string;
  remarks: string;
  otherName: string;
  lastLogin: string;
}
