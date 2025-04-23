import { NotifyPlugin } from 'tdesign-vue-next';
import { getAPIURL, getLoginURL, getToken } from './common';
import { config } from '../config';
import { RequestHooksOptions, RequestResponseData } from '@/types/type';
import { merge, omit } from 'lodash-es';
function SpliceParameter(DATA: Object) {
  if (Object.prototype.toString.call(DATA) !== '[object Object]') return false;
  // PASS
  const ParameterOBJ = [];
  for (const [key, value] of Object.entries(DATA)) {
    const keys = encodeURIComponent(key);
    const values = value === null ? '' : encodeURIComponent(value);
    ParameterOBJ.push(`${keys}=${values}`);
  }
  const ParameterSRT = ParameterOBJ.join('&');
  return ParameterSRT;
}

/**
 * 请求后端公共方法
 * @ 支持传入方法或Promise形式获取结果
 * @useRequest
 * @param option
 * @returns Promise
 * @example
 * useRequest({
 *  url: URL,
 *  methods: METHODS,
 *  header: object,
 *  data: object,
 *  success: function,
 *  error: function,
 * })
 *
 */
export function useRequest(option: RequestHooksOptions) {
  return new Promise<Boolean | string>(async (resolve, reject) => {
    try {
      function emitComplete(res) {
        if (option.complete && typeof option.complete === 'function') {
          option.complete(res);
        }
      }
      function emitError(et, res) {
        if (option.error && typeof option.error === 'function') {
          option.error(res);
        }
        console.error(et, res);
        emitComplete(res);
        reject(res);
      }
      function emitSuccess(res: RequestResponseData) {
        if (option.success && typeof option.success === 'function') {
          option.success(JSON.stringify(res));
        }
        emitComplete(JSON.stringify(res));
        resolve(JSON.stringify(res));
      }
      if (Object.prototype.toString.call(option) !== '[object Object]') resolve(false);

      const headers = {};
      // 优先header使用提供的内容 若没提供则使用默认值
      headers['Content-Type'] = option?.header?.['Content-Type'] ?? 'application/x-www-form-urlencoded; charset=UTF-8';
      headers['TOKEN'] = option?.token ?? option?.header?.['TOKEN'] ?? getToken() ?? null;
      // 合并两个object 排除contentType和token
      const headersMerge = merge(headers, omit(option?.header, ['Content-Type', 'TOKEN', 'token']));
      // fetch 请求
      await fetch(option?.useCustomURL ? option?.url : getAPIURL() + option?.url, {
        method: option?.methods ? option?.methods.toUpperCase() : 'GET',
        headers: {
          ...headersMerge,
        },
        body: SpliceParameter(option?.data) || null,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .then((data) => {
          if (data.errcode === -1003) {
            console.error('Token Timeout!');
            emitError('TokenTimeout', data);
            if (config.loginVerify) {
              NotifyPlugin('error', {
                title: '登录已过期，请重新登录',
                duration: 0,
              });
              setTimeout(() => {
                location.href = getLoginURL();
              }, 2000);
            }
          } else if (data.errcode === -1005) {
            NotifyPlugin('error', {
              title: '操作失败',
              content: '无权限！',
            });
          } else {
            emitSuccess(data);
          }
        })
        .catch((err) => {
          emitError('RequestError', err);
        })
        .finally(() => {});
    } catch (e) {
      console.error('XHR Module Error: ', e);
    }
  });
}

export default useRequest;
