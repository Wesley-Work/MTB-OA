import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import RenderComponents from './components/index.tsx';
import { routerMap } from './components/config';
import { config } from './components/config'
import NProgress from 'nprogress'

function getRoutes(docs, type) {
  let docsRoutes = [];
  let docRoute;

  docs.forEach((item) => {
    const docType = item.type || type;
    let { children } = item;
    if (children) {
      docsRoutes = docsRoutes.concat(getRoutes(children, docType));
    } else {
      docRoute = { 
        path: config.routerPrefix + "/" + item.key,
        ...item
    };
      docsRoutes.push(docRoute);
    }
  });
  console.log(docsRoutes);
  return docsRoutes;
}

const routes = [
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

const routerConfig = {
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
