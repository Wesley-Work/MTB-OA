/**
 * 配置文件，不能进行动态修改！！！
 * Copyright Wesley 2024.
 * @Important 配置会影响使用体验与呈现效果！！！
 */

import { RouteMaps } from '@/types/type.js';
import { version } from '../../package.json';

const packageVersion = version;

const routerMap: RouteMaps = [
  {
    label: '设备使用登记',
    children: [
      {
        key: 'Lend',
        label: '设备借出',
        icon: 'logout',
        permissions: ['equipment.operate.lend'],
        component: () => import('@pages/equipment/lend.vue'),
      },
      {
        key: 'Return',
        label: '设备归还',
        icon: 'login',
        permissions: ['equipment.operate.return'],
        component: () => import('@pages/equipment/return.vue'),
      },
    ],
  },
  {
    label: '任务管理',
    children: [
      {
        key: 'TaskList',
        label: '任务看板',
        icon: 'task',
        component: () => import('@pages/task/taskList.vue'),
      },
      {
        key: 'TaskManage',
        label: '任务管理',
        icon: 'task-setting',
        permissions: [],
        component: () => import('@pages/task/taskManage.vue'),
      },
      {
        key: 'MyTask',
        label: '我的任务',
        icon: 'task-visible',
        permissions: [],
        component: () => import('@pages/task/myTask.vue'),
      },
    ],
  },
  {
    label: '系统数据',
    children: [
      {
        key: 'Dashboard',
        label: '数据概览',
        icon: 'precise-monitor',
        permissions: [],
        component: () => import('@pages/management/dashboard.vue'),
      },
    ],
  },
  {
    label: '官网管理',
    children: [
      {
        key: 'WebsiteManage',
        label: '网站管理',
        icon: 'system-code',
        permissions: ['website.manage'],
        component: () => import('@pages/management/website/officialWeb.vue'),
        meta: {
          needInternet: true,
        },
      },
      {
        key: 'ShareNetdiskManage',
        label: '共享网盘管理',
        icon: 'cloud',
        permissions: ['website.manage'],
        component: () => import('@pages/management/website/shareNetdisk.vue'),
        meta: {
          needInternet: true,
        },
      },
    ],
  },
  {
    label: '上网认证',
    children: [
      {
        key: 'NetworkPortal',
        label: '绑定列表',
        icon: 'internet',
        permissions: ['network.manage'],
        component: () => import('@pages/management/network/network-portal.vue'),
        hidden: true,
      },
      {
        key: 'NetworkCode',
        label: '上网码管理',
        icon: 'key',
        permissions: ['network.manage'],
        component: () => import('@pages/management/network/network-code.vue'),
        hidden: true,
      },
    ],
  },
  {
    label: '审计审批',
    children: [
      {
        key: 'AuditManage',
        label: '审批管理',
        icon: 'seal',
        permissions: ['audit.manage.manage'],
        component: () => import('@pages/audit/auditManage.vue'),
      },
      {
        key: 'AuditPost',
        label: '发起审批',
        icon: 'send',
        permissions: ['audit.manage.post'],
        component: () => import('@pages/audit/auditPost.vue'),
      },
      {
        key: 'AuditProgress',
        label: '审批进度',
        icon: 'user-business',
        component: () => import('@pages/audit/auditProgress.vue'),
      },
    ],
  },
  {
    label: 'Management',
    children: [
      {
        key: 'course-exam',
        label: '课程与考试',
        icon: 'address-book',
        hidden: true,
        children: [
          {
            key: 'CourseManage',
            label: '课程管理',
            component: () => import('@pages/course/courseManage.vue'),
          },
          {
            key: 'ExamManage',
            label: '考试管理',
            component: () => import('@pages/exam/examManage.vue'),
          },
        ],
      },
      {
        key: 'online-user',
        label: '在线用户',
        icon: 'user-visible',
        component: () => import('@pages/management/account/OnlineUser.vue'),
      },
      {
        key: 'lend-manage',
        label: '借出管理',
        icon: 'file-paste',
        children: [
          {
            key: 'LendList',
            label: '借出列表',
            permissions: ['equipment.record.list'],
            component: () => import('@pages/equipment/list.vue'),
          },
          {
            key: 'LendCheck',
            label: '借出查询',
            permissions: ['equipment.record.item'],
            component: () => import('@pages/equipment/check.vue'),
          },
        ],
      },
      {
        key: 'eq-manage',
        label: '设备管理',
        icon: 'device',
        children: [
          {
            key: 'EqList',
            label: '设备列表',
            permissions: ['equipment.manage.manage'],
            component: () => import('@pages/management/eqList.vue'),
          },
          {
            key: 'EqCheck',
            label: '设备盘点',
            permissions: ['equipment.manage.check'],
            component: () => import('@pages/management/eqCheck.vue'),
          },
        ],
      },
      {
        key: 'UserManage',
        label: '人员管理',
        icon: 'usergroup',
        children: [
          {
            key: 'AccountManage',
            label: '账号管理',
            permissions: ['account.manage.manage'],
            component: () => import('@pages/management/account/UserManage.vue'),
          },
          {
            key: 'PositionManage',
            label: '职位管理',
            permissions: ['account.position.manage'],
            component: () => import('@pages/management/account/PositionManage.vue'),
          },
          {
            key: 'GroupManage',
            label: '组管理',
            permissions: ['account.group.manage'],
            component: () => import('@pages/management/account/GroupManage.vue'),
          },
        ],
      },
      {
        key: 'PermissionsManage',
        label: '权限管理',
        icon: 'verify',
        permissions: ['permission.manage'],
        component: () => import('@pages/permissions/manage.vue'),
      },
      {
        key: 'log-manage',
        label: '日志管理',
        icon: 'view-module',
        children: [
          {
            key: 'SystemLog',
            label: '系统日志',
            permissions: ['log.system'],
            component: () => import('@pages/log/system.vue'),
          },
          {
            key: 'BehaviorLog',
            label: '行为日志',
            permissions: ['log.behavior'],
            component: () => import('@pages/log/user.vue'),
          },
          {
            key: 'RequestLog',
            label: '请求日志',
            permissions: ['log.request'],
            component: () => import('@pages/log/request.vue'),
          },
        ],
      },
    ],
  },
  {
    key: 'Message',
    label: '消息中心',
    children: [
      {
        key: 'MessageList',
        label: '消息列表',
        icon: 'mail',
        permissions: ['message.get'],
        component: () => import('@pages/account/MessageList.vue'),
      },
    ],
  },
  {
    key: 'other',
    label: '其他',
    children: [
      {
        key: 'RandomPerson',
        label: '随机抽取',
        icon: 'user-checked',
        hidden: true,
        component: () => import('@pages/other/RandomPerson.vue'),
      },
      {
        key: 'MaintainGuide',
        label: '维护手册',
        icon: 'tools',
        hidden: true,
        component: () => import('@pages/other/CHANGELOG.vue'),
      },
      {
        key: 'SystemInfo',
        label: '系统信息',
        icon: 'system-components',
        component: () => import('@pages/other/system.vue'),
      },
      {
        key: 'Feedback',
        label: '问题反馈',
        icon: 'help-circle',
        component: () => import('@pages/other/Feedback.vue'),
      },
      {
        key: 'CHANGELOG',
        label: '更新日志',
        icon: 'root-list',
        component: () => import('@pages/other/CHANGELOG.vue'),
      },
    ],
  },
  {
    key: 'NotShowGroup',
    label: '不显示页面',
    hidden: true,
    children: [
      {
        key: 'Content',
        label: '首页',
        fatherCrumb: '',
        component: () => import('@pages/Content.tsx'),
      },
      {
        key: 'SuppleRecord',
        label: '补记录',
        fatherCrumb: '借出',
        component: () => import('@pages/equipment/SuppleRecord.vue'),
      },
      {
        key: 'Admini',
        label: '管理页',
        fatherCrumb: '',
        icon: 'user-checked',
        component: () => import('@pages/other/CHANGELOG.vue'),
      },
    ],
  },
];

const config = {
  version: '3.4.1',
  versionMode: 'Stable',
  packageVersion: packageVersion,
  systemName: '顺德中专团委媒体部 信息化管理平台',
  systemNameEn: 'MTB OA',
  breadcrumbIndex: '媒体部信息化管理平台',
  developMode: false, //开发模式
  loginVerify: true, //登陆验证
  logoutTime: 120000, //无操作退登时间,ms
  checkTime: 3000, //验证登录态时间,ms
  minWidth: 960, //页面最小宽度
  updateMode: false, //是否开启更新模式
  aTagDoNotNav: true, //A标签不允许跳转
  menuUseCollapsed: true, //菜单是否使用折叠模式
  routerPrefix: '/system', //路由前缀
  routerMap,
  // TODO：v3.4.1暂时关闭下面的配置！！！
  pagePermissionVerify: false, //是否开启页面权限验证
  menuPermissionVerify: false, //是否开启菜单权限验证
  useViewTransition: true, // 是否使用ViewTransition API 进行切换样式
  allowHotUpdate: true, // 是否允许热更新
};

export default config;

export const routerPrefix = config.routerPrefix;

export { routerMap, config, packageVersion };

export const VERSION = config.version;
export const versionMode = config.versionMode;
export const systemName = config.systemName;
export const systemNameEn = config.systemNameEn;
export const pagePermissionVerify = config.pagePermissionVerify;
export const menuPermissionVerify = config.menuPermissionVerify;
export const useViewTransition = config.useViewTransition;
export const allowHotUpdate = config.allowHotUpdate;
export const loginVerify = config.loginVerify;
export const menuUseCollapsed = config.menuUseCollapsed;
export const breadcrumbIndex = config.breadcrumbIndex;
