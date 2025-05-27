import { AuditItem, AuditRecordItem, AuditStepItem } from '../type';
import { AUDIT_TYPE } from './constants';
import renderTimelineIcon from '../components/renderTimelineIcon';
import { isEmpty } from 'lodash-es';

export const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '待审批';
    case 1:
      return '通过';
    case 2:
      return '不通过';
    case 3:
      return '已撤销';
    default:
      return '待审批';
  }
};

// 获取状态对应的颜色
export const getStatusColor = (data: AuditItem, status: number) => {
  const { current_step: currentStep, records } = data;
  // 审批记录分组（按 step 分组）
  const recordsList = records?.reduce((acc: Record<string, AuditRecordItem[]>, cur: AuditRecordItem) => {
    const key = cur.step.toString(); // 仅按步骤分组
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});
  const totalStep = Object.keys(recordsList).length;
  if (currentStep === totalStep && status === 1) {
    return 'success';
  } else if (status === 1) {
    return `primary`;
  }
  switch (status) {
    case 0:
      return 'warning';
    case 2:
      return 'danger';
    case 3:
      return 'default';
    default:
      return 'warning';
  }
};

// 获取状态-是否审批了
export const getStatusValue = (status: number) => {
  if (!status) return null;
  switch (status) {
    case 1:
      return true;
    default:
      return false;
  }
};

export const renderStatusText = (data: AuditItem, status: number) => {
  const { current_step: currentStep, records } = data;
  // 审批记录分组（按 step 分组）
  const recordsList = records?.reduce((acc: Record<string, AuditRecordItem[]>, cur: AuditRecordItem) => {
    const key = cur.step.toString(); // 仅按步骤分组
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});
  const totalStep = Object.keys(recordsList).length;
  if (currentStep === totalStep && status === 1) {
    return '已审批 Approve';
  } else if (status === 1) {
    return `流程中`;
  }
  switch (status) {
    case 0:
      return '待审批';
    case 2:
      return '已拒绝';
    case 3:
      return '已取消';
    default:
      return '待审批';
  }
};

// 获取类型描述
export const getTypeText = (type: number) => {
  if (!type) return null;
  switch (type) {
    case 1:
      return '设备借出';
    case 2:
      return '上网审批';
    case 3:
      return '其他';
    default:
      return '其他';
  }
};

// 获取类型颜色
export const getTypeColor = (type: number) => {
  if (!type) return null;
  switch (type) {
    case 1:
      return 'success';
    case 2:
      return 'primary';
    case 3:
      return 'default';
    default:
      return 'default';
  }
};

// 获取该申请已经审批列表
export const getApprovalStepRecord = (application_id: number, record: AuditRecordItem[]) => {
  return record?.filter((item) => item.application_id === application_id);
};

export const thisUserWasApproval = (approver_user_code: string, stepData: AuditRecordItem[]) => {
  return stepData
    .filter((item) => item.action === 1 && !item.discard)
    .map((step) => {
      return step.approver_user_code;
    })
    .includes(approver_user_code);
};

// 时间轴项生成
export const getTimelineItem = (approverUserCodes: string[], data: AuditItem, requiredType: 'or' | 'and') => {
  // 过滤掉discard为true的记录
  const records = (data?.records || []).filter((record) => !record.discard);

  // 构建变量上下文（审批通过）
  // const context = Object.fromEntries(
  //   approverUserCodes.map((code) => [code, records.some((r) => r.approver_user_code === code && r.action === 1)]),
  // );

  // 判断是否拒绝
  const isAnyRejected = approverUserCodes.some((code) =>
    records.some((r) => r.approver_user_code === code && r.action === 2),
  );

  // 获取所有已审批的审批人及其意见
  const approvedApprovers = approverUserCodes
    .filter((code) => records.some((r) => r.approver_user_code === code && r.action === 1))
    .map((code) => {
      const record = records.find((r) => r.approver_user_code === code && r.action === 1);
      return `${code}: ${isEmpty(record?.comment) ? '-' : record.comment}`;
    });

  const approverCount = approverUserCodes.length;
  const approvedCount = approvedApprovers.length;

  let label = '',
    theme = 'primary',
    dot = renderTimelineIcon('pending', 'primary');

  // 或签逻辑
  if (requiredType === 'or') {
    // 优先判断是否拒绝
    if (isAnyRejected) {
      const rejectReasons = approverUserCodes
        .filter((code) => records.some((r) => r.approver_user_code === code && r.action === 2))
        .map((code) => {
          const record = records.find((r) => r.approver_user_code === code && r.action === 2);
          return `${record?.approver_user_code}: ${isEmpty(record?.comment) ? '-' : record.comment}`;
        });
      label = `已拒绝，${rejectReasons.join('；')}`;
      theme = 'danger';
      dot = renderTimelineIcon('reject', 'danger');
    }
    // 再判断是否审批通过
    else if (approvedCount > 0) {
      label = `已审批，${approvedApprovers.join('；')}`;
      theme = 'success';
      dot = renderTimelineIcon('approve', 'success');
    }
  }
  // 会签逻辑
  else if (requiredType === 'and') {
    // 优先判断是否拒绝
    if (isAnyRejected) {
      const rejectReasons = approverUserCodes
        .filter((code) => records.some((r) => r.approver_user_code === code && r.action === 2))
        .map((code) => {
          const record = records.find((r) => r.approver_user_code === code && r.action === 2);
          return `${record?.approver_user_code}: ${isEmpty(record?.comment) ? '-' : record.comment}`;
        });
      label = `已拒绝，${rejectReasons.join('；')}`;
      theme = 'danger';
      dot = renderTimelineIcon('reject', 'danger');
    }
    // 再判断是否全部通过
    else if (approvedCount === approverCount) {
      label = `所有人已审批，${approvedApprovers.join('；')}`;
      theme = 'success';
      dot = renderTimelineIcon('approve', 'success');
    } else {
      label = `${approvedCount}/${approverCount}人已审批，${approvedApprovers.join('；')}`;
      theme = 'warning';
      dot = renderTimelineIcon('approve', 'warning');
    }
  }

  return { label, theme, dot: () => dot };
};

// 生成时间轴数据
export const getAllStepData = (data: AuditItem) => {
  // 步骤分组（按 step_order 分组）
  const stepList = data?.steps?.reduce((acc: Record<string, AuditStepItem[]>, cur: AuditStepItem) => {
    const key = cur.step_order.toString(); // 仅按步骤分组
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});

  // 审批记录分组（按 step 分组）
  const recordsList = data?.records?.reduce((acc: Record<string, AuditRecordItem[]>, cur: AuditRecordItem) => {
    const key = cur.step.toString(); // 仅按步骤分组
    if (!acc[key]) acc[key] = [];
    acc[key].push(cur);
    return acc;
  }, {});

  // 首节点
  const first = {
    content: `${data?.user_code} 提交审批`,
    label: data?.details.content,
    dotColor: 'success',
    dot: () => renderTimelineIcon('approve', 'success'),
  };
  // 尾节点
  const last = {
    content: '流程结束',
    dotColor: 'primary',
    dot: () =>
      data.current_step === Object.keys(recordsList).length && data?.status !== 2
        ? renderTimelineIcon('approve', 'success')
        : renderTimelineIcon('cancel', data?.status === 2 ? 'danger' : 'primary'),
  };

  // 生成时间轴节点
  return {
    total: data?.steps?.length,
    current: data?.current_step,
    options: [
      first,
      ...Object.entries(stepList || {}).map(([_key, steps]) => {
        // 检查是否为系统自动审批步骤
        const isSystemAutoStep = steps.every(
          (step) => step.approver_user_code === 'SYSTEM_AUTO' || !step.approver_user_code,
        );

        // 获取该步骤下的所有审批人
        const approverCodes = steps
          .map((step) =>
            step.approver_user_code === 'SYSTEM_AUTO' || !step.approver_user_code ? null : step.approver_user_code,
          )
          .filter(Boolean);

        // 获取该步骤的第一个审批人的 required_type
        const baseType = steps[0]?.required_type || 'or';

        // 根据 required_type 生成连接符
        const separator = baseType === 'and' ? '和' : '或';

        // 构建显示文本
        let content;
        if (isSystemAutoStep) {
          content = '系统自动审批';
        } else {
          content = `审批人: ${approverCodes.join(separator)}`;
        }

        // 生成时间轴项
        let timelineItem;
        if (isSystemAutoStep) {
          // 系统自动审批步骤始终显示为已通过
          timelineItem = {
            label: '系统自动通过',
            theme: 'success',
            dot: () => renderTimelineIcon('approve', 'success'),
          };
        } else {
          timelineItem = getTimelineItem(approverCodes, data, baseType as 'or' | 'and');
        }

        return {
          content,
          ...timelineItem,
        };
      }),
      last,
    ],
  };
};

// 获取审批单类型对应的数据键值
export const getApplicationTypeItemKeys = (type: number) => {
  switch (type) {
    case AUDIT_TYPE.DEVICE:
      return {
        eq_code: '设备Code',
        lend_time: '借出时间（使用时间）',
        return_time: '归还时间',
        lender: '借出人',
      };
    case AUDIT_TYPE.INTERNET:
      return { ip: 'IP地址', mac: 'MAC地址', info: '申请信息/补充信息', timestamp: '时间戳' };
    case AUDIT_TYPE.TASK:
      return {
        operate_type: '操作类型',
        id: '记录id',
        content: '任务内容',
        create_user: '创建人',
        equipment: '使用设备',
        finally_time: '预期完成时间',
        name: '任务名称',
        place: '工作地点',
        remark: '备注',
        status: '任务状态',
        type: '任务类型',
        user: '分配用户',
        weight: '权重',
        work_time: '工作时间',
      };
    default:
      return { content: '内容', extra: '其他信息', key: '键', value: '值' };
  }
};

export const getApplicationCommonKeys = () => {
  return {
    id: 'ID',
    user_code: '申请人',
    visible_allow: '是否可见',
    create_time: '创建时间',
    update_time: '更新时间',
    status: '状态',
    type: '类型',
    details: '详情',
    other_info: '其他信息',
  };
};

// 判断当前用户是否可以进行管理操作，判断规则：当前用户是审批单的审批人
export const checkUserCanOperate = (userCode: string, application: AuditItem) => {
  const { steps } = application;
  return steps?.some((step) => step.approver_user_code === userCode);
};

// 判断当前用户是否可以进行审批操作，判断规则：当前用户是审批单的审批人、当前步骤到该用户审批（包括会签和签和混合签的情况）
export const checkUserCanApprove = (userCode: string, application: AuditItem) => {
  const { steps, current_step, records = [] } = application;

  // 如果没有步骤或当前步骤超出范围，不能审批
  if (!steps?.length || current_step > steps.length) {
    return { result: false, type: 'step_out_of_range' };
  }

  // 获取当前步骤的所有审批人
  const currentStepApprovers = steps.filter((step) => step.step_order === current_step);

  // // 检查当前步骤是否为系统自动审批步骤
  // const isSystemAutoStep = currentStepApprovers.every(
  //   (step) => step.approver_user_code === 'SYSTEM_AUTO' || !step.approver_user_code,
  // );

  // // 如果是系统自动审批步骤，则不需要人工审批
  // if (isSystemAutoStep) {
  //   return { result: false, type: 'system_auto_approval' };
  // }

  // 如果当前用户不在当前步骤的审批人列表中，不能审批
  if (!currentStepApprovers.some((step) => step.approver_user_code === userCode)) {
    return { result: false, type: 'user_not_in_step' };
  }

  // 获取当前步骤的审批类型（使用第一个审批人的类型，因为同一步骤的审批类型应该相同）
  const requiredType = currentStepApprovers[0]?.required_type || 'or';

  // 过滤掉discard为true的记录
  const validRecords = records.filter((record) => !record.discard);

  // 获取当前步骤已审批的有效记录
  const currentStepRecords = validRecords.filter((record) =>
    currentStepApprovers.some((step) => step.approver_user_code === record.approver_user_code),
  );

  // 检查当前用户是否已经审批过
  const hasApproved = currentStepRecords.some(
    (record) => record.approver_user_code === userCode && (record.action === 1 || record.action === 2),
  );

  // 如果已经审批过，不能再审批
  if (hasApproved) {
    return { result: false, type: 'user_already_approved' };
  }

  // 检查是否有人已经拒绝
  const isAnyRejected = validRecords.some((record) => record.action === 2);
  if (isAnyRejected) {
    return { result: false, type: 'steps_has_rejected' };
  }

  // 根据不同的审批类型判断
  switch (requiredType) {
    case 'and': // 会签
      // 会签情况下，只要当前用户没有审批过，就可以审批
      return { result: true, type: 'and' };

    case 'or': // 或签
      // 或签情况下，如果没有人审批过，或者虽然有人审批过但还未通过，当前用户都可以审批
      return { result: true, type: 'or' };

    default:
      return { result: false, type: 'default' };
  }
};

// 判断当前用户是否可以进行撤销审批操作，判断规则：当前用户是审批单的审批人、当前用户审已审批过、下一审批人未审批
export const checkUserCanRevert = (userCode: string, application: AuditItem) => {
  const { steps, records = [] } = application;

  // 如果没有步骤，不能撤销
  if (!steps?.length) {
    return false;
  }

  // 过滤掉discard为true的记录
  const validRecords = records.filter((record) => !record.discard);

  // 1. 检查当前用户是否是审批人
  const isApprover = steps.some((step) => step.approver_user_code === userCode);
  if (!isApprover) {
    return false;
  }

  // 2. 检查当前用户是否已审批过（忽略discard为true的记录）
  const userRecord = validRecords.find(
    (record) => record.approver_user_code === userCode && (record.action === 1 || record.action === 2), // 通过或拒绝的记录
  );
  if (!userRecord) {
    return false;
  }

  // 获取当前用户的步骤信息
  const userStep = steps.find((step) => step.approver_user_code === userCode);
  if (!userStep) {
    return false;
  }

  // 获取下一步骤的审批人
  const nextStepOrder = userStep.step_order + 1;
  const nextStepApprovers = steps.filter((step) => step.step_order === nextStepOrder);

  // 如果没有下一步，说明当前用户是最后一个审批人，可以撤销自己的审批
  if (nextStepApprovers.length === 0) {
    return true;
  }

  // 3. 检查下一步审批人是否已经审批（忽略discard为true的记录）
  const hasNextApproved = validRecords.some(
    (record) =>
      nextStepApprovers.some((approver) => approver.approver_user_code === record.approver_user_code) &&
      (record.action === 1 || record.action === 2), // 通过或拒绝的记录
  );

  // 只有当下一步审批人未审批时才能撤销
  return !hasNextApproved;
};
