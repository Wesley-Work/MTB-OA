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

// 防循环保护
let redirectCount = 0;
const MAX_REDIRECT_COUNT = 3;

router.beforeEach((to, _from, next) => {
  // 进度条
  if (typeof NProgress !== 'undefined') {
    NProgress.start();
  }

  // 如果是根路径且存在上次记录
  if (to.path === config.routerPrefix + '/') {
    const lastPath = localStorage.getItem('lastPath');
    const lastAccessTime = localStorage.getItem('lastPathAccessTime');

    // 构建完整路径
    const fullPath = config.routerPrefix + '/' + (lastPath || '');

    // 路径有效性校验
    const isValidPath = router.getRoutes().some((route) => {
      return route.path === fullPath;
    });

    // 时间有效性校验
    const isTimeValid = lastAccessTime && Date.now() - Number(lastAccessTime) < VALID_DURATION;

    // 防循环校验
    const isRedirectSafe = redirectCount < MAX_REDIRECT_COUNT;

    if (!isRedirectSafe) {
      console.warn('Router: Redirect count exceeded.', to, lastPath, lastAccessTime, isValidPath);
    }

    // 综合判断
    if (lastPath && isTimeValid && isValidPath && isRedirectSafe) {
      redirectCount++;
      next({ path: fullPath, query: to.query });
    } else {
      redirectCount = 0;
      localStorage.removeItem('lastPath');
      localStorage.removeItem('lastPathAccessTime');
      next();
    }
  } else {
    redirectCount = 0;
    if (to.path !== config.routerPrefix + '/') {
      const path = to.path.replace(config.routerPrefix + '/', '');
      localStorage.setItem('lastPath', path);
      localStorage.setItem('lastPathAccessTime', Date.now().toString());
    }
    next();
  }
});

router.afterEach((to) => {
  if (typeof NProgress !== 'undefined') {
    NProgress.done();
  }
  // 保存当前路径和访问时间
  if (to.path !== config.routerPrefix + '/') {
    const path = to.path.replace(config.routerPrefix + '/', '');
    localStorage.setItem('lastPath', path);
    localStorage.setItem('lastPathAccessTime', Date.now().toString());
  }
});

export default router;
