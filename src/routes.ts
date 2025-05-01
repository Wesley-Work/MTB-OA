import { createRouter, createWebHashHistory, RouteRecordRaw, RouterOptions } from 'vue-router';
import RenderComponents from './components/index';
import { routerMap, config } from './config';
import NProgress from 'nprogress';
import { RouteMaps } from './types/type';

function getRoutes(docs: RouteMaps, type: string = undefined) {
  let docsRoutes = [];
  let docRoute;

  docs.forEach((item) => {
    const docType = item?.type || type;
    const { children } = item;
    if (children) {
      docsRoutes = docsRoutes.concat(getRoutes(children, docType));
    } else {
      docRoute = {
        path: config.routerPrefix + '/' + item.key,
        ...item,
      };
      docsRoutes.push(docRoute);
    }
  });
  // console.log(docsRoutes);
  return docsRoutes;
}

const routes: RouteRecordRaw[] = [
  {
    path: config.routerPrefix + '/',
    component: RenderComponents,
    children: [...getRoutes(routerMap)],
  },
  {
    path: '/',
    redirect: config.routerPrefix + '/',
  },
  {
    path: '/:w+',
    redirect: config.routerPrefix + '/',
  },
];

const routerConfig: RouterOptions = {
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from) {
    if (to.path !== from.path) {
      return { top: 0 };
    }
  },
};

const router = createRouter(routerConfig);

// 上次路由的有效时间
const VALID_DURATION = 24 * 60 * 60 * 1000; // 24小时，单位是毫秒

router.beforeEach((to, from, next) => {
  // 进度条
  if (typeof NProgress !== 'undefined') {
    NProgress.start();
  }

  // 如果是根路径，且有上次访问的路径，则重定向到上次的路径
  if (to.path === config.routerPrefix + '/') {
    const lastPath = localStorage.getItem('lastPath');
    const lastAccessTime = localStorage.getItem('lastPathAccessTime');

    // 检查路径和时间戳是否存在，并且是否在有效期内
    if (lastPath && lastAccessTime && Date.now() - Number(lastAccessTime) < VALID_DURATION) {
      next({ path: lastPath });
    } else {
      // 如果路径无效或超时，清除存储的路径和时间戳
      localStorage.removeItem('lastPath');
      localStorage.removeItem('lastPathAccessTime');
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (typeof NProgress !== 'undefined') {
    NProgress.done();
  }
  // 保存当前路径和访问时间
  if (to.path !== config.routerPrefix + '/') {
    localStorage.setItem('lastPath', to.path);
    localStorage.setItem('lastPathAccessTime', Date.now().toString());
  }
});

export default router;
