import { TdTimelineItemProps } from 'tdesign-vue-next';

export interface AuditItem extends Object {
  // 自增id
  id: number;
  // 高级审批，即只有审批人可以审批
  advance_approval: number;
  // 创建时间
  created_at: string;
  // 当前审批阶段
  current_step: number;
  // 审批详情
  details: AuditDetail;
  // 审批记录
  records: AuditRecordItem[];
  // 审批状态（0待处理，1通过，2拒绝，3取消）
  status: number;
  // 审批步骤
  steps: AuditStepItem[];
  // 审批类型（1:设备借出, 2:上网审批, 3:任务，4:其他）
  type: number;
  // 更新时间
  updated_at: string;
  // 申请人
  user_code: string;
  // 非审批人是否可见
  visible_allow: boolean;
}

export interface AuditRecordItem {
  // 自增id
  id: number;
  // 操作（0待审，1同意，2拒绝）
  action: number;
  // 外键，关联 approval_application.id
  application_id: number;
  // 审批时间
  approved_at: string;
  // 审批人Code
  approver_user_code: string;
  // 审批意见
  comment: string;
  // 该记录是否废弃
  discard: boolean;
  // 审批步骤
  step: number;
}

export interface AuditStepItem {
  // 自增id
  id?: number;
  // 外键，关联 approval_application.id
  application_id?: number;
  // 审批人Code
  approver_user_code: string;
  // 创建时间
  created_at?: string;
  // 步骤顺序
  step_order: number;
  // 多人同步审批配置，or为或，and为与多人同步审批配置，or为或，and为与，mixed为混合
  required_type: 'and' | 'or' | 'mixed';
  // 审批流程混合审批逻辑
  rule_expression: string;
}

export interface AuditDetail {
  // 自增id
  id: number;
  // 外键，关联 approval_application.id
  application_id: number;
  // 审批名称
  content: string;
  // 审批详情，以JSON格式存储不同类型的具体信息
  details: string; // AuditDetailItem
  // 其他补充信息
  other_info: string;
}

export type AuditDetailItem = AuditDetailOfLend | AuditDetailOfNetworkPortal | AuditDetailOfTask | AuditDetailOfOther;

export interface AuditDetailOfLend {
  eq_code: string;
  lend_time: string;
  return_time: string;
  lender: string;
}

export interface AuditDetailOfNetworkPortal {
  ip: string;
  mac: string;
  info: string;
  timestamp: string;
}

export interface AuditDetailOfTask {
  // 操作字段
  operate_type?: 'add' | 'edit' | 'del';
  id?: number;
  content: string;
  create_user: string;
  equipment: string;
  finally_time: string;
  name: string;
  place: string;
  remark: string;
  status: number;
  type: number;
  user: string[];
  weight: number;
  work_time: string[];
}

export interface AuditDetailOfOther {
  content: string;
  extra: string;
  key: string;
  value: string;
}

export type AuditItems = AuditItem[];

export interface AuditTimeLine {
  total: number;
  current: number;
  options: TdTimelineItemProps[];
}

export interface ApprovalPreviewStepData {
  approvalEquipment: {
    approver: string;
    eq_code: string;
    eq_name: string;
  }[];
  groupPosition: [];
  positions: {
    group_id: null | number;
    id: number;
    isAdmin: 0 | 1;
    isOwner: 0 | 1;
    name: string;
    type: 0 | 1;
  }[];
  rule_expression: string;
  stepList: {
    BZ: string[];
    GL: string[];
    JS: string[];
  };
  userPositions: {
    position_id: number;
    user_id: number;
  }[];
}
