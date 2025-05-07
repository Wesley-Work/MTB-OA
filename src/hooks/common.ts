import { routerMap } from '../config';
import { isNumber } from 'lodash-es';
import { RouteMaps, RouteMapItems } from '../types/type';
import useRequest from './useRequest';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

export function applyParmer(parmer: Object) {
  const keys: string[] = Object.keys(parmer);
  const kv: string[] = keys.map((key) => {
    return `${key}=${parmer[key]}`;
  });
  return kv.join('&');
}

export function VerifyToken() {
  return new Promise(async (resolve) => {
    const TOKEN = localStorage.getItem('token');
    if (!TOKEN) resolve(false);
    await useRequest({
      url: '/checkToken',
      methods: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        token: TOKEN,
      },
      success: function (res) {
        const RES = JSON.parse(res);
        if (RES.errcode == 0) {
          if (RES.data.verify === true) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      },
      error: function (err) {
        console.error(err);
        resolve(false);
      },
    });
  });
}

export function getRoutePathObj(
  map: RouteMaps = routerMap,
  value: string,
  deep = 0,
): { parent: RouteMapItems | null; current: RouteMapItems | null } {
  for (const item of map) {
    if (item?.key === value) {
      return {
        parent: null,
        current: item,
      };
    }
    if (item?.children) {
      const result = getRoutePathObj(item.children, value, deep + 1);
      if (result?.current) {
        return {
          parent: result?.parent ?? item,
          current: result.current,
        };
      }
    }
  }
  return { parent: null, current: null };
}

export function verifyPath(path: string, map = routerMap, deep = 0) {
  for (const item of map) {
    if (item?.key === path) {
      return true;
    }
    if (item?.children) {
      const result = verifyPath(path, item.children, deep + 1);
      if (result) {
        return true;
      }
    }
  }
  return false;
}

export function getCurrentPage() {
  const path = window.location.pathname.split('/').filter((item) => item !== '')[1];
  return path;
}

export function getToken() {
  return localStorage.getItem('token') ?? null;
}

const getAPIURL = () => {
  return 'https://oa-api.mtb.wesley.net.cn/v2';
};

const getSSOURL = () => {
  return import.meta.env.VITE_SSO_URL || '';
};

const getOAURL = () => {
  return import.meta.env.VITE_OA_URL || '';
};

const getLoginURL = () => {
  return import.meta.env.VITE_SSO_URL + `?backUrl=${getOAURL()}` || '';
};

export function Wesley() {
  return new Promise((resolve, reject) => {
    // 记录当前时间
    const nowTime = Date.now();
    // 获取内存中记录的时间
    const welseyTime = isNumber(localStorage.getItem('welseyTime')) ? Number(localStorage.getItem('welseyTime')) : 0;
    // 若时间差大于180秒，则将发起请求
    if (nowTime - welseyTime > 180000 || welseyTime === 0) {
      resolve(true);
    }
    fetch(`https://static.wesley.net.cn/sdzz/mtb/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // 记录当前时间
        localStorage.setItem('welseyTime', nowTime.toString());
        if (data.verify === false) {
          reject(false);
        }
        resolve(true);
      })
      .catch((error) => {
        console.error('[Wesley]: cannot verify!!!', error);
        resolve(false);
      });
  });
}

export const taskType = [
  { label: '常规任务', value: 0, theme: 'primary' },
  { label: '优先', value: 1, theme: 'self', color: 'rgb(177, 31, 38)' },
  { label: '加急', value: 2, theme: 'warning' },
  { label: '暂缓（保留任务）', value: 3, theme: 'default' },
];

export const taskStatus = [
  { label: '待办', value: 0, theme: 'self', color: 'rgb(177, 31, 38)' },
  { label: '统筹中', value: 1, theme: 'self', color: 'rgb(247, 199, 151)' },
  { label: '拍摄中', value: 2, theme: 'self', color: 'rgb(105, 158, 245)' },
  { label: '后期中', value: 3, theme: 'self', color: 'rgb(217, 113, 185)' },
  { label: '审核中', value: 4, theme: 'warning' },
  { label: '进行中', value: 5, theme: 'primary' },
  { label: '已完成', value: 6, theme: 'success' },
  { label: '未知', value: 7, theme: 'self', color: 'rgb(250, 145, 152)' },
  { label: '暂缓', value: 8, theme: 'default' },
];

export function getTagPriority(item) {
  // 优先级：2 > 1 > 0 > 3
  return item == 2 ? 0 : item == 1 ? 1 : item == 3 ? 3 : 2;
}

export function findObjectByValueAndKeyInArray(
  arr: Array<any>,
  key: string,
  value: string | number,
): object | undefined {
  for (const obj of arr) {
    if (obj[key] === value) {
      return obj;
    }
  }
}

export function taskTimeConvert(time: string): string;
export function taskTimeConvert(time: string[]): [string, string];
export function taskTimeConvert(time: string | string[]): string | [string, string] {
  // 辅助函数：将单个时间从'YYYY-MM-DD HH:mm'转换为指定格式
  function convertSingleTime(timeStr: string): string {
    const date = dayjs(timeStr, 'YYYY-MM-DD HH:mm');
    const YY = date.format('YY');
    const MM = date.format('MM');
    const DD = date.format('DD');
    const HH = date.format('HH');
    const mm = date.format('mm');

    return `${YY}年${MM}月${DD}日 ${HH}时${mm}分`;
  }

  // 主逻辑开始
  if (typeof time === 'string') {
    return convertSingleTime(time);
  } else if (Array.isArray(time) && time.length >= 2) {
    const firstDate = dayjs(time[0], 'YYYY-MM-DD HH:mm');
    const secondDate = dayjs(time[1], 'YYYY-MM-DD HH:mm');

    const daysDiff = secondDate.diff(firstDate, 'day');

    const firstFormatted = convertSingleTime(time[0]);

    if (daysDiff === 0) {
      // 如果与第一个值一天没差，那么只显示时间
      const secondFormatted = secondDate.format('HH时mm分');
      return [firstFormatted, secondFormatted];
    } else if (daysDiff < 30) {
      // 相差不到一个月
      const secondFormatted = secondDate.format('DD日 HH时mm分');
      return [firstFormatted, secondFormatted];
    } else if (daysDiff < 365 && firstDate.isSame(secondDate, 'year')) {
      // 相差不到一年但超过一个月，且是同一年
      const secondFormatted = secondDate.format('MM月DD日 HH时mm分');
      return [firstFormatted, secondFormatted];
    } else {
      // 相差一年以上
      const secondFormatted = convertSingleTime(time[1]);
      return [firstFormatted, secondFormatted];
    }
  } else {
    throw new Error('Invalid input type');
  }
}

export { getAPIURL, getSSOURL, getOAURL, getLoginURL };
