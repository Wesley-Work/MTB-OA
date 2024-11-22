/**
 * 配置文件，不能进行动态修改！！！
 * Copyright Wesley 2024. 
 * @Important 配置会影响使用体验与呈现效果！！！
 */

import { GetAPIUrl, GetSSOUrl, GetOAUrl } from './function/hooks.js'
import { RouteMaps } from '@/types/type.js'

const routerMap:RouteMaps = [
    {
        label: "借出/归还",
        children: [
            {
                key: "Lend",
                label: "借出",
                icon: "logout",
                permissions: ['equipment.lend'],
                component: () => import('../pages/equiment/lend.vue')
            },
            {
                key: "Return",
                label: "归还",
                icon: "login",
                permissions: ['equipment.return'],
                component: () => import('../pages/equiment/return.vue')
            },
        ]
    },
    {
        label: "任务管理",
        children: [
            {
                key: "TaskList",
                label: "任务列表",
                icon: "server",
                permissions: ['task.list'],
                component: () => import('../pages/task/TaskList.vue')
            },
            {
                key: "AddTask",
                label: "添加任务",
                icon: "root-list",
                permissions: ['task.add'],
                component: () => import('../pages/task/addTask.vue')
            },
            {
                key: "MyTask",
                label: "我的任务",
                icon: "control-platform",
                permissions: [],
                component: () => import('../pages/task/myTask.vue')
            },
        ]
    },
    {
        label: "Management",
        children: [
            {
                key: "Dashboard",
                label: "数据报表",
                icon: "precise-monitor",
                permissions: [],
                component: () => import('../pages/manage/dashboard.vue')
            },
            {
                key: "lend-manage",
                label: "借出管理",
                icon: "file-paste",
                children: [
                    {
                        key: "LendList",
                        label: "借出列表",
                        permissions: ['equipment.list'],
                        component: () => import('../pages/equiment/list.vue')
                    },
                    {
                        key: "LendCheck",
                        label: "借出查询",
                        permissions: ['equipment.check'],
                        component: () => import('../pages/equiment/check.vue')
                    }
                ]
            },
            {
                key: "eq-manage",
                label: "设备管理",
                icon: "edit-1",
                children: [
                    {
                        key: "EqList",
                        label: "设备列表",
                        permissions: ['equipment.list'],
                        component: () => import('../pages/equiment/list.vue')
                    },
                    {
                        key: "EqCheck",
                        label: "设备清点",
                        permissions: ['equipment.check'],
                        component: () => import('../pages/equiment/check.vue')
                    }
                ]
            },
            {
                key: "UserManage",
                label: "人员管理",
                icon: "usergroup",
                children: [
                    {
                        key: "AccountManage",
                        label: "账号管理",
                        permissions: ['user.list'],
                        component: () => import('../pages/manage/UserManage.vue')
                    },
                    {
                        key: "GroupManage",
                        label: "组管理",
                        permissions: ['group.add'],
                        component: () => import('../pages/manage/UserManage.vue')
                    }
                ]
            },
            {
                key: "PermissionsManage",
                label: "权限管理",
                icon: "verify",
                permissions: ['permission.list'],
                component: () => import('../pages/permissions/manage.vue')
            },
            {
                key: "log-manage",
                label: "日志管理",
                icon: "view-module",
                children: [
                    {
                        key: "SystemLog",
                        label: "系统日志",
                        permissions: ['log.system'],
                        component: () => import('../pages/log/system.vue')
                    },
                    {
                        key: "BehaviorLog",
                        label: "行为日志",
                        permissions: ['log.behavior'],
                        component: () => import('../pages/log/user.vue')
                    },
                    {
                        key: "RequestLog",
                        label: "用户日志",
                        permissions: ['log.user'],
                        component: () => import('../pages/log/request.vue')
                    }
                ]
            }
        ]
    },
    {
        key: "Message",
        label: "消息中心",
        children: [
            {
                key: "MessageList",
                label: "消息列表",
                icon: "mail",
                permissions: ['message.list'],
                component: () => import('../pages/account/MessageList.vue')
            }
        ]
    },
    {
        key: "other",
        label: "其他",
        children: [
            {
                key: "RandomPerson",
                label: "随机抽取",
                icon: "user-checked",
                component: () => import('../pages/other/RandomPerson.vue')
            },
            {
                key: "MaintainGuide",
                label: "维护手册",
                icon: "tools",
                component: () => import('../pages/other/CHANGELOG.vue')
            },
            {
                key: "Feedback",
                label: "问题反馈",
                icon: "help-circle",
                component: () => import('../pages/other/Feedback.vue')
            },
            {
                key: "CHANGELOG",
                label: "更新日志",
                icon: "root-list",
                component: () => import('../pages/other/CHANGELOG.vue')
            }
        ]
    },
    {
        key: "NotShowGroup",
        label: "不显示页面",
        hidden: true,
        children: [
            {
                key: "Test",
                label: "测试页面",
                fatherCrumb: "",
                icon: "user-checked",
                component: () => import('../pages/other/CHANGELOG.vue')
            }
        ]
    }
    
]

const config = {
    version: '3.0.3',
    version_mode: 'RC',
    systemname: '顺德中专团委媒体部管理系统',
    develop_mode: false,//开发模式
    login_verify: false,//登陆验证
    logout_time: 120000,//无操作退登时间,ms
    check_time: 3000,//验证登录态时间,ms
    minWidth: 960,//页面最小宽度
    update_mode: false,//是否开启更新模式
    aTag_DontNav: true,//A标签不允许跳转
    //侧边菜单相关配置
    SideMenuValueConfig:{
        'lend':{
            'current':'借出',
            'parent':'设备操作',
            'url':'',
        },
        'Return':{
            'current':'归还',
            'parent':'设备操作',
            'url':'',
        },
        'TaskList':{
            'current':'任务列表',
            'parent':'任务管理',
            'url':'',
        },
        'AddTask':{
            'current':'添加任务',
            'parent':'任务管理',
            'url':'',
        },
        'MyTask':{
            'current':'我的任务',
            'parent':'任务管理',
            'url':'',
        },
        'Dashboard':{
            'current':'数据报表',
            'parent':'后台管理',
            'url':'',
        },
        'eq-manage':{
            'current':'设备管理',
            'parent':'后台管理',
            'url':'',
        },
        'EqList':{
            'current':'设备列表',
            'parent':'设备管理',
            'url':'',
        },
        'EqCheck':{
            'current':'设备清点',
            'parent':'设备管理',
            'url':'',
        },
        'UserManage':{
            'current':'人员管理',
            'parent':'后台管理',
            'url':'',
        },
        'PersionCenter':{
            'current':'个人中心',
            'parent':'账号管理',
            'url':'',
        },
        'MessageList':{
            'current':'通知中心',
            'parent':'消息通知',
            'url':'',
        },
        'MessageDetails':{
            'current':'消息详情',
            'parent':'通知中心',
            'url':'',
        },
        'LendList':{
            'current':'借出列表',
            'parent':'借出管理',
            'url':'',
        },
        'LendCheck':{
            'current':'借出查询',
            'parent':'借出管理',
            'url':'',
        },
        'CHANGELOG':{
            'current':'更新日志',
            'parent':'其他',
            'url':'',
        },
        'RandomPerson':{
            'current': '抽取随机',
            'parent': '其他',
            'url': '',
        },
        'Feedback':{
            'current':'问题反馈',
            'parent':'其他',
            'url':'',
        },
        'PermissionsManage':{
            'current':'权限管理',
            'parent':'',
            'url':'',
        },
        'SystemLog':{
            'current':'系统日志',
            'parent':'日志管理',
            'url':'',
        },
        'RequestLog':{
            'current':'请求日志',
            'parent':'日志管理',
            'url':'',
        },
        'BehaviorLog':{
            'current':'行为日志',
            'parent':'日志管理',
            'url':'',
        },
        'Audit':{
            'current':'审计列表',
            'parent':'账号管理',
            'url':'',
        },
        'WXGL':{
            'current':'晚修管理',
            'parent':'晚修管理',
            'url':'',
        },
        'CCTV':{
            'current':'预览',
            'parent':'监控管理',
            'url':'',
        },
        'CCTV2':{
            'current':'回放',
            'parent':'监控管理',
            'url':'',
        },
        'NetdiskManage':{
            'current':'共享网盘管理',
            'parent':'后台管理',
            'url':'',
        },
        'Login':{
            'current':'认证中',
            'parent':'登录',
            'url':'',
        },
        'status':{
            'current':'状态监控',
            'parent':'其他',
            'url':'',
        },
    },
    routerMap
}

export default config

export { routerMap, config }