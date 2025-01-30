import { defineComponent, h } from "vue";
import { VerifyPermissions } from "../hooks/usePermission";
import Error from "./pages/Error.vue";
import NoPermissions from "./pages/NoPermissions.vue";

export default defineComponent({
  props:{
    handleChangeComponent: {
      type: Function,
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
    console.log(`页面: ${props.component} 校验权限：`, vPermission, props.userPermissions, props.componentPermissions)
    try{
      return (
        vPermission ? <router-view handleChangeComponent={props.handleChangeComponent}></router-view> : <NoPermissions/>
      )
    }
    catch(err){
      console.log(err)
      return <Error msg={err}></Error>
    }
  },
});