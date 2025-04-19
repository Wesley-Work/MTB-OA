import { defineComponent } from 'vue';
import { routerMap } from '../config';
import '../assets/Content.scss';
import { RouteMaps } from '../types/type';

export default defineComponent({
  name: 'Content',
  props: {
    handleChangeComponent: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    function arrayAllItemIsNull(arr) {
      return arr.every((item) => item === null);
    }

    function renderMenu(items: RouteMaps, deep = 0) {
      // 提取有孙子项的子项
      function extractSubItemsWithGrandChildren(items: RouteMaps) {
        const subItemsWithGrandChildren: RouteMaps = [];
        const remainingItems: RouteMaps = [];

        items.forEach((item) => {
          if (item.children && item.children.some((child) => child.children && child.children.length > 0)) {
            subItemsWithGrandChildren.push(item);
          } else {
            remainingItems.push(item);
          }
        });

        return [subItemsWithGrandChildren, remainingItems];
      }

      // 处理子项
      function processItems(items: RouteMaps, deep: number) {
        if (deep === 0) {
          const [subItemsWithGrandChildren, remainingItems] = extractSubItemsWithGrandChildren(items);
          items = [...remainingItems, ...subItemsWithGrandChildren];
        }

        return items
          .map((item) => {
            const isSubMenu = item?.children && item?.children.length > 0;
            const isHidden = item?.hidden === true;

            if (isHidden) return null;

            if (isSubMenu) {
              const subMenu = renderMenu(item.children, deep + 1);
              if (arrayAllItemIsNull(subMenu)) return null;

              if (deep === 0 && item.children.some((child) => child.children && child.children.length > 0)) {
                return (
                  <>
                    <div class="componentRow" deep={deep}>
                      <div class="componentTitle">{item.label}</div>
                      <div class="componentChild" deep={deep}>
                        {subMenu.filter((subItem) => !subItem.props || !subItem.props.class.includes('componentRow'))}
                      </div>
                    </div>
                    {subMenu.filter((subItem) => subItem.props && subItem.props.class.includes('componentRow'))}
                  </>
                );
              }

              return (
                <div class="componentRow" deep={deep}>
                  <div class="componentTitle">{item.label}</div>
                  <div class="componentChild" deep={deep}>
                    {subMenu}
                  </div>
                </div>
              );
            }

            return (
              <div id={item.key} class="componentItem" deep={deep}>
                <div
                  class="componentItem--inner"
                  onClick={() => {
                    props?.handleChangeComponent?.(item.key, true);
                  }}
                >
                  {item.label}
                </div>
              </div>
            );
          })
          .filter(Boolean); // 过滤掉 null 值
      }

      return processItems(items, deep);
    }

    return () => <div class="componentView">{renderMenu(routerMap)}</div>;
  },
});
