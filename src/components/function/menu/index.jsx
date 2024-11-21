import { config } from "@/components/config.js";
const MenuConfig = config.SideMenuConfig;

/**
 * Complete Configuration
 * GroupName:'',
    item:[{
        value:'',
        icon:'',
        label:'',
        IsSubmenu:false,
        SubmenuItem:[{
            value:'',
            icon:'',
            label:'',
        }]
    }]
 */

/**
        <t-menu-group title="后台管理">
            <t-menu-item value="precise-monitor">
                <template #icon>
                    <t-icon name="precise-monitor" />
                </template>
                数据报表
            </t-menu-item>
            <t-submenu value="edit1" title="设备管理">
                <template #icon>
                    <t-icon name="edit-1" />
                </template>
                <t-menu-item value="3-5-1"> 设备列表 </t-menu-item>
                <t-menu-item value="3-5-2"> 设备清点 </t-menu-item>
                <t-menu-item value="3-5-3"> 三级菜单内容 </t-menu-item>
            </t-submenu>
            <t-menu-item value="usergroup">
                <template #icon>
                    <t-icon name="usergroup" />
                </template>
                人员管理
            </t-menu-item>
        </t-menu-group>
 */

export default {
  render: function (h) {
    // const Tag = `h${this.number}`;
    // return <Tag>{this.$slots.default}</Tag>;
    var MenuList = [];
    for (let index = 0; index < MenuConfig.length; index++) {
      const element = MenuConfig[index];
      //不使用group分类。
      if (element.GroupName == "") {
        // for (let index2 = 0; index2 < element.item.length; index2++) {
        //   const element2 = element.item[index];
        //   //不包含子菜单
        //   if (element2.IsSubmenu == false) {
        //     MenuList.push(`
        //     <t-menu-item value="${element2.value}">
        //         <template #icon>
        //             <t-icon name="${element2.icon}" />
        //         </template>
        //         ${element2.label}
        //     </t-menu-item>`);
        //   }
        //   //包含子菜单
        //   else {
        //     var SonMenuList = [];
        //     for (
        //       let index3 = 0;
        //       index3 < element2.SubmenuItem.length;
        //       index3++
        //     ) {
        //       const element3 = element2.SubmenuItem[index3];
        //       SonMenuList.push(
        //         `<t-menu-item value="${element3.value}"><template #icon><t-icon name="${element3.icon}" /></template>${element3.label}</t-menu-item>`
        //       );
        //     }
        //     MenuList.push(
        //       `<t-submenu value="${element2.value}" title="${element2.label}">
        //     <template #icon>
        //         <t-icon name="${element2.icon}" />
        //     </template>
        //     ${SonMenuList}
        //   </t-submenu>`);
        //   }
        // }
      }
      else {
        for (let index4 = 0; index4 < element.item.length; index4++) {
          const element4 = element.item[index4];
          //包含子菜单
          if (element4.IsSubmenu == true) {
            var SonMenuList2 = [];
            for (
              let index4 = 0;
              index4 < element4.SubmenuItem.length;
              index4++
            ) {
              const element5 = element4.SubmenuItem[index4];
              SonMenuList2.push(<t-menu-item value={element5.value}><template slot="icon"><t-icon name={element5.icon} /></template>{element5.label}</t-menu-item>);
            }
            MenuList.push(
              <t-submenu value={element4.value} title={element4.label}>
            <template slot="icon">
                <t-icon name={element4.icon}/>
            </template>
            {SonMenuList2}
          </t-submenu>);
          }
          else {
            MenuList.push(
            <t-menu-item value={element4.value}>
                <template slot="icon">
                    <t-icon name={element4.icon}/>
                </template>
                {element4.label}
            </t-menu-item>
            )
          }
        }
        MenuList.push(<t-menu-group title={element.GroupName}>{MenuList}</t-menu-group>)
      }
    }
    return (
      <t-menu>
      {MenuList}
      </t-menu>
    )
  },
};
