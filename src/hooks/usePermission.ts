import { getToken } from './common';
import useRequest from './useRequest';
import { isString, isArray } from 'lodash-es';

export var userPermissions = [];

/**
 * @loadUserPermissions
 * @获取登录的用户权限
 */
export function loadUserPermissions(): Promise<Array<string> | string> {
  return new Promise((resolve, reject) => {
    useRequest({
      url: '/permissions/userHasPermissions',
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode == 0) {
          userPermissions = RES.data;
          resolve(RES.data);
        }
        reject(RES);
      },
      error: function (err) {
        console.error(err);
        reject(err);
      },
    });
  });
}

/**
 * @loadSystemPermissions
 * @获取系统权限
 */
export function loadSystemPermissions() {
  return new Promise((resolve, reject) => {
    useRequest({
      url: '/permissions/systemlist',
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode == 0) {
          resolve(RES.data);
        } else {
          reject(RES);
        }
      },
      error: function (err) {
        console.error(err);
        reject(err);
      },
    });
  });
}

/**
 * @loadUserPermissionsList
 * @获取全部用户权限
 */
export function loadUserPermissionsList() {
  return new Promise((resolve, reject) => {
    useRequest({
      url: '/permissions/userlist',
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode == 0) {
          resolve(RES.data);
        } else {
          reject(RES);
        }
      },
      error: function (err) {
        console.error(err);
        reject(err);
      },
    });
  });
}

/**
 * @VerifyPermissions
 * @判断用户是否具有指定权限
 * @param hasPermission 用户拥有的权限列表
 * @param needPermission 需要的权限（可以是单个字符串或字符串数组）
 * @returns 是否拥有所有需要的权限
 */
export function VerifyPermissions(hasPermission: string[], needPermission: string | string[]): boolean {
  // 将needPermission转换为数组
  const needs = Array.isArray(needPermission) ? needPermission : [needPermission];
  // 定义一个函数来检查单个权限是否满足
  function matches(permission: string, requiredPermission: string): boolean {
    try {
      var permissionParts = permission.split('.');
      var requiredParts = requiredPermission.split('.');
    } catch {
      if (!requiredPermission) {
        return true;
      }
    }
    // 特殊处理 *.*
    if (permission === '*.*') {
      return true;
    }
    // 处理通配符 *
    for (let i = 0; i < requiredParts.length; i++) {
      if (permissionParts[i] === '*' || requiredParts[i] === '*') {
        // 如果当前部分是'*'，则继续比较后续部分
        continue;
      }
      if (permissionParts[i] !== requiredParts[i]) {
        return false;
      }
    }
    // 如果所有部分都匹配，则返回true
    return true;
  }
  // 检查每个需要的权限
  for (const need of needs) {
    let hasMatch = false;
    for (const perm of hasPermission) {
      if (matches(perm, need)) {
        hasMatch = true;
        break;
      }
    }
    // 如果有任何一个need没有匹配到，则返回false
    if (!hasMatch) {
      return false;
    }
  }
  // 所有需要的权限都匹配上了
  return true;
}

export function TEST__VerifyPermissions() {
  console.log('[PermissionTEST]', VerifyPermissions(['*.*'], ['a.b'])); // true
  console.log('[PermissionTEST]', VerifyPermissions(['*.*'], ['a.b.c'])); // true
  console.log('[PermissionTEST]', VerifyPermissions(['a.b.c'], ['a.b.c'])); // true
  console.log('[PermissionTEST]', VerifyPermissions(['a.b.*'], ['a.b.c'])); // true
  console.log('[PermissionTEST]', VerifyPermissions(['a.b.*'], ['a.b.d'])); // true
  console.log('[PermissionTEST]', VerifyPermissions(['a.*.*'], ['a.c.b'])); // true
  console.log('[PermissionTEST]', VerifyPermissions(['*.*.*'], ['a.c.b'])); // true
  console.log('[PermissionTEST]', VerifyPermissions(['*.*.*'], ['a.c'])); // true
  console.log('[PermissionTEST]', VerifyPermissions(['a.b.c'], ['a.c.b'])); // false
  console.log('[PermissionTEST]', VerifyPermissions(['a.*'], ['f.g.h'])); // false
  console.log('[PermissionTEST]', VerifyPermissions(['a.*'], ['f.h'])); // false
}

/**
 * @param needPermissions
 * @缓存版校验权限，限制：需要调用过loadUserPermissions才能用
 * 检查用户权限、匹配用户权限
 * 传入值为Array则会判断用户权限是否包含在该数组内，包含其一就会返回true
 * 权限合法值：a.b a.b.c
 * @returns boolean
 * @deprecated 请使用 VerifyPermissions 替代
 */
export function checkPermission(needPermissions: string | Array<string>) {
  if (isString(needPermissions)) {
    return userPermissions.includes(needPermissions);
  }
  if (isArray(needPermissions)) {
    if (needPermissions.length == 0) {
      return true;
    }
    // 遍历needPermissions
    needPermissions.forEach((item) => {
      if (userPermissions.includes(item) || userPermissions.includes('*.*')) {
        return true;
      }
      // 判断是否有某权限的根权限
      const permissionItem = item.split('.');
      var p = '';
      for (const i in permissionItem) {
        const element = permissionItem[i];
        p = p + element;
        if (userPermissions.includes(p)) {
          return true;
        }
      }
    });
  }
  return false;
}
