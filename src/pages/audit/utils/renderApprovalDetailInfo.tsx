import { Tag } from 'tdesign-vue-next';
import { defineComponent, PropType, toRefs } from 'vue';
import type { AuditDetail, AuditDetailItem, AuditDetailOfTask, AuditItem } from '../type';
import { getApplicationTypeItemKeys, getStatusColor, renderStatusText } from '.';
import StatusTag from './renderStatusTag';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'AuditDetailInfo',
  props: {
    data: Object as PropType<AuditItem>,
  },
  setup(props) {
    const { data } = toRefs(props);
    return () => {
      if (!data.value) return null;

      const { type, details: detailsContent } = data.value;

      const detailKeysInfo = getApplicationTypeItemKeys(type);
      const detailKeys = Object.keys(detailKeysInfo);
      const details: AuditDetailItem = JSON.parse(detailsContent?.details as string);

      const renderDetailInfo = () => {
        // 忽略的字段，支持自定义配置
        const discardKeys = {
          id: {
            discard: (application: AuditItem) => {
              if (application?.type === 3 && (details as AuditDetailOfTask)?.operate_type !== 'add') {
                return true;
              }
              return false;
            },
          },
        };

        return detailKeys.map((key) => {
          const className = ['detail-info-item', `detail-info-item--${key}`];
          if (discardKeys[key]?.discard?.(data.value)) {
            return null;
          }
          return (
            <div class={className}>
              <div class="detail-info-body__title">{detailKeysInfo[key]}: </div>
              <div class="detail-info-body__content">{details[key] ?? '-'}</div>
            </div>
          );
        });
      };

      const render = () => {
        const keyList = {
          status: {
            content: '当前状态',
            cell: ({ data, row }) => {
              return <StatusTag data={data} status={row} />;
            },
          },
          current_step: '当前审批节点',
          advance_approval: {
            content: '仅审批人可审批',
            cell: ({ row }) => {
              return row ? '是' : '否';
            },
          },
          visible_allow: {
            content: '非审批人是否可见',
            cell: ({ row }) => {
              return row ? '是' : '否';
            },
          },
          created_at: {
            content: '创建时间',
            cell: ({ row }) => {
              return dayjs(row).format('YYYY-MM-DD HH:mm:ss');
            },
          },
          updated_at: {
            content: '修改时间',
            cell: ({ row }) => {
              return dayjs(row).format('YYYY-MM-DD HH:mm:ss');
            },
          },
        };
        const keys = Object.keys(keyList);
        const sys_info = keys.map((key) => {
          const className = ['application-info-item', `application-info-item--${key}`];
          const title = keyList[key]?.content ?? keyList[key];
          const content = keyList[key]?.cell?.({ data: data.value, row: data.value[key] }) ?? data.value[key];
          return (
            <div class={className}>
              <div class="application-info-body__title">{title}: </div>
              <div class="application-info-body__content">{content}</div>
            </div>
          );
        });
        return (
          <div class="application-info-wapper">
            <div class="application-info">
              <div class="application-info-header__title">基本信息</div>
              <div class="application-info-body">{sys_info}</div>
            </div>

            <div class="detail-info">
              <div class="detail-info-header__title" style="padding-bottom: 6px">
                审批内容明细
              </div>
              <div class="detail-info-body">{renderDetailInfo()}</div>
            </div>
          </div>
        );
      };

      return render();
    };
  },
});
