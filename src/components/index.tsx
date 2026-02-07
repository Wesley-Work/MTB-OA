import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue';
import { VerifyPermissions } from '../hooks/usePermission';
import Error from './pages/Error.vue';
import NoPermissions from './pages/NoPermissions.vue';
import { useRoute } from 'vue-router';
import { isInternet as isSdzzInternet, isMTBInternet, isInternal as checkInternal } from '@/utils';
import OnlyInternet from './pages/onlyInternet.vue';
import { throttle } from 'lodash-es';
import { watermarkText } from '@/config';
import { Watermark } from 'tdesign-vue-next';
import { useDisabledDevtool } from '@/hooks/useDisabledDevtool';
import NotDevtool from './pages/NotDevtool.vue';
import { isDevMode } from '@/utils/common';

export default defineComponent({
  inheritAttrs: false,
  props: {
    userName: {
      type: String,
    },
    userCode: {
      type: String,
    },
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
    showWatermark: {
      type: Boolean,
      default: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    fullscreenToggle: {
      type: Function as PropType<(...args: any[]) => any>,
    },
  },
  setup(props) {
    const route = useRoute();
    const isInternal = ref(false);
    const needDisableDevtool = computed(() => route.meta?.disableDevtool === true);
    const { detected, start, stop } = useDisabledDevtool();

    watch(
      needDisableDevtool,
      (enable) => {
        if (enable) start();
        else stop();
      },
      { immediate: true },
    );

    return () => {
      const { userPermissions, componentPermissions } = toRefs(props);

      const vPermission = VerifyPermissions(userPermissions.value, componentPermissions.value);
      const needInternet = !!route.meta?.needInternet;

      const cons = () => {
        console.info(
          `页面: ${props.component} 校验权限：`,
          vPermission,
          userPermissions.value,
          componentPermissions.value,
        );
      };
      throttle(cons, 500)?.();

      if (needInternet) {
        // 更细化地判断是否为内网
        setTimeout(async () => {
          isInternal.value = (await checkInternal()) || isSdzzInternet() || isMTBInternet();
        });
      }

      if (needDisableDevtool.value && !isDevMode()) {
        console.warn('当前页面已经开启开发者工具检测，检测结果:', detected.value);
      }

      try {
        const RouterView = props.showWatermark ? (
          <Watermark
            watermarkContent={[
              { text: `${props.userName || '未知用户'}(${props.userCode})` },
              { text: watermarkText },
              { text: '保密信息 禁止外泄' },
            ]}
            y={130}
            x={20}
            width={360}
            height={50}
            line-space={20}
            removable={false}
            layout="hexagonal"
            zIndex={99999}
          >
            <router-view
              class="narrow-scrollbar"
              handleChangeComponent={props?.handleChangeComponent}
              userName={props.userName}
              userCode={props.userCode}
              userPermissions={props.userPermissions}
              componentPermissions={props.componentPermissions}
              component={props.component}
              showWatermark={props.showWatermark}
              fullscreen={props.fullscreen}
              fullscreenToggle={props.fullscreenToggle}
            ></router-view>
          </Watermark>
        ) : (
          <router-view
            handleChangeComponent={props?.handleChangeComponent}
            userName={props.userName}
            userCode={props.userCode}
            userPermissions={props.userPermissions}
            componentPermissions={props.componentPermissions}
            component={props.component}
            showWatermark={props.showWatermark}
            fullscreen={props.fullscreen}
            fullscreenToggle={props.fullscreenToggle}
          ></router-view>
        );

        // Devtool检测-已打开
        if (needDisableDevtool.value && detected.value) {
          return <NotDevtool />;
        }
        // 权限检测-无权限
        else if (!vPermission) {
          return <NoPermissions />;
        }
        // 内网检测-是内网则放行
        else if (needInternet && isInternal.value) {
          return RouterView;
        }
        // 内网检测-非内网
        else if (needInternet) {
          return RouterView;
        }
        // 权限检测-通过
        else if (vPermission) {
          return RouterView;
        }

        return <Error msg="未能判断目标页面"></Error>;
      } catch (err) {
        console.error(err);
        return <Error msg={err}></Error>;
      }
    };
  },
});
