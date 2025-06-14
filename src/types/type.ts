import { RouteRecordRaw } from 'vue-router';

// interface ComponentsMap {
//   [key: string]: Function;
// }

export interface RouteMapItems extends Omit<RouteRecordRaw, 'component' | 'children' | 'path'> {
  key?: string;
  label: string;
  icon?: string;
  permissions?: string[];
  component?: Function;
  hidden?: boolean;
  hiddenBreadCrumb?: boolean;
  fatherCrumb?: string;
  children?: RouteMapItems[];
  type?: string;
}

export type RouteMaps = RouteMapItems[];

export type LendTableDataItem = {
  id?: number;
  eqname: string;
  eqcode: string;
  status: object;
  user: string;
  dothisthinguser: string;
  lendtime: string;
  more: string;
  SHA?: string;
};

export type ReturnTableDataItem = {
  id?: number;
  eqname: string;
  eqcode: string;
  status: object;
  user: string;
  dothisthinguser: string;
  returntime: string;
  more: string;
  SHA?: string;
};

// interface LendTableData extends Array<LendTableDataItem> {}

export interface RequestHooksOptions {
  url: string;
  token?: string;
  methods?: string;
  header?: object;
  data?: object | string;
  useCustomURL?: boolean;
  timeout?: number;
  success?: Function;
  error?: Function;
  complete?: Function;
}

export interface RequestResponseData {
  errcode: number | string;
  errmsg: string;
  data?: string | Array<any> | object | null;
}

export interface PermissionsObject {
  id?: number;
  object?: string;
  type?: 'system' | 'groupid' | 'userid';
  val?: string;
  open?: number | boolean;
  remark?: string | null;
}

export type PermissionsArray = PermissionsObject[];

export interface equipmentStatusTips {
  [key: number | string]: string | HTMLElement;
}

export interface equipmentStatus {
  id: number;
  label: string;
  theme: string;
  disableStatus?: Array<number | 'start'> | undefined;
  tips?: equipmentStatusTips[];
}

export interface EquipmentInfo {
  id: number;
  name: string;
  code: string;
  belong: string;
  model: string;
  sn: string;
  status: number;
}

export interface LendRecordInfo {
  id: number;
  eqcode: string;
  eqname: string;
  lender: string;
  user: string;
  returner: string;
  lendtime: string;
  returntime: string;
  record_sha: string;
  remark: string;
}

export interface userListObject {
  id?: number;
  name: string;
  class: string;
  code: string;
  password: string | null;
  share_device: number;
  group: number;
  grade: string | number;
  reg_time: string | Date;
  join_time: string | Date;
}

export type UserList = userListObject[];

export interface UserSelectData extends Array<userListObject> {
  [key: number]: userListObject;
}

export interface GroupItem {
  id: number;
  name: string;
  desc: string;
  type: 'normal' | 'display' | 'close';
}

export type GroupList = GroupItem[];

export interface GroupUserList {
  [key: number]: UserList;
}

export type GroupPermissionItem = {
  id: number;
  object: string;
  open: number;
  remark: string | null;
  type: string;
  val: string;
};

export interface GroupPermissionObject {
  id?: number;
  name?: string;
  permissionsList?: GroupPermissionItem[];
}

export type GroupPermissionList = GroupPermissionObject[];

export type HandleChangeComponentFunctionType = (
  // 组件名
  componentName: string,
  // 是否切换侧边栏状态
  doNotToggleSideMenu?: boolean,
  // 是否需要推送路由
  needPush?: boolean,
  // 路由参数
  query?: object | null,
) => void;
