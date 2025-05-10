import { defineComponent, toRefs, watch } from 'vue';
import config, { menuPermissionVerify, routerMap } from '../config';
import packageFile from '../../package.json';
import { h } from 'vue';
import { MenuGroup, Submenu, MenuItem, Icon } from 'tdesign-vue-next';
// import { getRoutePathObj } from './common';
import { VerifyPermissions } from './usePermission';

const upe = Array<string>;

export default defineComponent({
  name: 'Menu',
  props: {
    theme: {
      type: String,
      default: 'light',
    },
    visiable: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    valueChange: {
      type: Function,
    },
    userPermissions: {
      type: upe,
      default: [],
    },
  },
  setup(props) {
    const { visiable, value, userPermissions } = toRefs(props);
    let version = '-.-.-';

    try {
      version = packageFile?.version;
    } catch (error) {
      console.error('Cannot Resload Version', error);
    }

    function arrayAllItemIsNull(arr) {
      return arr.every((item) => item === null);
    }

    // function renderSubmenu(child) {
    //     return child.map(item => {
    //         const isSubMenu = item?.children ? true : false
    //         const isHidden = item?.hidden === true
    //         return isSubMenu ? (
    //             isHidden ? null :
    //             <t-submenu value={item.key} title={item.label} v-slots={{
    //                     icon: () => (
    //                         <>
    //                         { item.icon ? <t-icon name={item.icon} /> : null }
    //                         </>
    //                     )
    //                 }}>
    //                 { renderSubmenu(item.children) }
    //             </t-submenu>
    //         ) : (
    //             isHidden ? null :
    //             <t-menu-item value={item.key} v-slots={{
    //                     icon: () => (
    //                         <>
    //                         { item.icon ? <t-icon name={item.icon} /> : null }
    //                         </>
    //                     )
    //                 }}>
    //                 { item.label }
    //             </t-menu-item>
    //         )
    //     })
    // }

    // function renderGroupMenu() {
    //     return routerMap.map(item => {
    //         const subMenu = renderSubmenu(item.children)
    //         return arrayAllItemIsNull(subMenu) || item?.hidden ? null :  (
    //             <t-menu-group title={item.label}>
    //                 { subMenu }
    //             </t-menu-group>
    //         )
    //     })
    // }

    function renderMenu(items) {
      return items.map((item) => {
        const isSubMenu = item?.children && item?.children.length > 0;
        const isHidden = item?.hidden === true;
        const isPermission = VerifyPermissions(userPermissions.value, item?.permissions ?? []);

        // 隐藏的菜单 or 开启菜单权限验证 -> 没有权限 => 隐藏菜单
        if ((isHidden || menuPermissionVerify) && isPermission) return null;

        if (isSubMenu) {
          const subMenu = renderMenu(item.children);
          if (arrayAllItemIsNull(subMenu)) return null;

          return h(
            Submenu,
            { value: item.key, title: item.label },
            {
              default: () => subMenu,
              icon: () => (item.icon ? h(Icon, { name: item.icon }) : null),
            },
          );
        }

        return h(
          MenuItem,
          { value: item.key },
          {
            default: () => item.label,
            icon: () => (item.icon ? h(Icon, { name: item.icon }) : null),
          },
        );
      });
    }

    function renderGroupMenu(routerMap) {
      return routerMap.map((item) => {
        const subMenu = renderMenu(item.children);
        return arrayAllItemIsNull(subMenu) || item?.hidden
          ? null
          : h(
              MenuGroup,
              { title: item.label },
              {
                default: () => subMenu,
              },
            );
      });
    }

    function renderMenuFooter() {
      return (
        <div style="margin-bottom: 56px;text-align: center;font: var(--td-font-body-small);">
          {config.menuUseCollapsed && !visiable.value ? 'v' : 'MTB OA v'}
          {version}
        </div>
      );
    }

    watch(
      () => props.visiable,
      (val) => {
        visiable.value = val;
      },
    );

    return () => (
      <t-menu
        value={value}
        height="550px"
        collapsed={!visiable.value && config.menuUseCollapsed}
        class={
          !config.menuUseCollapsed
            ? visiable.value
              ? 'sidemenu sidemenu-normal sidemenu-show'
              : 'sidemenu sidemenu-normal'
            : 'sidemenu'
        }
        onChange={props?.valueChange}
      >
        {renderGroupMenu(routerMap)}
        {renderMenuFooter()}
      </t-menu>
    );
  },
});
