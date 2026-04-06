import { registerAs } from '@nestjs/config';

export default registerAs('hexabase', () => ({
  projectId: process.env.HEXABASE_PROJECT_ID || '',
  userDatastoreId: process.env.HEXABASE_USER_DATASTORE_ID || '',
  departmentDatastoreId: process.env.HEXABASE_DEPARTMENT_DATASTORE_ID || '',
  positionDatastoreId: process.env.HEXABASE_POSITION_DATASTORE_ID || '',
  workspaceId: process.env.HEXABASE_WORKSPACE_ID || '',
  groupId: process.env.HEXABASE_GROUP_ID || '',
  isApproverOptionId: process.env.IS_APPROVER_OPTION_ID || '',
  canProxyApplyOptionId: process.env.CAN_PROXY_APPLY_OPTION_ID || '',
  canProxyApproveOptionId: process.env.CAN_PROXY_APPROVE_OPTION_ID || '',
}));
