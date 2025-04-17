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

router.beforeEach((to, from, next) => {
  // 进度条
  if (typeof NProgress !== 'undefined') {
    NProgress.start();
  }

  // 如果是根路径，且有上次访问的路径，则重定向到上次的路径
  if (to.path === config.routerPrefix + '/' && localStorage.getItem('lastPath')) {
    next({ path: localStorage.getItem('lastPath') });
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (typeof NProgress !== 'undefined') {
    NProgress.done();
  }
  // 保存当前路径
  if (to.path !== config.routerPrefix + '/') {
    localStorage.setItem('lastPath', to.path);
  }
});

export default router;
