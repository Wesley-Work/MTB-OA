// 审批状态常量
export const AUDIT_STATUS = {
  PENDING: 0, // 待审批
  APPROVED: 1, // 通过
  REJECTED: 2, // 不通过
  CANCELLED: 3, // 已撤销
} as const;

// 审批类型常量
export const APPROVAL_TYPE = {
  AND: 'and', // 会签
  OR: 'or', // 或签
} as const;

// 审批类型常量
export const AUDIT_TYPE = {
  DEVICE: 1, // 设备借出
  INTERNET: 2, // 上网审批
  TASK: 3, // 任务
  OTHER: 4, // 其他
} as const;

// 主题颜色映射
export const THEME_COLOR = {
  SUCCESS: 'success',
  PRIMARY: 'primary',
  WARNING: 'warning',
  DANGER: 'danger',
  DEFAULT: 'default',
} as const;

// 图标类型
export const ICON_TYPE = {
  PENDING: 'pending',
  APPROVE: 'approve',
  REJECT: 'reject',
  CANCEL: 'cancel',
  ERROR: 'error',
} as const;
