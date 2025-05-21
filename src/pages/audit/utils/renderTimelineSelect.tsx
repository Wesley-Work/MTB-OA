import { PropType, defineComponent, ref, toRefs, watch } from 'vue';
import { Select } from 'tdesign-vue-next';

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
    },
  },
  setup(props) {
    const { value, data } = toRefs(props);

    // 使用ref创建响应式状态
    const selectedValues = ref([...value.value]);

    // 监听外部value变化
    watch(
      () => value.value,
      (newVal) => {
        selectedValues.value = [...newVal];
      },
      { immediate: true },
    );

    const options = data.value.map((item) => ({
      label: `${item.name}  [${item.code}]`,
      value: item.code,
    }));

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
        options={options}
        onChange={handleChange}
        filter={handleSearch}
      />
    );
  },
});
