import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import RenderComponents from './components/index.tsx';
import { routerMap } from './components/config';

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
        path: "/system/" + item.key,
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
    path: '/system/',
    redirect: '/system/Content',
    component: RenderComponents,
    children: [...getRoutes(routerMap)],
  },
  {
    path: '/',
    redirect: '/system/',
  },
  {
    path: '/:w+',
    redirect: '/system/',
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

// router.beforeEach((to, from, next) => {
//   if (typeof NProgress !== 'undefined') {
//     // eslint-disable-next-line no-undef
//     NProgress.start();
//   }
//   next();
// });

// router.afterEach(() => {
//   if (typeof NProgress !== 'undefined') {
//     // eslint-disable-next-line no-undef
//     NProgress.done();
//   }
//   document.querySelector('td-stats')?.track?.();
// });

export default router;
