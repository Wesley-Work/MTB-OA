import { computed, defineComponent, PropType, ref, toRefs } from 'vue';
import { getPreviewStepList, getPreviewTimeLineItem } from '.';
import renderTimelineIcon from './renderTimelineIcon';
import { ApprovalPreviewStepData, AuditStepItem } from '../type';
import renderTimelineSelect from './renderTimelineSelect';

export default defineComponent({
  name: 'AuditPreviewTimeline',
  props: {
    application: Number,
    prepareStepList: Object as PropType<ApprovalPreviewStepData>,
    userList: Array<any>,
    data: Object,
  },
  setup(props) {
    const { application, prepareStepList, userList: usersList, data } = toRefs(props);

    //     applicationType: string,
    //   preStepData: ApprovalPreviewStepData,
    //   data,
    //   userList,

    return () => {
      const preStepData = computed(() => {
        return prepareStepList.value;
      });
      const applicationType = computed(() => {
        return application.value === 1 ? 'equipment' : application.value === 3 ? 'task' : 'other';
      });
      const userList = computed(() => {
        return usersList.value;
      });

      const getPreviewStepList = computed<AuditStepItem[]>(() => {
        if (!preStepData.value) {
          return [];
        }
        const departmentOwner = preStepData.value.stepList.BZ;
        const departmentTech = preStepData.value.stepList.JS;
        const departmentdmin = preStepData.value.stepList.GL;
        // 设备列表改成key为设备code的对象，value为数组
        const approvalEquipment = preStepData.value.approvalEquipment.reduce((acc, cur) => {
          acc[cur.eq_code] = [...(acc[cur.eq_code] || []), cur];
          return acc;
        }, {});
        const userGroupAdmin = preStepData.value.groupPosition;

        // 合并数据并去重
        const mergeStepList = (...args: string[][]) => {
          return [...new Set(args.flat())];
        };

        // 设备借出审批，第一个审批人为部长或技术或管理，第二个审批人为物主
        if (applicationType.value === 'equipment') {
          return [1, 2].flatMap((step_order) => {
            if (step_order === 1) {
              return mergeStepList(departmentOwner, departmentTech, departmentdmin).map((approver) => {
                return {
                  step_order,
                  required_type: 'or',
                  approver_user_code: approver,
                  rule_expression: '',
                };
              });
            } else if (step_order === 2) {
              const approverList = approvalEquipment[data.value?.eq_code]?.map((approver) => {
                return {
                  step_order,
                  required_type: 'or',
                  approver_user_code: approver?.approver ?? '',
                  rule_expression: '',
                };
              });
              if (!approverList) {
                return {
                  step_order,
                  required_type: 'or',
                  approver_user_code: '[当前设备不需审批]  系统将自动通过',
                  rule_expression: '',
                };
              }
              return approverList;
            }
          });
        }

        // 任务审批，第一个审批人为上级组长，第二个审批人为部长或技术或管理（或签）
        else if (applicationType.value === 'task') {
          return [1, 2].flatMap((step_order) => {
            if (step_order === 1) {
              return userGroupAdmin.map((approver) => {
                return {
                  step_order,
                  required_type: 'or',
                  approver_user_code: approver,
                  rule_expression: '',
                };
              });
            } else if (step_order === 2) {
              return mergeStepList(departmentOwner, departmentTech, departmentdmin).map((approver) => {
                return {
                  step_order,
                  required_type: 'or',
                  approver_user_code: approver,
                  rule_expression: '',
                };
              });
            }
          });
        }

        // 其他审批，第一个审批人默认为组长，支持自定义，第二个审批人默认为组长部长或技术或管理（或签），支持自定义
        else {
          return [1, 2].flatMap((step_order) => {
            if (step_order === 1) {
              return userGroupAdmin.map((approver) => {
                return {
                  step_order,
                  required_type: 'or',
                  approver_user_code: approver,
                  content: () => renderTimelineSelect(userGroupAdmin, userList.value),
                  rule_expression: '',
                };
              });
            } else if (step_order === 2) {
              const msl = ref(mergeStepList(departmentOwner, departmentTech, departmentdmin));
              return msl.value.map((approver) => {
                return {
                  step_order,
                  required_type: 'or',
                  approver_user_code: approver,
                  content: () =>
                    renderTimelineSelect(msl.value, userList.value, (value) => {
                      msl.value = value;
                    }),
                  rule_expression: '',
                };
              });
            }
          });
        }
      });

      const previewStep = computed(() => {
        const stepData = getPreviewStepList.value;
        //   ${props?.userCode}，
        return [
          {
            content: `提交审批`,
            label: '等待中',
            dotColor: 'success',
            dot: () => renderTimelineIcon('pending', 'primary'),
          },
          ...getPreviewTimeLineItem(stepData),
          {
            content: '流程结束',
            dotColor: 'primary',
            dot: () => renderTimelineIcon('pending', 'primary'),
          },
        ];
      });

      const renderItem = () => {
        const result = [];
        for (const key in previewStep.value) {
          const element = previewStep.value[key];
          result.push(<t-timeline-item {...element} />);
        }
        return result;
      };

      console.log(renderItem());

      return (
        <t-timeline mode="same" style="padding: 10px 0px 0px 12px">
          {renderItem()}
        </t-timeline>
      );
    };
  },
});
