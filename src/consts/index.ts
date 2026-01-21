export const taskType = [
  { label: 'P0', value: 0, theme: null, color: 'rgb(177, 31, 38)' },
  { label: 'P1', value: 1, theme: null, color: 'rgb(225, 165, 0)' },
  { label: 'P2', value: 2, theme: 'warning' },
  { label: 'P3', value: 3, theme: 'primary' },
  { label: 'P4', value: 4, theme: 'default' },
];

export const taskTypeDesc = {
  P0: '重要紧急',
  P1: '重要不紧急',
  P2: '紧急不重要',
  P3: '不紧急不重要',
  P4: '暂缓',
};

export const taskStatus = [
  { label: '待办', value: 0, theme: null, color: 'rgb(177, 31, 38)' },
  { label: '统筹中', value: 1, theme: null, color: 'rgb(247, 199, 151)' },
  { label: '拍摄中', value: 2, theme: null, color: 'rgb(105, 158, 245)' },
  { label: '后期中', value: 3, theme: null, color: 'rgb(217, 113, 185)' },
  { label: '审核中', value: 4, theme: 'warning' },
  { label: '进行中', value: 5, theme: 'primary' },
  { label: '已完成', value: 6, theme: 'success' },
  { label: '未知', value: 7, theme: null, color: 'rgb(250, 145, 152)' },
  { label: '暂缓', value: 8, theme: 'default' },
];

export function getTagPriority(item) {
  // 优先级：2 > 1 > 0 > 3
  return item == 2 ? 0 : item == 1 ? 1 : item == 3 ? 3 : 2;
}
