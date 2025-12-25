import { defineComponent, PropType, ref } from 'vue';
import { VerifyPermissions } from '../hooks/usePermission';
import Error from './pages/Error.vue';
import NoPermissions from './pages/NoPermissions.vue';
import { useRoute } from 'vue-router';
import { isInternet as isSdzzInternet, isMTBInternet, isInternal as checkInternal } from '@/utils';
import OnlyInternet from './pages/onlyInternet.vue';
import { throttle } from 'lodash-es';

export default defineComponent({
  props: {
    handleChangeComponent: {
      type: Function as PropType<(...args: any[]) => any>,
    },
    userPermissions: {
      type: Array<string>,
      default: [],
    },
    componentPermissions: {
      type: Array<string>,
      default: [],
    },
    component: {
      type: String,
    },
  },
  setup(props) {
    const vPermission = VerifyPermissions(props.userPermissions, props.componentPermissions);
    const route = useRoute();
    const isInternal = ref(false);
    const cons = () => {
      console.info(
        `页面: ${props.component} 校验权限：`,
        vPermission,
        props.userPermissions,
        props.componentPermissions,
      );
    };
    throttle(cons, 500)?.();
    return () => {
      const needInternet = !!route.meta?.needInternet;
      if (needInternet) {
        // 更细化地判断是否为内网
        setTimeout(async () => {
          isInternal.value = (await checkInternal()) || isSdzzInternet() || isMTBInternet();
        });
      }
      try {
        const RouterView = <router-view handleChangeComponent={props?.handleChangeComponent}></router-view>;
        return needInternet ? (
          isInternal.value ? (
            RouterView
          ) : (
            <OnlyInternet />
          )
        ) : vPermission ? (
          RouterView
        ) : (
          <NoPermissions />
        );
      } catch (err) {
        console.error(err);
        return <Error msg={err}></Error>;
      }
    };
  },
});
