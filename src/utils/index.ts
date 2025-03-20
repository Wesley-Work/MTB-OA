export * from './fetch';

/**
 * 判断是否为内网[简单判断]
 */
export const isInternet = () => {
  const url = location.href;
  // 只判断146是因为服务部署于146段
  return (
    url.includes('10.3.146') ||
    url.includes('192.168.67') ||
    url.includes('mtb.sdzz.net') ||
    url.includes('internet-mtb.sdzz.wesley.net.cn')
  );
};

/**
 * 判断是否为在媒体部内[简单判断]
 */
export const isMTBInternet = () => {
  const url = location.href;
  return (
    url.includes('192.168.67') ||
    url.includes('mtb.sdzz.net') ||
    url.includes('internet-mtb.wesley.net.cn') ||
    url.includes('localhost')
  );
};

export const getInternetAPI = () => {
  return isMTBInternet() ? 'http://192.168.67.14/api' : 'http://10.3.146.11/api';
};
