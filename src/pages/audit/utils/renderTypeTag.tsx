import { Tag } from 'tdesign-vue-next';
import { defineComponent, toRefs } from 'vue';
import { AUDIT_TYPE, THEME_COLOR } from './constants';
import { isObject } from 'lodash-es';

/**
 * 获取审批类型文本
 * @param type 审批类型
 * @returns 类型文本
 */
export const getTypeText = (type: number): string => {
  switch (type) {
    case AUDIT_TYPE.DEVICE:
      return '设备借出';
    case AUDIT_TYPE.INTERNET:
      return '上网审批';
    case AUDIT_TYPE.TASK:
      return '任务审批';
    case AUDIT_TYPE.OTHER:
      return '其他';
    default:
      return '未知类型';
  }
};

/**
 * 获取审批类型颜色
 * @param type 审批类型
 * @returns 主题颜色
 */
export const getTypeColor = (type: number): string | { t: 'diy'; color: string } => {
  switch (type) {
    case AUDIT_TYPE.DEVICE:
      return THEME_COLOR.PRIMARY;
    case AUDIT_TYPE.INTERNET:
      return THEME_COLOR.SUCCESS;
    case AUDIT_TYPE.TASK:
      return { t: 'diy', color: 'rgb(32, 131, 168)' };
    case AUDIT_TYPE.OTHER:
      return THEME_COLOR.WARNING;
    default:
      return THEME_COLOR.DEFAULT;
  }
};

export default defineComponent({
  name: 'AuditTypeTag',
  props: {
    type: Number,
  },
  setup(props) {
    const { type } = toRefs(props);

    return () => {
      const typeColor = getTypeColor(type.value);
      const isCustomColor = isObject(typeColor) && typeColor.t === 'diy';
      return (
        <Tag
          variant="light-outline"
          theme={isCustomColor ? null : typeColor}
          color={isCustomColor ? typeColor.color : null}
        >
          {getTypeText(type.value)}
        </Tag>
      );
    };
  },
});
