import { isArray } from 'lodash-es';
import { LocationQuery } from 'vue-router';

export function getURLAllParams(location: Location) {
  if (!location?.search) return {};
  const query = location?.search?.substring(1);
  const vars = query.split('&').filter(Boolean);
  const params: { [k: string]: string } = {};
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=').filter(Boolean);
    params[pair[0]] = pair[1];
  }
  return params;
}

export function getParams() {
  return (
    routerQuery: LocationQuery,
    location: Location,
    key: string | string[],
  ): { [key: string]: string | undefined } => {
    const cachedURLQuery = getURLAllParams(location);

    if (isArray(key)) {
      return key.reduce((acc, element) => {
        acc[element] = routerQuery?.[element] ?? cachedURLQuery?.[element] ?? undefined;
        return acc;
      }, {});
    }

    const value = (routerQuery?.[key] as string) ?? cachedURLQuery?.[key];
    return {
      [key]: value ?? undefined,
    };
  };
}
