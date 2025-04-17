import { createRouter, createWebHashHistory, RouteRecordRaw, RouterOptions } from 'vue-router';
import RenderComponents from './components/index';
import { routerMap, config } from './components/config';
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
    redirect: config.routerPrefix + '/Content',
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
    // eslint-disable-next-line no-undef
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  if (typeof NProgress !== 'undefined') {
    // eslint-disable-next-line no-undef
    NProgress.done();
  }
});

export default router;
