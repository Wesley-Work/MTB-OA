import { useRoute } from 'vue-router';

export const getAPI_URL = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:51001/v2';
  }
  return 'https://oa-api.mtb.wesley.net.cn/v2';
};

export const getWeCom_API = () => {
  return 'https://wecom.wesley.net.cn';
};

export const getHIK_API = () => {
  return 'http://hik-api.sdzzmtb.cn:8000';
};

export const getBossCOS_URL = () => {
  return 'https://cos.boss.sdzzmtb.cn';
};

export const BossCOSName = 'mtb-boss-1301115031';

export const COS_DefaultURL = 'cos.ap-guangzhou.myqcloud.com';

export const getSSO_URL = () => {
  return `https://sso.sdzzmtb.cn/`;
};

export const getOA_URL = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:7271/';
  }
  return 'https://oa.sdzzmtb.cn/';
};

export const getLogin_URL = () => {
  return `https://sso.sdzzmtb.cn/?backUrl=${getOA_URL()}`;
};

export const isDevMode = () => {
  const route = useRoute();
  if (route.query?.dev === 'true') {
    return true;
  }
  if (import.meta.env.DEV) {
    return true;
  }
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return true;
  }
  return false;
};
