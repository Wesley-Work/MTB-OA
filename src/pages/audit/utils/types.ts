import { APPROVAL_TYPE, AUDIT_STATUS, THEME_COLOR, ICON_TYPE } from './constants';
import { AuditItem, AuditRecordItem } from '../type';
import { VNode } from 'vue';

// 常量类型
export type ApprovalType = typeof APPROVAL_TYPE[keyof typeof APPROVAL_TYPE];
export type AuditStatus = typeof AUDIT_STATUS[keyof typeof AUDIT_STATUS];
export type ThemeColor = typeof THEME_COLOR[keyof typeof THEME_COLOR];
export type IconType = typeof ICON_TYPE[keyof typeof ICON_TYPE];

// 审批上下文
export interface ApprovalContext {
  [approverCode: string]: boolean;
}

// 时间轴项结果
export interface TimelineItemResult {
  label: string;
  theme: ThemeColor;
  dot: VNode;
}

// 审批步骤分组
export interface StepGroup {
  [stepOrder: string]: {
    approverCodes: string[];
    requiredType: ApprovalType;
    ruleExpression?: string;
  };
}

// 审批状态结果
export interface ApprovalStatusResult {
  text: string;
  color: ThemeColor;
  value: boolean | null;
}

// 审批步骤结果
export interface ApprovalStepResult {
  isApproved: boolean;
  isRejected: boolean;
  approvedCount: number;
  totalCount: number;
  approvedApprovers: string[];
  rejectedApprovers: string[];
}

// 审批记录过滤条件
export interface RecordFilter {
  stepOrder?: number;
  approverCode?: string;
  action?: AuditStatus;
}
