import { config } from "@/components/config.js";
import { VerifyPermissions,VerifyLocalPermissions } from "@/components/function/hooks.js"
// import PageList from "@/components/pagelist.js"

import ParameterError from "@/components/pages/ParameterError.vue"
import NotFound from "@/components/pages/NotFound.vue"
import Updating from '@/components/pages/Updating.vue'
import PUpdating from '@/components/pages/PUpdating.vue'
import PageSmall from '@/components/pages/PageSmall.vue'
import Nopermissions from '@/components/pages/NoPermissions.vue'
import Error from '@/components/pages/Error.vue'

import lend from '@/pages/equiment/lend.vue'
import Return from '@/pages/equiment/return.vue'
import AddTask from '@/pages/task/addTask.vue'
import TaskList from '@/pages/task/TaskList.vue'
import MyTask from '@/pages/task/myTask'
import UserManage from '@/pages/manage/UserManage.vue'
import EqList from '@/pages/manage/eqList.vue'
import EqCheck from '@/pages/manage/eqCheck.vue'
import Dashboard from '@/pages/manage/dashboard.vue'
import CHANGELOG from '@/pages/other/CHANGELOG.vue'
import RandomPerson from '@/pages/other/RandomPerson.vue'
import MessageList from '@/pages/account/MessageList.vue'
import MessageDetails from '@/pages/account/MessageDetails.vue'
import PersionCenter from '@/pages/account/PersionCenter.vue'
import Feedback from '@/pages/other/Feedback.vue'
import LendList from '@/pages/equiment/list.vue'
import LendCheck from '@/pages/equiment/check.vue'
import Audit from '@/pages/other/audit.vue'
import Login from '@/pages/other/login.vue'
import PermissionsManage from '@/pages/permissions/manage.vue'

import SystemLog from '@/pages/log/system.vue'
import RequestLog from '@/pages/log/request.vue'
import BehaviorLog from '@/pages/log/user.vue'


const update = config.update_mode

const WorkingPage = []

const pagelist = {
    lend,
    Return,
    AddTask,
    TaskList,
    MyTask,
    UserManage,
    EqList,
    EqCheck,
    Dashboard,
    CHANGELOG,
    MessageList,
    PersionCenter,
    Feedback,
    LendList,
    LendCheck,
    Audit,
    MessageDetails,
    RandomPerson,
    SystemLog,
    RequestLog,
    BehaviorLog,
    Login,
    PermissionsManage,
};


export default {
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
  
  render: function (h) {
    // const Tag = `h${this.number}`;
    // return <Tag>{this.$slots.default}</Tag>;
    // return <lend/>
    // return <div>{this.page}</div>
    // return <updating/>

    /**主函数 */

    console.log(this.UserPermissions)

    if (this.page == '') {
      return <ParameterError/>
    }
    if (update) {
      return <Updating/>
    }
    if (this.page == "PageSmall") {
      return <PageSmall/>
    }
    if (window.innerWidth < config.minWidth) {
      return <PageSmall/>
    }

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
      if (WorkingPage.indexOf(this.page) != -1) {
        return <PUpdating></PUpdating>
      }
      const a = pagelist[this.page]
      if (a) {
        const B = a
        return <B ChangePageUrl={this.ChangePageUrl}></B>
      }
      return <NotFound/>
    }
    catch(err){
      console.log(err)
      return <Error msg={err}></Error>
    }
  },
};






