import { ErrorCircleIcon, GestureRanslationIcon, PendingIcon, TaskChecked1Icon } from 'tdesign-icons-vue-next';
import { ICON_TYPE, THEME_COLOR } from './constants';
import { IconType, ThemeColor } from './types';
import { VNode } from 'vue';

/**
 * 主题颜色映射到CSS变量
 */
const THEME_COLOR_MAP: Record<ThemeColor, string> = {
  [THEME_COLOR.SUCCESS]: 'var(--td-success-color)',
  [THEME_COLOR.DANGER]: 'var(--td-error-color)',
  [THEME_COLOR.PRIMARY]: 'var(--td-brand-color)',
  [THEME_COLOR.WARNING]: 'var(--td-warning-color)',
  [THEME_COLOR.DEFAULT]: 'var(--td-text-color-primary)',
};

/**
 * 渲染时间轴图标
 * @param status 图标类型
 * @param theme 主题颜色
 * @returns 图标组件
 */
export const renderTimelineIcon = (status: IconType | string, theme: ThemeColor): VNode => {
  const color = THEME_COLOR_MAP[theme as ThemeColor] || THEME_COLOR_MAP[THEME_COLOR.DEFAULT];

  switch (status) {
    case ICON_TYPE.APPROVE:
      return <TaskChecked1Icon size="medium" color={color} />;
    case ICON_TYPE.REJECT:
      return <ErrorCircleIcon size="medium" color={color} />;
    case ICON_TYPE.PENDING:
      return <PendingIcon size="medium" color={color} />;
    case ICON_TYPE.CANCEL:
      return <GestureRanslationIcon size="medium" color={color} />;
    case ICON_TYPE.ERROR:
    default:
      return <GestureRanslationIcon size="medium" color={color} />;
  }
};

export default renderTimelineIcon;
