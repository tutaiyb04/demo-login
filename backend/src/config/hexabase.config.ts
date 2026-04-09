import { registerAs } from '@nestjs/config';

export default registerAs('hexabase', () => ({
  projectId: process.env.HEXABASE_PROJECT_ID || '',
  userDatastoreId: process.env.HEXABASE_USER_DATASTORE_ID || '',
  departmentDatastoreId: process.env.HEXABASE_DEPARTMENT_DATASTORE_ID || '',
  positionDatastoreId: process.env.HEXABASE_POSITION_DATASTORE_ID || '',
  roleDatastoreId: process.env.HEXABASE_ROLE_DATASTORE_ID || '',
  workspaceId: process.env.HEXABASE_WORKSPACE_ID || '',
  groupId: process.env.HEXABASE_GROUP_ID || '',
  isApproverTrueOptionId: process.env.IS_APPROVER_TRUE_OPTION_ID || '',
  isApproverFalseOptionId: process.env.IS_APPROVER_FALSE_OPTION_ID || '',
  canProxyApplyTrueOptionId: process.env.CAN_PROXY_APPLY_TRUE_OPTION_ID || '',
  canProxyApplyFalseOptionId: process.env.CAN_PROXY_APPLY_FALSE_OPTION_ID || '',
  canProxyApproveTrueOptionId:
    process.env.CAN_PROXY_APPROVE_TRUE_OPTION_ID || '',
  canProxyApproveFalseOptionId:
    process.env.CAN_PROXY_APPROVE_FALSE_OPTION_ID || '',
}));
