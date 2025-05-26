<template>
  <!--顶部菜单-->
  <t-head-menu
    v-if="TitleMenu.show"
    style="
      transition: all 0.28s cubic-bezier(0.645, 0.045, 0.355, 1);
      position: fixed;
      top: 0px;
      z-index: 10;
      user-select: none;
    "
  >
    <template #logo>
      <div style="width: 40px; height: 40px; margin-left: 13px; display: flex; align-items: center">
        <t-button
          shape="square"
          variant="text"
          style="border: none; width: 40px; height: 40px"
          :on-click="ToggleSideMenu"
        >
          <template #icon><t-icon name="bulletpoint" style="width: 25px; height: 25px" /></template>
        </t-button>
      </div>
      <span style="font-size: 21px; font-weight: bold; margin-left: 18px; user-select: none">{{ TitleMenu.text }}</span>
    </template>
    <template #operations>
      <t-popup trigger="click">
        <t-badge dot :count="hasMessageNotRead ? 1 : 0" :offset="[-7, 0]">
          <a href="javascript:void(2);" title="消息列表" style="display: flex; margin-right: 8px">
            <t-icon class="t-menu__operations-icon" name="mail" style="width: 36px; height: 36px" />
          </a>
        </t-badge>
        <template #content>
          <div class="header-msg">
            <div class="header-msg-top">
              <p>通知</p>
              <!-- <t-button variant="text" theme="primary" style="position: absolute; top: 12px; right: 24px;">清空</t-button> -->
            </div>
            <t-list :split="true" class="narrow-scrollbar">
              <t-list-item v-for="(item, index) in messageList" :key="index">
                <template #content>
                  <div>
                    <p class="msg-content">{{ item.d }} [{{ item.tid }}#]</p>
                    <p class="msg-type">{{ item.title }}</p>
                  </div>
                  <p class="msg-time">{{ item.post_time }}</p>
                </template>
                <template #action>
                  <t-button size="small" variant="outline">标为已读</t-button>
                </template>
              </t-list-item>
            </t-list>
            <div class="header-msg-bottom">
              <t-button class="header-msg-bottom-link" variant="text" theme="primary" @click="viewAllMessage"
                >查看全部</t-button
              >
            </div>
          </div>
        </template>
      </t-popup>
      <a href="javascript:void(0);" title="切换样式" style="display: flex; margin-right: 8px">
        <t-icon
          class="t-menu__operations-icon"
          :name="theme ? 'sunny' : 'moon'"
          style="width: 36px; height: 36px"
          @click="ToggleTheme()"
        />
      </a>
      <a href="javascript:void(1);" title="重载页面" style="display: flex; margin-right: 8px" @click="PageReload">
        <t-icon class="t-menu__operations-icon" name="refresh" style="width: 36px; height: 36px" />
      </a>
      <div style="display: flex; min-width: 120px">
        <t-dropdown
          :options="MainContent.AccountMenuOptions"
          trigger="click"
          :popup-props="{
            overlayInnerStyle: (triggerElem) => ({
              width: `${triggerElem.offsetWidth}px`,
            }),
          }"
        >
          <t-button variant="text" class="we-tag-headmenu-operations-account" block>
            <t-icon name="user-circle" style="min-width: 20px; min-height: 20px" />
            <span style="text-overflow: ellipsis; overflow: hidden; max-width: 100%; margin-left: 8px">
              {{ login_info.name }}
            </span>
            <template #suffix> <t-icon name="chevron-down" size="16" /></template>
          </t-button>
        </t-dropdown>
      </div>
    </template>
  </t-head-menu>
  <!--侧边菜单-->
  <SideMenus
    :theme="theme ? 'dark' : 'light'"
    :value="SideMenu.value"
    :user-permissions="login_info.permissions"
    height="550px"
    :visiable="SideMenu.show"
    :value-change="handleChangeComponent"
  ></SideMenus>
  <!--BackTop-->
  <div
    style="
      box-sizing: border-box;
      transition: all 0.2s ease 0s;
      position: fixed;
      right: 32px;
      bottom: 120px;
      z-index: 300;
    "
  >
    <t-back-top
      style="position: relative"
      :visible-height="720"
      size="small"
      :offset="[0, 0]"
      theme="light"
    ></t-back-top>
  </div>
  <!-- if show sidemenu need margin-left: 232px;-->
  <div
    style="padding: 24px"
    class="MainContent"
    :class="{
      'SideMenuShow-MainContent': SideMenu.show,
      SideMenuUseCollapsed: menuUseCollapsed && !SideMenu.show,
    }"
    :NoShowMenu="!TitleMenu.show"
  >
    <BreadCrumb :value="MainContent.ComponentValue"></BreadCrumb>
    <section
      class="loading-change-components-animation"
      :class="{
        'loading-change-components-in': MainContent.classIn,
        'loading-change-components-out': MainContent.classOut,
      }"
      :page="SideMenu.value"
    >
      <PageTooSmall v-if="pageSmall" />
      <router-view
        v-else
        :handle-change-component="handleChangeComponent"
        :user-permissions="login_info.permissions"
        :component-permissions="componentPermissions"
        :component="SideMenu.value"
        :user-code="login_info.code"
      ></router-view>
      <!---->
      <div id="copyright">
        <div>
          Powered By
          <a href="https://www.wesley.net.cn/" we-a-tag target="_blank" @click.prevent="NotClick">Wesley</a>
          | Designed By
          <a href="https://tdesign.tencent.com/" we-a-tag target="_blank" @click.prevent="NotClick">Tencent</a>
          |
          <a href="https://github.com/Wesley-Work/MTB-OA" we-a-tag target="_blank" @click.prevent="NotClick"
            >Repository·Github</a
          >
        </div>
        <!-- 广告位 -->
        <!-- <div>由 <a href="javaScript:void(0);" we-a-tag>DEBUG-SDZZ</a> 提供技术支持</div> -->
        <div></div>
        <div>
          Copyright © 2025
          <a href="https://www.wesley.net.cn/" we-a-tag target="_blank" @click.prevent="NotClick">Wesley.</a>
          All Right Reserved. | Used by MTB with permission
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="tsx">
import SideMenus from '../hooks/useMenu';
import BreadCrumb from '../hooks/useBreadcrumb';
import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { themeMode, toggleTheme } from '../utils/theme';
import {
  config,
  routerMap,
  useViewTransition,
  allowHotUpdate,
  packageVersion,
  routerPrefix,
  systemName,
  loginVerify,
  menuUseCollapsed,
} from '../config';
import { PoweroffIcon, UserPasswordIcon } from 'tdesign-icons-vue-next';
import { NotifyPlugin } from 'tdesign-vue-next';
import { getCurrentPage, verifyPath, getSSOURL, getLoginURL, getRoutePathObj, VerifyToken } from '../hooks/common';
import { useRequest } from '../hooks/useRequest';
import PageTooSmall from '../components/pages/PageSmall.vue';
import { useRoute, useRouter } from 'vue-router';
import type { LocationQueryRaw } from 'vue-router';
import { getParams, getURLAllParams } from '@hooks/useParams';
import { isEmpty, isObject } from 'lodash-es';

const router = useRouter();
const route = useRoute();

watch(
  () => router.currentRoute.value.path,
  (val) => {
    const v = val.replace(routerPrefix + '/', '');
    SideMenu.value = v;
  },
);

const getParamsData = getParams();
const componentPermissions = ref([]);
const TitleMenu = reactive({
  text: systemName,
  show: true,
});
const SideMenu = reactive({
  value: 'Content',
  show: false,
});
const MainContent = reactive({
  classIn: false,
  classOut: false,
  lastChoose: 'Content',
  ComponentValue: 'login',
  AccountMenuOptions: [
    // { content: '个人中心', value: 1, prefixIcon: <UserIcon /> },
    // {
    //   content: '遇到问题',
    //   value: 2,
    //   prefixIcon: <ChatBubbleHelpIcon />,
    // },
    {
      content: '修改密码',
      value: 4,
      prefixIcon: <UserPasswordIcon />,
      onClick: () => {
        goChangePws();
      },
    },
    {
      content: '退出登录',
      value: 3,
      prefixIcon: <PoweroffIcon />,
      onClick: () => {
        logout();
      },
    },
  ],
});
const login_info = reactive({
  name: '-',
  code: '-',
  permissions: [],
  login_time: '',
});
const timer = reactive({
  token: null,
  isChecking: false,
});
const theme = ref(false);
const pageSmall = ref(false);
const messageList = ref([]);
const hasMessageNotRead = computed(() => {
  return messageList.value.filter((item) => item.onread === 0).length > 0;
});

const getComponentPermissions = (componentName) => {
  const { current } = getRoutePathObj(routerMap, componentName);
  return current?.permissions ?? [];
};

watch(
  () => SideMenu.value,
  (val) => {
    componentPermissions.value = getComponentPermissions(val);
  },
);

router.afterEach(() => {
  // 应用动画
  setTimeout(() => {
    MainContent.classOut = false;
    MainContent.classIn = true;
    setTimeout(() => {
      MainContent.classIn = false;
    }, 280);
  }, 280);
});

const viewAllMessage = () => {
  handleChangeComponent('MessageList', true);
};

const getMessage = () => {
  useRequest({
    url: `/message/MyMessage`,
    methods: 'POST',
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode != 0) {
        NotifyPlugin.error({
          title: '获取消息内容失败',
          content: result.errmsg,
        });
        return;
      }
      messageList.value = result.data;
      console.info(
        `${login_info.name}[${login_info.code}] 消息列表：`,
        messageList.value.filter((item) => item.onread === 0),
      );
    },
    error: function (err) {
      console.error(err);
    },
  });
};

// 获取用户权限
const LoadUserPermissions = (TOKEN: string = localStorage.getItem('token')) => {
  try {
    useRequest({
      url: '/permissions/userHasPermissions',
      methods: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        token: TOKEN,
      },
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode == 0) {
          login_info.permissions = RES.data;
        }
      },
      error: function (err) {
        console.error(err);
      },
    });
  } catch (e) {
    console.error('Unable to load User permissions', e);
  }
};

/**
 * @getUserInfoByToken
 * @获取用户信息
 * @param token
 */
const getUserInfoByToken = (TOKEN) => {
  useRequest({
    url: '/getLoginUserInfo',
    methods: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: TOKEN,
    },
    success: function (res) {
      var RES = JSON.parse(res);
      if (RES.errcode == 0) {
        login_info.code = RES.data.usercode;
        login_info.name = RES.data.name;
        login_info.login_time = RES.data.login_time;
      }
    },
    error: function (err) {
      console.error(err);
    },
  });
};

/**
 * @checkToken
 * @检查Token时效
 */
const checkToken = () => {
  if (timer.isChecking) {
    return;
  }
  timer.isChecking = true;
  // 统一使用useRequest，抛弃XHR请求方式
  useRequest({
    url: '/checkToken',
    methods: 'POST',
    success: function (res) {
      var result = JSON.parse(res);
      if (result.errcode != 0 || !result.data.verify) {
        // loginState invalid
        cancelCheckToken();
        location.href = getLoginURL();
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin('error', {
        title: '遇到错误',
        content: '无法检测Token状态，请尝试重新登录',
        duration: 0,
      });
      cancelCheckToken();
    },
    complete: function () {
      timer.isChecking = false;
    },
  });
};

/**
 * @startCheckToken
 * @开始循环检查Token
 */
const startCheckToken = () => {
  console.warn('[CheckToken] START');
  timer.token = setInterval(() => {
    checkToken();
  }, 2500);
};

/**
 * @cancelCheckToken
 * @取消循环检查Token
 */
const cancelCheckToken = () => {
  console.warn('[CheckToken] CANCEL');
  clearInterval(timer.token);
  timer.isChecking = false;
};

/**
 * @GetPageWidth
 * @获取页面宽度并检测是否过小
 */
const GetPageWidth = (e) => {
  if (e.currentTarget.parent.innerWidth < config.minWidth) {
    console.warn('尺寸过小！');
    pageSmall.value = true;
  } else {
    pageSmall.value = false;
  }
};

/**
 * @ToggleTheme
 * @切换样式
 */
const ToggleTheme = () => {
  // 是否使用view-transition API
  if (document.startViewTransition && useViewTransition) {
    document.startViewTransition(() => {
      toggleTheme();
    });
  } else {
    toggleTheme();
  }
  theme.value = ThemeMode();
};

/**
 * @ThemeMode
 * @获取主题模式
 */
const ThemeMode = () => {
  return themeMode();
};

/**
 * @ToggleSideMenu
 * @切换侧边菜单显示
 */
const ToggleSideMenu = () => {
  SideMenu.show = !SideMenu.show;
};

const handleChangeComponent = (
  componentName: string,
  doNotToggleSideMenu = false,
  needPush = true,
  query: object | null = {},
) => {
  // 与当前页面相同或
  if (!VerifyPath(componentName)) {
    console.error(`[handleChangeComponent]: 不会切换到页面(组件)[${componentName}]，因为页面不存在！`);
    return false;
  }
  componentPermissions.value = getComponentPermissions(componentName);
  MainContent.lastChoose = componentName;
  SideMenu.value = componentName;
  // 若菜单不是Collapsed模式，则判断当前菜单是否为展开状态，若是则关闭
  if (menuUseCollapsed && SideMenu.show && !menuUseCollapsed) {
    doNotToggleSideMenu ? null : ToggleSideMenu();
  }
  // 应用动画
  MainContent.classOut = true;
  setTimeout(() => {
    if (needPush) {
      router.push({
        path: `${routerPrefix}/${componentName}`,
        query: {
          ...route.query,
          ...(query as LocationQueryRaw),
        },
      });
    }
    MainContent.ComponentValue = componentName;
  }, 200);
};

const logout = () => {
  location.href = getSSOURL() + '?actionType=logout';
};

const goChangePws = () => {
  location.href = getSSOURL() + '?actionType=change-Password';
};

const PageReload = () => {
  location.reload();
};

/**
 * @NotClick
 * @阻止a标签默认点击事件，防止跳转到站外链接
 */
const NotClick = () => {
  if (config.aTagDoNotNav) {
    NotifyPlugin('warning', {
      title: '操作失败',
      content: '根据相关规则，不允许跳转站外链接',
    });
    return false;
  }
};

/**
 * @VerifyPath
 * @验证菜单选项地址是否存在
 * @param {*} path 需要验证的地址
 */
const VerifyPath = (path) => {
  return verifyPath(path);
};

/**
 * @breadClick
 * @面包屑点击提示
 */
// const breadClick = () => {
//   NotifyPlugin('warning', { title: '操作失败', content: '上级地址无法跳转' });
// };

/**
 * @checkUpdate
 * @新版本检测
 */
const checkUpdate = () => {
  if (allowHotUpdate) {
    useRequest({
      url: 'https://status.wesley.net.cn/mtb/oa/version',
      useCustomURL: true,
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode == 0) {
          if (RES.data.version != packageVersion) {
            NotifyPlugin('info', {
              title: '版本检测提示~',
              content: `发现新版本${RES.data.version}，可联系管理员进行更新OoO～～`,
            });
          }
        }
      },
    });
  }
};

/**
 * @getUrlParam
 * @desc 获取参数
 * @param id 参数名
 * @deprecated  已弃用，请使用 getParams() hooks
 */
// const getUrlParam = (variable) => {
//   // 先尝试从 hash 后的参数中获取
//   const hashParts = window.location.hash.split('?');
//   if (hashParts.length > 1) {
//     const hashParams = new URLSearchParams(hashParts[1]);
//     const value = hashParams.get(variable);
//     if (value) return value;
//   }

//   // 如果在 hash 后没有找到，再尝试从 URL 参数中获取
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(variable);
// };

onBeforeMount(() => {
  console.info('System Start Running!');
  document.body.style.overflow = 'hidden';

  const init = () => {
    // update
    checkUpdate();
    // load message
    getMessage();
    LoadUserPermissions();
  };
  router.isReady().then(() => {
    const paramsKeys = ['actionType', 'user_token', 'user_code', 'user_name', 'login_time', 'path'];
    const {
      actionType,
      user_token: TOKEN,
      user_code,
      user_name,
      login_time,
      path: param_path,
    } = getParamsData(route.query, location, paramsKeys);
    const actionType_LowerCase = actionType?.toLowerCase();
    if (actionType_LowerCase == 'login_back') {
      // 登录页面返回
      if (TOKEN) {
        localStorage.setItem('token', TOKEN);
        const USER_INFO = {
          code: user_code,
          name: user_name,
          login_time: login_time,
        };
        localStorage.setItem('userInfo', decodeURIComponent(JSON.stringify(USER_INFO)));

        login_info.code = user_code;
        login_info.name = user_name;
        login_info.login_time = login_time;
      }
    }
    const currentURLParams = getURLAllParams(location);
    // 有内容时，将url的seaarch参数转成router的参数
    if (isObject(currentURLParams) && !isEmpty(currentURLParams)) {
      // 只保留token参数
      const newQuery = {
        ...{
          user_token: currentURLParams?.user_token,
        },
        ...route.query,
      } as Record<string, string>;
      location.replace(
        `/#${routerPrefix}/${localStorage.getItem('lastPath') ?? MainContent.lastChoose}?${new URLSearchParams(
          newQuery,
        ).toString()}`,
      );
    }
    // url没有Token，从内存查询Token，并验证是否有效
    const VERIFY_TOKEN = localStorage.getItem('token');
    if ((VERIFY_TOKEN == null || !VERIFY_TOKEN) && loginVerify == true) {
      // 没有登录数据，遣返登录页面
      console.warn('未登录，跳转统一认证');
      setTimeout(() => {
        location.href = getLoginURL();
      }, 1500);
    } else if (loginVerify == true) {
      // 验证登录
      setTimeout(async () => {
        if (await VerifyToken()) {
          // 设置userInfo
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const { code, name, login_time } = JSON.parse(userInfo);
            login_info.code = code;
            login_info.name = name;
            login_info.login_time = login_time;
          }
          // pass
          if (param_path) {
            console.info('检测到 Path 参数,跳转至指定页面。');
            if (VerifyPath(param_path) === true) {
              handleChangeComponent(param_path, true);
            }
          }
          // 下方是为了修复刷新时跳到默认页面（首页）的问题
          handleChangeComponent(localStorage.getItem('lastPath') ?? MainContent.lastChoose, true);
          localStorage.setItem('token', VERIFY_TOKEN);
          NotifyPlugin('success', {
            title: '温馨提示',
            content: () => {
              return (
                <div style="color: var(--text-color);font: var(--td-font-title-medium);letter-spacing: 0.3px;">
                  欢迎使用媒体部管理系统，祝您今日工作顺利！
                </div>
              );
            },
            duration: 5000,
          });
          getUserInfoByToken(VERIFY_TOKEN);
          init();
        } else {
          location.href = getLoginURL();
        }
      });
    } else {
      NotifyPlugin('success', {
        title: '温馨提示',
        content: () => {
          return (
            <div style="color: var(--text-color);font: var(--td-font-title-medium);letter-spacing: 0.3px;">
              当前已关闭登录检测，请确认当前非生产环境！！
            </div>
          );
        },
        duration: 5000,
      });
      init();
    }
  });
  const currentPage = getCurrentPage();
  if (currentPage) {
    SideMenu.value = currentPage;
  }
});

onMounted(() => {
  const { __DEBUG_DONTCHECKLOGINSTATUS } = getParamsData(route.query, location, '__DEBUG_DONTCHECKLOGINSTATUS');
  document.body.style.overflow = '';
  // document.getElementById("loading").display = "none"
  theme.value = ThemeMode();
  window.addEventListener('load', (e) => {
    GetPageWidth(e);
  });
  window.addEventListener('resize', (e) => {
    GetPageWidth(e);
  });
  // DEBUG-前端不检测登录状态
  if (__DEBUG_DONTCHECKLOGINSTATUS != 'yes') {
    // 开始检测
    startCheckToken();
  }
});

onUnmounted(() => {
  cancelCheckToken();
});
</script>

<script lang="tsx">
export default {
  name: 'Index',
};
</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.autoPadding {
  padding: 12px;
}

:root {
  --transition-default: cubic-bezier(0.645, 0.045, 0.355, 1);
  --td-errp-color: #e3e6ebb8;
  --pageSmall: rgba(0, 0, 0, 0.6);
  --CornerBackgroundColor: #fff;
  --text-color: #000;
  --dai1: var(--td-bg-color-page);
  --dai2: var(--td-bg-color-container);
  --loading-block: rgba(0, 0, 0, 0.1);
  --loading-border: black;
}

:root[theme-mode='dark'] {
  --td-errp-color: rgba(74, 74, 74, 0.4);
  --pageSmall: rgba(255, 255, 255, 0.6);
  --text-color: #fff;
  --dai1: #fff;
  --loading-block: rgba(255, 255, 255, 0.1);
  --loading-border: white;
}

.t-dropdown__item .t-dropdown__item--theme-default .t-dropdown__item {
  min-width: 97px !important;
}

html,
body {
  margin: 0px;
  background-color: var(--td-bg-color-page);
  transition: all 0.28s var(--transition-default);
  color: var(--td-text-color-primary);
}

/**im */

a[we-a-tag] {
  color: inherit;
  text-decoration: none;
  transition: color 0.28s var(--transition-default);
}

a[we-a-tag]:hover {
  color: var(--td-text-color-primary);
  text-decoration: none;
}

/** 侧边菜单 */
.sidemenu .t-menu > .t-menu-group:first-child > .t-menu-group__title {
  padding-top: 0px !important;
}

.sidemenu {
  height: 100%;
  position: fixed !important;
  transition: transform 0.28s var(--transition-default), width 0.28s var(--transition-default) !important;
  top: 56px;
}

.sidemenu-normal {
  transform: translateX(-232px);
  &.sidemenu-show {
    transform: translateX(0px);
  }
}

.t-submenu > div {
  --ripple-color: var(--td-brand-color-light);
}

/** 顶菜单 */
.t-head-menu__inner {
  padding-right: 20px;
}

.t-menu__operations > a:nth-child(3) > svg {
  margin-right: 8px !important;
}

.t-menu__operations-icon {
  margin-right: 0px !important;
}

.we-tag-headmenu-operations-account .t-button__text {
  display: flex;
  align-items: center;
  max-width: 98px;
}

.t-popup--animation-enter-to[data-popper-placement^='bottom'] {
  animation: t-popup-animation-expand-in-bottom 0.2s cubic-bezier(0.38, 0, 0.24, 1), t-fade-in 0.2s linear !important;
}

.t-popup--animation-leave-to[data-popper-placement^='bottom'] {
  animation: t-popup-animation-expand-out-bottom 0.2s cubic-bezier(0.38, 0, 0.24, 1), t-fade-out 0.2s linear !important;
}

[we-card-border-none].t-card {
  border: none !important;
}

@keyframes t-popup-animation-expand-in-bottom {
  0% {
    clip-path: polygon(-20% 0, 120% 0, 120% 0, -20% 0);
  }

  to {
    clip-path: polygon(-20% 0, 120% 0, 120% 120%, -20% 120%);
  }
}

@keyframes t-popup-animation-expand-out-bottom {
  0% {
    clip-path: polygon(-20% 0, 120% 0, 120% 120%, -20% 120%);
  }

  to {
    clip-path: polygon(-20% 0, 120% 0, 120% 0, -20% 0);
  }
}

/** 面包屑 */
.t-breadcrumb__separator > svg.t-icon-chevron-right {
  color: var(--td-text-color-primary) !important;
}

/** Main Content */
.SideMenuShow-MainContent {
  margin-left: 232px;
}

.SideMenuUseCollapsed {
  margin-left: 64px;
}

.MainContent:not([noshowmenu='true']) {
  transition: margin-left 0.28s var(--transition-default);
  margin-top: 56px;
}

.MainContent-Breadcrumb {
  transition: opacity 0.28s var(--transition-default);
}

.MainContent-Breadcrumb.changing {
  opacity: 0;
}

/** Change Components Animation */
.loading-change-components-animation {
  transition: transform 0.28s var(--transition-default), opacity 0.28s var(--transition-default);
}

.loading-change-components-out {
  transform: translateY(50px);
  opacity: 0;
}

.loading-change-components-in {
  transform: translateY(0px);
  opacity: 1;
}

.bitian {
  color: var(--td-error-color);
}

#toc {
  position: fixed;
  top: 152px;
  right: 24px;
  width: 240px;
  padding-right: 10px;
  max-height: 480px;
  max-height: min(calc(100vh - 550px), 480px);
}

#copyright {
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 0.5px;
  color: var(--td-text-color-secondary);
  text-align: center;
  font-family: var(--td-font-family);
  padding: 36px;
  user-select: none;
}

/**页面加载中 */
.DisplayNone {
  display: none !important;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.text {
  margin-top: 22rem;
  font-size: 1rem;
  width: 100%;
  font-weight: 200;
  text-align: center;
}

.cube[l-tag],
.cube[l-tag] * {
  position: absolute;
  width: 6rem;
  height: 6rem;
}

.cube[l-tag] .sides[l-tag] * {
  box-sizing: border-box;
  border: 0.12rem solid var(--loading-border);
  border-radius: 0.25rem;
  background: var(--loading-block);
}

@keyframes rotate {
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }

  50% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }

  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
}

.sides[l-tag] {
  animation: rotate 3s ease infinite;
  animation-delay: 0.8s;
  transform-style: preserve-3d;
  transform: rotateX(-37.5deg) rotateY(45deg);
}

.cube[l-tag] .sides[l-tag] .top[l-tag] {
  animation: top-animation 3s ease infinite;
  animation-delay: 0ms;
  transform: rotateX(90deg) translateZ(96px);
  animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}

@keyframes top-animation {
  0% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }

  20% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }

  100% {
    opacity: 1;
    transform: rotateX(90deg) translateZ(100px);
  }
}

.cube[l-tag] .sides[l-tag] .bottom[l-tag] {
  animation: bottom-animation 3s ease infinite;
  animation-delay: 0ms;
  transform: rotateX(-90deg) translateZ(96px);
  animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}

@keyframes bottom-animation {
  0% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }

  20% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }

  100% {
    opacity: 1;
    transform: rotateX(-90deg) translateZ(100px);
  }
}

.cube[l-tag] .sides[l-tag] .front[l-tag] {
  animation: front-animation 3s ease infinite;
  animation-delay: 100ms;
  transform: rotateY(0deg) translateZ(96px);
  animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}

@keyframes front-animation {
  0% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }

  20% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }

  100% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(96px);
  }
}

.cube[l-tag] .sides[l-tag] .back[l-tag] {
  animation: back-animation 3s ease infinite;
  animation-delay: 100ms;
  transform: rotateY(-180deg) translateZ(96px);
  animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}

@keyframes back-animation {
  0% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }

  20% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }

  100% {
    opacity: 1;
    transform: rotateY(-180deg) translateZ(96px);
  }
}

.cube[l-tag] .sides[l-tag] .left[l-tag] {
  animation: left-animation 3s ease infinite;
  animation-delay: 100ms;
  transform: rotateY(-90deg) translateZ(96px);
  animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}

@keyframes left-animation {
  0% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }

  20% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }

  100% {
    opacity: 1;
    transform: rotateY(-90deg) translateZ(96px);
  }
}

.cube[l-tag] .sides[l-tag] .right[l-tag] {
  animation: right-animation 3s ease infinite;
  animation-delay: 100ms;
  transform: rotateY(90deg) translateZ(96px);
  animation-fill-mode: forwards;
  transform-origin: 50% 50%;
}

@keyframes right-animation {
  0% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }

  20% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(48px);
  }

  70% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(48px);
  }

  90% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }

  100% {
    opacity: 1;
    transform: rotateY(90deg) translateZ(96px);
  }
}

figure,
h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
}

.header-msg {
  width: 400px;
  height: 500px;
  .header-msg-top {
    position: relative;
    height: 56px;
    font-size: 16px;
    color: var(--td-text-color-primary);
    text-align: center;
    line-height: 56px;
    border-bottom: 1px solid var(--td-component-border);
  }
  .t-list {
    height: calc(100% - 104px);
  }
  .t-list-item {
    overflow: hidden;
    padding: 16px 24px;
    border-radius: var(--td-radius-default);
    font-size: 14px;
    color: var(--td-text-color-primary);
    line-height: 22px;
    cursor: pointer;
    &:hover {
      transition: background 0.2s ease;
      background: var(--td-bg-color-container-hover);
      .msg-content {
        color: var(--td-brand-color);
      }
      .msg-time {
        bottom: -6px;
        opacity: 0;
      }
      .t-list-item__action button {
        bottom: 16px;
        opacity: 1;
      }
    }
    .msg-content {
      margin-bottom: 16px;
    }
    .msg-type {
      color: var(--td-text-color-secondary);
    }
    .msg-time {
      transition: all 0.2s ease;
      opacity: 1;
      position: absolute;
      right: 24px;
      bottom: 16px;
      color: var(--td-text-color-secondary);
    }
    .t-list-item__action button {
      opacity: 0;
      position: absolute;
      right: 24px;
      bottom: -6px;
    }
  }
  .header-msg-bottom {
    height: 48px;
    align-items: center;
    display: flex;
    justify-content: center;
    .header-msg-bottom-link {
      text-decoration: none;
      font-size: 14px;
      color: var(--td-brand-color);
      line-height: 48px;
      cursor: pointer;
    }
  }
}
</style>
