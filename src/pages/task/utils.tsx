import { findObjectByValueAndKeyInArray } from '../../hooks/common';
import { Tag } from 'tdesign-vue-next';

export const selectValueDisplay = (arr: Array<any>, value: string | number) => {
  const objectItem = findObjectByValueAndKeyInArray(arr, 'value', value) as {
    theme: string;
    color: string;
    label: string;
  };
  if (!objectItem) return null;
  return (
    <Tag variant="light-outline" theme={objectItem?.theme} color={objectItem.color}>
      {objectItem?.label}
    </Tag>
  );
};
