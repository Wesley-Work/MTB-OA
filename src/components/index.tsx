import { defineAsyncComponent, defineComponent, h, resolveComponent } from "vue";
import { config, routerMap } from "./config.js";
import { VerifyPermissions,VerifyLocalPermissions } from "./function/hooks.js"
import { RouteMaps, RouteMapItem } from "../types/type.js";
// import PageList from "../../pagelist.js"


import Error from "./pages/Error.vue"
import ParameterError from "./pages/ParameterError.vue"
import PageSmall from "./pages/PageSmall.vue"
import NotFound from "./pages/NotFound.vue"
import Updating from "./pages/Updating.vue"
import PUpdating from "./pages/PUpdating.vue"
import Nopermissions from "./pages/Nopermissions.vue"

const update = config.update_mode

const WorkingPage = []



export default defineComponent({
  props:{
    page:{
      type:String,
      default: '',
    },
    ChangePageUrl:{
      type: Function,
      default: null,
    },
    UserPermissions:{
      type: Array,
      default: [],
    },
  },
  
  setup(props) {
    
  },
  
  render: function () {
    // const Tag = `h${this.number}`;
    // return <Tag>{this.$slots.default}</Tag>;
    // return <lend/>
    // return <div>{this.page}</div>
    // return <updating/>

    /**主函数 */

    console.log(this.UserPermissions)

    // if (this.page == '') {
    //   return <ParameterError/>
    // }
    // if (update) {
    //   return <Updating/>
    // }
    // if (this.page == "PageSmall") {
    //   return <PageSmall/>
    // }
    // if (window.innerWidth < config.minWidth) {
    //   return <PageSmall/>
    // }

    // for (const index in NeedPermissionsPages) {
    //   if (Object.hasOwnProperty.call(NeedPermissionsPages, index)) {
    //     const element = NeedPermissionsPages[index];
    //     if (element.name == this.page) {
    //       // 当前选择的页面需要权限
    //       if (VerifyLocalPermissions(element.Permissions) == false) {
    //           console.warn("无权限")
    //           return <Nopermissions/>
    //       }
    //       else{
    //         break
    //       }
    //       // console.log(await VerifyPermissions(element.Permissions))
    //       // if (await VerifyPermissions(element.Permissions) == false) {
    //       //   console.warn("无权限")
    //       //   return <Nopermissions/>
    //       // }
    //     }
    //   }
    // }
    
    try{
      return(
        <router-view></router-view>
      )
    }
    catch(err){
      console.log(err)
      return <Error msg={err}></Error>
    }
  },
});






