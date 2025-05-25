import { defineComponent, PropType, toRefs } from 'vue';
import { Tag } from 'tdesign-vue-next';
import { getStatusColor, renderStatusText } from '../utils';
import type { AuditItem } from '../type';

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
