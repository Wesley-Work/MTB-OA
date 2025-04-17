export * from './fetch';
export * from './theme';

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

export const getInternetWeb = () => {
  return isMTBInternet() ? 'http://192.168.67.14' : 'http://10.3.146.11';
};

export const guessFileTypeByFileName = (fileName: string): string => {
  const ext = fileName.toLowerCase().split('.').pop() || '';

  // 常见文件类型映射表
  const typeMap: Record<string, string[]> = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'rtf', 'txt'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
    audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'],
    video: ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'webm'],
    code: ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'py', 'java', 'php', 'json'],
    font: ['ttf', 'otf', 'woff', 'woff2'],
    config: ['yaml', 'yml', 'ini', 'conf', 'env'],
    spreadsheet: ['csv', 'tsv'],
    executable: ['exe', 'dmg', 'pkg', 'deb', 'rpm'],
  };

  // 特殊处理复合扩展名
  const compoundExtMap: Record<string, string> = {
    'tar.gz': 'archive',
    'tar.bz2': 'archive',
  };

  // 检查复合扩展名
  const lastTwoParts = fileName.toLowerCase().split('.').slice(-2).join('.');
  if (compoundExtMap[lastTwoParts]) {
    return compoundExtMap[lastTwoParts];
  }

  // 遍历类型映射表
  for (const [type, exts] of Object.entries(typeMap)) {
    if (exts.includes(ext)) {
      return type;
    }
  }

  // 未匹配的默认类型
  return 'other';
};
