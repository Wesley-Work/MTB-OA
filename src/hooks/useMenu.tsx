
import { defineComponent, toRefs, watch } from 'vue';
import config, { menuPermissionVerify, routerMap } from '../components/config';
import packageFile from '../../package.json';
import { h } from 'vue';
import { MenuGroup, Submenu, MenuItem, Icon } from 'tdesign-vue-next';
// import { getRoutePathObj } from './common';
import { VerifyPermissions } from './usePermission';

var upe = Array<string>

export default defineComponent({
    name: "Menu",
    props: {
        theme: {
            type: String,
            default: "light"
        },
        visiable: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
        },
        valueChange: {
            type: Function
        },
        userPermissions: {
            type: upe,
            default: [],
        },
    },
    setup(props) {
        var { theme, visiable, value, userPermissions } = toRefs(props);
        var version = "-.-.-"

        try {
            version = packageFile?.version
        } catch (error) {
            console.log("Cannot Resload Version",error)
        }

        function arrayAllItemIsNull(arr) {
            return arr.every(item => item === null)
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
            return items.map(item => {
                const isSubMenu = item?.children && item?.children.length > 0;
                const isHidden = item?.hidden === true;
                const isPermission = VerifyPermissions(userPermissions.value,item?.permissions)

                if ((isHidden || !isPermission) && menuPermissionVerify) return null;

                if (isSubMenu) {
                    const subMenu = renderMenu(item.children);
                    if (arrayAllItemIsNull(subMenu)) return null;

                    return h(Submenu, { value: item.key, title: item.label }, {
                        default: () => subMenu,
                        icon: () => item.icon ? h(Icon, { name: item.icon }) : null
                    });
                }

                return h(MenuItem, { value: item.key }, {
                    default: () => item.label,
                    icon: () => item.icon ? h(Icon, { name: item.icon }) : null
                });
            });
        }

        function renderGroupMenu(routerMap) {
            return routerMap.map(item => {
                const subMenu = renderMenu(item.children);
                return arrayAllItemIsNull(subMenu) || item?.hidden ? null : h(MenuGroup, { title: item.label }, {
                    default: () => subMenu
                });
            });
        }

        function renderMenuFooter() {
            return (
                <div style="margin-bottom: 56px;text-align: center;font: var(--td-font-body-small);">
                    { config.menuUseCollapsed && !visiable.value ? 'v' : 'MTBOA ' }
                    {version}
                </div>
            )
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
              class={ !config.menuUseCollapsed ? visiable.value ? 'sidemenu sidemenu-normal sidemenu-show' : 'sidemenu sidemenu-normal' : 'sidemenu' }
              onChange={props?.valueChange}
            >
                {renderGroupMenu(routerMap)}
                {renderMenuFooter()}
            </t-menu>
        )
    }
})

// t-menu :theme="theme ? 'dark' : 'light'" :value="SideMenu.value" height="550px" class="sidemenu"
//         :class="{ 'sidemenu-show': SideMenu.show }" :onChange="SideMenuValueChange">
//         <t-menu-group title="设备借出与归还">
//             <t-menu-item value="lend">
//                 <template #icon>
//                     <t-icon name="logout" />
//                 </template>
//                 借出
//             </t-menu-item>
//             <t-menu-item value="Return">
//                 <template #icon>
//                     <t-icon name="login" />
//                 </template>
//                 归还
//             </t-menu-item>
//         </t-menu-group>
//         <!-- <t-menu-group title="任务管理">
//             <t-menu-item value="TaskList">
//                 <template #icon>
//                     <t-icon name="server" />
//                 </template>
//                 任务列表
//             </t-menu-item>
//             <t-menu-item value="AddTask">
//                 <template #icon>
//                     <t-icon name="root-list" />
//                 </template>
//                 添加任务
//             </t-menu-item>
//             <t-menu-item value="MyTask">
//                 <template #icon>
//                     <t-icon name="control-platform" />
//                 </template>
//                 我的任务
//             </t-menu-item>
//         </t-menu-group> -->
//         <t-menu-group title="Management">
//             <t-menu-item value="Dashboard">
//                 <template #icon>
//                     <t-icon name="precise-monitor" />
//                 </template>
//                 数据报表
//             </t-menu-item>
//             <t-submenu value="lend-manage" title="借出管理" style="--ripple-color: var(--td-brand-color-light)">
//                 <template #icon>
//                     <t-icon name="file-paste" />
//                 </template>
//                 <t-menu-item value="LendList"> 借出列表 </t-menu-item>
//                 <t-menu-item value="LendCheck"> 借出查询 </t-menu-item>
//             </t-submenu>
//             <t-submenu value="eq-manage" title="设备管理" style="--ripple-color: var(--td-brand-color-light)">
//                 <template #icon>
//                     <t-icon name="edit-1" />
//                 </template>
//                 <t-menu-item value="EqList"> 设备列表 </t-menu-item>
//                 <t-menu-item value="EqCheck"> 设备清点 </t-menu-item>
//             </t-submenu>
//             <t-menu-item value="UserManage">
//                 <template #icon>
//                     <t-icon name="usergroup" />
//                 </template>
//                 人员管理
//             </t-menu-item>
//             <t-menu-item value="PermissionsManage">
//                 <template #icon>
//                     <t-icon name="verify" />
//                 </template>
//                 权限管理
//             </t-menu-item>
//             <t-submenu value="log-manage" title="日志管理" style="--ripple-color: var(--td-brand-color-light)">
//                 <template #icon>
//                     <t-icon name="view-module" />
//                 </template>
//                 <t-menu-item value="SystemLog"> 系统日志 </t-menu-item>
//                 <t-menu-item value="RequestLog"> 请求日志 </t-menu-item>
//                 <t-menu-item value="BehaviorLog"> 行为日志 </t-menu-item>
//             </t-submenu>
//             <t-menu-item value="NetdiskManage">
//                 <template #icon>
//                     <t-icon name="cloud-download" />
//                 </template>
//                 共享网盘管理
//             </t-menu-item>
//         </t-menu-group>

//         <!-- <t-menu-group title="账号管理">
//             <t-menu-item value="PersionCenter">
//                 <template #icon>
//                     <t-icon name="user-circle" />
//                 </template>
//                 个人中心
//             </t-menu-item>
//             <t-menu-item value="Audit">
//                 <template #icon>
//                     <t-icon name="verify" />
//                 </template>
//                 审计列表
//             </t-menu-item>
//         </t-menu-group> -->
//         <!-- <t-menu-group title="消息通知">
//             <t-menu-item value="MessageList">
//                 <template #icon>
//                     <t-icon name="mail" />
//                 </template>
//                 通知中心
//             </t-menu-item>
//         </t-menu-group> -->
//         <!---->
//         <t-menu-group title="其他">
//             <t-menu-item value="RandomPerson">
//                 <template #icon>
//                     <t-icon name="user-checked" />
//                 </template>
//                 随机抽取
//             </t-menu-item>
//             <t-menu-item value="status">
//                 <template #icon>
//                     <t-icon name="shield-error" />
//                 </template>
//                 状态监控
//             </t-menu-item>
//             <t-menu-item value="MaintainGuide">
//                 <template #icon>
//                     <t-icon name="tools" />
//                 </template>
//                 维护手册
//             </t-menu-item>
//             <t-menu-item value="Feedback">
//                 <template #icon>
//                     <t-icon name="help-circle" />
//                 </template>
//                 问题反馈
//             </t-menu-item>
//             <t-menu-item value="CHANGELOG">
//                 <template #icon>
//                     <t-icon name="root-list" />
//                 </template>
//                 更新日志
//             </t-menu-item>
//         </t-menu-group>
//         <span style="
//                 user-select: none;
//                 display: flex;
//                 justify-content: center;
//                 font: var(--td-font-body-small);
//                 width: 83px;
//                 margin: 50px auto 0px;
//                 color: var(--td-text-color-primary);
//             ">Version: {{ config.version }} {{ config.version_mode }}</span>
//     </t-menu>
