/**
 * 配置文件，不能进行动态修改！！！
 * Copyright Wesley 2024. 
 * @Important 配置会影响使用体验与呈现效果！！！
 */

import { GetAPIUrl, GetSSOUrl, GetOAUrl } from '@/components/function/hooks.js'

const routerMap: RouteMap = [
    {
        name: 'Lend',
        breadCrumb: {
            current: '借出',
            parent: '设备操作'
        },
        permissions: ['equipment.lend'],
        component: () => import('@/pages/equiment/lend.vue')
    },
    {
        name: 'Return',
        breadCrumb: {
            current: '归还',
            parent: '设备操作'
        },
        permissions: ['equipment.return'],
        component: () => import('@/pages/equiment/return.vue')
    },
    {
        name: 'TaskList',
        breadCrumb: {
            current: '任务列表',
            parent: '任务管理'
        },
        permissions: ['task.list'],
        component: () => import('@/pages/task/list.vue')
    },
    {
        name: 'AddTask',
        breadCrumb: {
            current: '添加任务',
            parent: '任务管理'
        },
        permissions: ['task.add'],
        component: () => import('@/pages/task/add.vue')
    },
    {
        name: 'MyTask',
        breadCrumb: {
            current: '我的任务',
            parent: '任务管理'
        },
        permissions: [],
        component: () => import('@/pages/task/myTask.vue')
    },
    
]

const config = {
    version: '3.0.3',
    version_mode: 'RC',
    systemname: '顺德中专团委媒体部管理系统',
    develop_mode: false,//开发模式
    login_verify: true,//登陆验证
    logout_time: 120000,//无操作退登时间,ms
    check_time: 3000,//验证登录态时间,ms
    minWidth: 960,//页面最小宽度
    update_mode: false,//是否开启更新模式
    aTag_DontNav: true,//A标签不允许跳转
    API_URL:{
        login_url: `${GetSSOUrl(location)}/?backUrl=${GetOAUrl(location)}/system/`,
        MAIN_URL: `${GetAPIUrl(location)}/api`,
    },
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
export {config}