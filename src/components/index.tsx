import { defineComponent, h, PropType } from "vue";
import { VerifyPermissions } from "../hooks/usePermission";
import Error from "./pages/Error.vue";
import NoPermissions from "./pages/NoPermissions.vue";
import { pagePermissionVerify } from "./config";
import { useRoute } from "vue-router";
import { isInternet as isSdzzInternet, isMTBInternet } from "@/utils";
import OnlyInternet from "./pages/onlyInternet.vue";
import { throttle } from 'lodash-es';

export default defineComponent({
  props:{
    handleChangeComponent: {
      type: Function as PropType<(...args: any[]) => any>,
    },
    userPermissions: {
      type: Array,
      default: [],
    },
    componentPermissions: {
      type: Array,
      default: [],
    },
    component: {
      type: String
    },
  },
  render: function (props) {
    const vPermission = VerifyPermissions(props.userPermissions,props.componentPermissions)
    const route = useRoute()
    var isInternet = false
    const cons = () => {
      console.info(`页面: ${props.component} 校验权限：`, vPermission, props.userPermissions, props.componentPermissions)
    }
    throttle(cons, 500)?.()
    const needInternet = !!route.meta?.needInternet
    if (needInternet) {
      isInternet = isSdzzInternet() || isMTBInternet()
    }
    try{
      const RouterView = <router-view handleChangeComponent={this.throttledHandleChange}></router-view>
      return (
        needInternet ? isInternet ? RouterView : <OnlyInternet /> : (vPermission && pagePermissionVerify) ? RouterView : <NoPermissions/>
      )
    }
    catch(err){
      console.error(err)
      return <Error msg={err}></Error>
    }
  },
});
