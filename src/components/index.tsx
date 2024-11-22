import { defineComponent, h } from "vue";

import Error from "./pages/Error.vue";

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
  render: function () {
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