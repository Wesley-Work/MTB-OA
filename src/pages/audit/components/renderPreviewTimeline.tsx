import { computed, defineComponent, ref, toRefs, watch, watchEffect } from 'vue';
import { Space, Tag, Timeline, TimelineItem } from 'tdesign-vue-next';
import { isArray } from 'lodash-es';
import renderTimelineIcon from './renderTimelineIcon';
import RenderTimelineSelect from './renderTimelineSelect';
import type { PropType, Ref, VNode } from 'vue';
import type { ApprovalPreviewStepData, AuditStepItem } from '../type';

interface EquipmentOwnerList {
  [key: string]: {
    approver: string;
    eq_code: string;
    eq_name: string;
  }[];
}

type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void;

function useCache<T, P extends any[]>(
  defaultValue: T,
  onChange?: ChangeHandler<T, P>,
): [Ref<any>, ChangeHandler<T, P>] {
  const internalValue: Ref<T> = ref();

  internalValue.value = defaultValue;

  return [
    internalValue,
    (newValue, ...args) => {
      internalValue.value = newValue;
      onChange?.(newValue, ...args);
    },
  ];
}

function mergeStepList(...args: string[][]) {
  return [...new Set(args.flat())];
}

export default defineComponent({
  name: 'PreviewTimeline',
  props: {
    type: {
      type: String as PropType<'equipment' | 'task' | 'other'>,
      default: 'other',
    },
    userCode: {
      type: String,
      default: '',
    },
    prepareStepList: {
      type: Object as PropType<ApprovalPreviewStepData>,
      default: () => ({}),
    },
    userList: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    sourceData: {
      type: Object as PropType<{ eq_code: string }>,
      default: () => ({
        eq_code: '',
      }),
    },
    onChange: {
      type: Function as PropType<(step_order: number, newData: AuditStepItem[]) => void>,
      default: () => {},
    },
  },
  setup(props) {
    const { type, prepareStepList, userList, sourceData } = toRefs(props);

    const isEquipment = computed(() => type.value === 'equipment');
    const isTask = computed(() => type.value === 'task');
    const isOther = computed(() => type.value === 'other');

    // 最小审批步骤量
    const minStep = 2;
    // 部长
    const departmentOwner = computed<string[]>(() => prepareStepList.value?.stepList?.BZ ?? []);
    // 管理
    const departmentTech = computed<string[]>(() => prepareStepList.value?.stepList?.JS ?? []);
    // 技术
    const departmentAdmin = computed<string[]>(() => prepareStepList.value?.stepList?.GL ?? []);
    // 用户上级组长
    const userGroupAdmin = computed<string[]>(() => prepareStepList.value?.groupPosition ?? []);
    // 需要审批的设备物主列表，key为设备code，value为物主数组
    const approvalEquipment = computed<EquipmentOwnerList>(() => {
      return prepareStepList.value?.approvalEquipment?.reduce((acc, cur) => {
        acc[cur.eq_code] = [...(acc[cur.eq_code] || []), cur];
        return acc;
      }, {});
    });

    const [step1Cache, setStep1Cache] = useCache([]);
    const [step2Cache, setStep2Cache] = useCache(
      mergeStepList(departmentOwner.value, departmentTech.value, departmentAdmin.value),
    );

    watch(
      [departmentOwner.value, departmentTech.value, departmentAdmin.value],
      () => {
        setStep2Cache(mergeStepList(departmentOwner.value, departmentTech.value, departmentAdmin.value));
      },
      { deep: true, immediate: true },
    );

    // 监听职位分组更新
    watchEffect(() => {
      setStep2Cache(mergeStepList(departmentOwner.value, departmentTech.value, departmentAdmin.value));
    });

    // 通知上层组件更新step
    const emitStep = (step_order: number, data: string | string[]) => {
      const emitList: { [k: number]: AuditStepItem[] } = {};
      if (isArray(data)) {
        data.forEach((item) => {
          if (!isArray(emitList[step_order])) {
            emitList[step_order] = [];
          }
          emitList[step_order].push({
            step_order,
            required_type: 'or',
            approver_user_code: item,
          });
        });
      } else {
        emitList[step_order] = [
          {
            step_order,
            required_type: 'or',
            approver_user_code: data,
          },
        ];
      }
      props?.onChange?.(step_order, emitList[step_order]);
    };

    const matchUsername = (code) => {
      const user = userList.value?.find((item) => item.code === code);
      return `${user?.name || ''}[${code}]`;
    };

    const renderTag = (list: string[]) => {
      return () => (
        <>
          审批人：
          <Space size={2}>
            {list
              .map((item) => matchUsername(item))
              .map((item) => {
                return <Tag>{item}</Tag>;
              })}
          </Space>
        </>
      );
    };

    // 默认节点-头
    const renderDefaultNode_Header = () => {
      return (
        <TimelineItem
          content={`${props?.userCode}，提交审批`}
          label="等待中"
          dotColor="success"
          dot={() => renderTimelineIcon('pending', 'primary')}
        />
      );
    };

    // 默认节点-尾
    const renderDefaultNode_Footer = () => {
      return (
        <TimelineItem content="流程结束" dotColor="primary" dot={() => renderTimelineIcon('pending', 'primary')} />
      );
    };

    // 设备借出审批节点
    // 第一个审批人为部长或技术或管理
    // 第二个审批人为物主（们）
    const renderEquipmentNode = () => {
      if (!isEquipment.value) return null;
      const list: VNode[] = [];
      const approverList = mergeStepList(departmentOwner.value, departmentTech.value, departmentAdmin.value);
      for (let index = 0; index < minStep; index++) {
        // 第一审批人
        if (index === 0) {
          // 判断有没有组长，没有的话就显示系统自动
          if (approverList?.length !== 0) {
            emitStep(index + 1, approverList);
            list.push(
              <TimelineItem
                content={renderTag(approverList)}
                label="待审批"
                dotColor="primary"
                dot={() => renderTimelineIcon('pending', 'primary')}
              />,
            );
          } else {
            emitStep(index + 1, 'SYSTEM_AUTO');
            list.push(
              <TimelineItem
                content="无审批人，系统自动通过"
                dotColor="primary"
                dot={() => renderTimelineIcon('pending', 'primary')}
              />,
            );
          }
        }
        // 第二审批人
        if (index === 1) {
          const approverList = approvalEquipment.value[sourceData.value?.eq_code];
          if (approverList && approverList?.length !== 0) {
            emitStep(
              index + 1,
              approverList.map((item) => item.approver),
            );
            list.push(
              <TimelineItem
                content={renderTag(approverList.map((item) => item.approver))}
                label="待审批"
                dotColor="primary"
                dot={() => renderTimelineIcon('pending', 'primary')}
              />,
            );
          } else {
            emitStep(index + 1, 'SYSTEM_AUTO');
            list.push(
              <TimelineItem
                content="无审批人，系统自动通过"
                dotColor="primary"
                dot={() => renderTimelineIcon('pending', 'primary')}
              />,
            );
          }
        }
      }
      return list;
    };

    // 任务审批节点
    // 第一个审批人为上级组长
    // 第二个审批人为部长或技术或管理（或签）
    const renderTaskNode = () => {
      if (!isTask.value) return null;
      const list: VNode[] = [];
      for (let index = 0; index < minStep; index++) {
        // 第一审批人
        if (index === 0) {
          // 判断有没有组长，没有的话就显示系统自动
          if (userGroupAdmin.value && userGroupAdmin.value?.length !== 0) {
            emitStep(index + 1, userGroupAdmin.value);
            list.push(
              <TimelineItem
                content={renderTag(userGroupAdmin.value)}
                label="待审批"
                dotColor="primary"
                dot={() => renderTimelineIcon('pending', 'primary')}
              />,
            );
          } else if (userGroupAdmin.value) {
            emitStep(index + 1, 'SYSTEM_AUTO');
            list.push(
              <TimelineItem
                content="无审批人，系统自动通过"
                dotColor="primary"
                dot={() => renderTimelineIcon('pending', 'primary')}
              />,
            );
          }
        }
        // 第二审批人
        if (index === 1) {
          emitStep(index + 1, mergeStepList(departmentOwner.value, departmentTech.value, departmentAdmin.value));
          list.push(
            <TimelineItem
              content={renderTag(mergeStepList(departmentOwner.value, departmentTech.value, departmentAdmin.value))}
              label="待审批"
              dotColor="primary"
              dot={() => renderTimelineIcon('pending', 'primary')}
            />,
          );
        }
      }
      return list;
    };

    // 其他审批节点
    // 第一个审批人默认为组长，支持自定义
    // 第二个审批人默认为部长或技术或管理（或签），支持自定义
    const renderOtherNode = () => {
      if (!isOther.value) return null;
      const list: VNode[] = [];
      for (let index = 0; index < minStep; index++) {
        // 第一审批人
        if (index === 0) {
          // 判断有没有组长，没有的话就推默认选框
          if (userGroupAdmin.value && userGroupAdmin.value?.length !== 0 && step1Cache.value?.length === 0) {
            setStep1Cache(userGroupAdmin.value);
          }
          emitStep(index + 1, step1Cache.value?.length === 0 ? 'SYSTEM_AUTO' : step1Cache.value);
          list.push(
            <TimelineItem
              content={() => (
                <RenderTimelineSelect
                  thisStep={index + 1}
                  value={step1Cache.value}
                  data={userList.value}
                  onSelect={setStep1Cache}
                />
              )}
              label={step1Cache.value?.length === 0 ? '当前无审批人，系统将自动通过审批' : '待审批'}
              dotColor="primary"
              dot={() => renderTimelineIcon('pending', 'primary')}
            />,
          );
        }
        // 第二审批人
        if (index === 1) {
          emitStep(index + 1, step2Cache.value?.length === 0 ? 'SYSTEM_AUTO' : step2Cache.value);
          list.push(
            <TimelineItem
              content={() => (
                <RenderTimelineSelect
                  thisStep={index + 1}
                  value={step2Cache.value}
                  data={userList.value}
                  onSelect={setStep2Cache}
                />
              )}
              label={step2Cache.value?.length === 0 ? '当前无审批人，系统将自动通过审批' : '待审批'}
              dotColor="primary"
              dot={() => renderTimelineIcon('pending', 'primary')}
            />,
          );
        }
      }
      return list;
    };

    const renderTimeLine = () => {
      return (
        <Timeline mode="same" style="padding: 12px 0px 0px 24px">
          {renderDefaultNode_Header()}
          {renderEquipmentNode()}
          {renderTaskNode()}
          {renderOtherNode()}
          {renderDefaultNode_Footer()}
        </Timeline>
      );
    };

    return () => {
      return (
        <>
          <div>PreviewTimeline</div>
          {renderTimeLine()}
        </>
      );
    };
  },
});
