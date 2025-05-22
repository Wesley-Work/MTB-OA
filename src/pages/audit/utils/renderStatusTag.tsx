import { Tag } from 'tdesign-vue-next';
import { defineComponent, PropType, toRefs } from 'vue';
import type { AuditItem } from '../type';
import { getStatusColor, renderStatusText } from '.';
import theme from 'echarts/types/src/theme/dark.js';

export default defineComponent({
  name: 'AuditStatusTag',
  props: {
    status: Number,
    data: Object as PropType<AuditItem>,
    size: {
      type: String,
      default: 'small',
    },
    variant: {
      type: String,
      default: 'light',
    },
  },
  setup(props) {
    const { data, status, size } = toRefs(props);

    return () => {
      if (!data.value) return null;

      const statusResultColor = getStatusColor(data.value, status.value);
      const statusResultText = renderStatusText(data.value, status.value);

      return (
        <Tag variant={props?.variant} theme={statusResultColor} size={size.value ?? 'small'}>
          {statusResultText}
        </Tag>
      );
    };
  },
});
