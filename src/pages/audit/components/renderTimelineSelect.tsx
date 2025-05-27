import { PropType, defineComponent, ref, toRefs, watch, nextTick, onMounted, computed } from 'vue';
import { Select } from 'tdesign-vue-next';
import type { AuditStepItem } from '../type';

interface UserOption {
  name: string;
  code: string;
  [key: string]: any;
}

export default defineComponent({
  name: 'RenderTimelineSelect',
  props: {
    value: {
      type: Array as PropType<string[]>,
    },
    data: {
      type: Array as PropType<UserOption[]>,
    },
    onSelect: {
      type: Function as PropType<(value: string[]) => void>,
      required: false,
      default: () => () => {},
    },
    thisStep: {
      type: Number,
      required: true,
    },
    changeEmit: {
      type: Function as PropType<(step_order: number, data: AuditStepItem[]) => void>,
      required: false,
      default: () => () => {},
    },
  },
  setup(props) {
    const { value, data } = toRefs(props);

    // 使用ref创建响应式状态
    const selectedValues = ref([...value.value]);

    // 通过回调方法更新最顶层组件数据
    const emitChange = () => {
      // 通过回调方法更新数据
      const emitData: AuditStepItem[] = [...new Set(props?.value)].map((value) => ({
        step_order: props?.thisStep,
        required_type: 'or',
        approver_user_code: value,
        rule_expression: '',
      }));
      props?.changeEmit?.(props?.thisStep, emitData);
    };

    // 初始化时让顶层组件更新数据
    onMounted(() => {
      nextTick(() => {
        emitChange();
      });
    });

    // 监听外部value变化
    watch(
      () => value.value,
      (newVal) => {
        selectedValues.value = [...newVal];
        // 数据更新时也要让顶层组件更新数据，包括选择后也会触发这个监视
        nextTick(() => {
          emitChange();
        });
      },
      { immediate: true },
    );

    const options = computed(() => {
      return data.value.map((item) => ({
        label: `${item.name}  [${item.code}]`,
        value: item.code,
        disabled: item?.disabled,
      }));
    });

    // 处理选择变化
    const handleChange = (values: string[]) => {
      selectedValues.value = [...values];
      props?.onSelect?.([...values]);
    };

    // 处理搜索，支持模糊搜索
    const handleSearch = (word: string, option) => {
      return (
        option.label.indexOf(word.toLowerCase()) !== -1 || option.label.toLowerCase().indexOf(word.toLowerCase()) !== -1
      );
    };

    return () => (
      <Select
        value={selectedValues.value}
        borderless
        auto-width
        multiple
        tagProps={{
          closable: false,
        }}
        options={options.value}
        onChange={handleChange}
        filter={handleSearch}
      />
    );
  },
});
