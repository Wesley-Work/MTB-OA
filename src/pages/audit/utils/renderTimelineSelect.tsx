import { VNode } from 'vue';
import { Select } from 'tdesign-vue-next';

/**
 * 渲染时间轴选择
 * @param status 图标类型
 * @returns 图标组件
 */
export const renderTimelineSelect = (value: string[], data: any[], onSelect?: (value: string[]) => void): VNode => {
  console.log(value);
  const cData = data.map((item) => {
    return {
      label: `${item.name}[${item.code}]`,
      value: item.code,
    };
  });
  return (
    <Select
      value={value}
      borderless={true}
      auto-width
      options={cData}
      onChange={(values) => {
        onSelect(values);
      }}
    />
  );
};

export default renderTimelineSelect;
