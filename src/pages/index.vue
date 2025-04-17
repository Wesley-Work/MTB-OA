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
          @click="handleAccountMenu"
        >
          <t-button variant="text" class="we-tag-headmenu-operations-account" block>
            <t-icon name="user-circle" style="min-width: 20px; min-height: 20px" />
            <span style="text-overflow: ellipsis; overflow: hidden; max-width: 100%; margin-left: 8px">{{
              login_info.name
            }}</span>
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
      SideMenuUseCollapsed: config.menuUseCollapsed && !SideMenu.show,
    }"
    :NoShowMenu="!TitleMenu.show"
  >
    <BreadCurmb :value="SideMenu.ComponentValue"></BreadCurmb>
    <section
      class="loading-change-components-animation"
      :class="{
        'loading-change-components-in': MainContent.classIn,
        'loading-change-components-out': MainContent.classOut,
      }"
      :page="SideMenu.value"
    >
      <PageTooSmall v-if="pagesmall" />
      <router-view
        v-else
        :handle-change-component="handleChangeComponent"
        :user-permissions="login_info.permissions"
        :component-permissions="componentPermissions"
        :component="SideMenu.value"
      ></router-view>
      <!---->
      <!-- <Component :page="SideMenu.ComponentValue" @mounted="Components_LoadEnd" :UserPermissions="login_info.permissions" :PagePermissions="Page_permissions" :ChangePageUrl="SideMenuValueChange"
                @Apply-Url-Param="applyUrlParam" @Get-Url-Param="getUrlParam"/> -->
      <!---->
      <div id="copyright">
        <div>
          Powered By
          <a href="https://www.wesley.net.cn/" we-a-tag target="_blank" @click.prevent="NotClick">Wesley</a>
          | Designed By
          <a href="https://tdesign.tencent.com/" we-a-tag target="_blank" @click.prevent="NotClick">Tencent.</a>
        </div>
        <!-- 广告位 -->
        <!-- <div>
                    由 <a href="javaScript:void(0);" we-a-tag>DEBUG-SDZZ</a> 提供技术支持
                </div> -->
        <div>Copyright © 2021-2025 MTB All right reserved.</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="tsx">
import SideMenus from '../hooks/useMenu.tsx';
import BreadCurmb from '../hooks/useBreadcrumb.tsx';
import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { themeMode, toggleTheme } from '../components/function/theme.js';
import { config, routerMap } from '../components/config';
import { PoweroffIcon, ChatBubbleHelpIcon } from 'tdesign-icons-vue-next';
import { NotifyPlugin } from 'tdesign-vue-next';
import {
  getCurrentPage,
  verifyPath,
  getSSOURL,
  getAPIURL,
  getLoginURL,
  getRoutePathObj,
  VerifyToken,
} from '../hooks/common';
import { useRequest } from '../hooks/useRequest';
import PageTooSmall from '../components/pages/PageSmall.vue';
import router from '../routes.ts';

watch(
  () => router.currentRoute.value.path,
  (val) => {
    const v = val.replace(config.routerPrefix + '/', '');
    SideMenu.ComponentValue = v;
    SideMenu.value = v;
  },
);

const componentPermissions = ref([]);
const TitleMenu = reactive({
  text: config.systemname,
  show: true,
});
const SideMenu = reactive({
  value: 'Content',
  ComponentValue: 'Content',
  show: false,
});
const MainContent = reactive({
  classIn: false,
  classOut: false,
  lastChoose: 'Content',
  ComponentValue: 'Content',
  breadcrumb: {
    show: true,
    parent: '设备操作',
    current: '借出',
    changing1: false,
    changing2: false,
  },
  AccountMenuOptions: [
    // { content: "个人中心", value: 1, prefixIcon: <UserIcon /> },
    { content: '遇到问题', value: 2, prefixIcon: <ChatBubbleHelpIcon /> },
    { content: '退出登录', value: 3, prefixIcon: <PoweroffIcon /> },
  ],
});
const login_info = reactive({
  name: '-',
  code: '-',
  class: '-',
  permissions: [],
  login_time: '',
});
const timer = reactive({
  token: null,
});
const theme = ref(false);
const pagesmall = ref(false);
const messageList = ref([]);
const hasMessageNotRead = computed(() => {
  return messageList.value.filter((item) => item.onread === 0).length > 0;
});
console.info(
  '消息列表：',
  messageList.value.filter((item) => item.onread === 0),
);

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
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取消息内容失败',
        content: err,
      });
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
 * @checkToken
 * @检查Token时效
 */
const checkToken = () => {
  var TOKEN = localStorage.getItem('token');
  // Token检测较为特殊，useRequest可能会影响用户体验，所以不用useRequest
  const xhr = new XMLHttpRequest();
  xhr.open('post', getAPIURL() + '/checkToken', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.setRequestHeader('token', TOKEN);
  xhr.onload = () => {
    var result = JSON.parse(xhr.response.replace(/\r|\n/gi, ''));
    if (result.errcode != 0 || !result.data.verify) {
      // pass
      location.href = getLoginURL();
    }
  };
  xhr.onerror = () => {
    console.error('请求错误', xhr);
    localStorage.removeItem('token');
    NotifyPlugin('error', {
      title: '遇到错误',
      content: '无法检测Token状态，请尝试重新登录',
      duration: 0,
    });
  };
  xhr.send();
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
        login_info.class = RES.data.class;
        login_info.login_time = RES.data.login_time;
      }
    },
    error: function (err) {
      console.error(err);
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
};

/**
 * @GetPageWidth
 * @获取页面宽度并检测是否过小
 */
const GetPageWidth = (e) => {
  if (e.currentTarget.parent.innerWidth < config.minWidth) {
    console.warn('尺寸过小！');
    pagesmall.value = true;
  } else {
    pagesmall.value = false;
  }
};

/**
 * @ToggleTheme
 * @切换样式
 */
const ToggleTheme = () => {
  // document.startViewTransition(() => toggleTheme());
  toggleTheme();
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

const handleChangeComponent = (componentName: string, doNotToggleSideMenu: boolean, query: object | null = {}) => {
  // 与当前页面相同或
  if (!VerifyPath(componentName)) {
    console.error(`[handleChangeComponent]: 不会切换到页面(组件)[${componentName}]，因为页面不存在！`);
    return false;
  }
  componentPermissions.value = getComponentPermissions(componentName);
  MainContent.lastChoose = componentName;
  SideMenu.value = componentName;
  SideMenu.ComponentValue = componentName;
  // 若菜单不是Collapsed模式，则判断当前菜单是否为展开状态，若是则关闭
  if (config.menuUseCollapsed && SideMenu.show && !config.menuUseCollapsed) {
    doNotToggleSideMenu ? null : ToggleSideMenu();
  }
  // 应用动画
  MainContent.classOut = true;
  setTimeout(() => {
    router.push({
      path: `${config.routerPrefix}/${componentName}`,
      query: query,
    });
    MainContent.ComponentValue = componentName;
    MainContent.classOut = false;
    MainContent.classIn = true;
    setTimeout(() => {
      MainContent.classIn = false;
    }, 280);
  }, 280);
};

/**
 * @handleAccountMenu
 * @处理右上角菜单选择内容
 * @param {*} e 选择数据项
 */
const handleAccountMenu = (e) => {
  e.value == 1 ? handleChangeComponent('PersionCenter', true) : e.value == 2 ? null : logout();
  SideMenu.show = false;
};

const logout = () => {
  location.href = getSSOURL() + '?actionType=logout';
};

const PageReload = () => {
  location.reload();
};

/**
 * @NotClick
 * @阻止a标签默认点击事件，防止跳转到站外链接
 */
const NotClick = () => {
  if (config.aTag_DontNav) {
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
 * @getUrlParam
 * @desc 获取参数
 * @param id 参数名
 */
const getUrlParam = (variable, url = window.location.search.substring(1)) => {
  var vars = url.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return undefined;
};

/**
 * @applyUrlParam
 * @desc 获取参数
 * @param new_param 参数名
 * @param value 参数值
 */
// const applyUrlParam = (new_param, value, location = window.location) => {
//   if (!new_param || !value) {
//     return false;
//   }
//   var regUrl = location.search == '' ? false : true;
//   var regParam = location.search.indexOf(new_param) == -1 ? true : false;
//   var UrlH = location.origin + location.pathname;
//   var UrlS = location.href;
//   if (regUrl) {
//     //有参数了，追加
//     if (regParam) {
//       //没有参数，直接加
//       var newurl = UrlS + '&' + new_param + '=' + value;
//       window.history.pushState(null, null, newurl);
//     } else {
//       //有参数，替换
//       var newurl = updateUrlParam(new_param, value);
//       window.history.pushState(null, null, newurl);
//     }
//   } else {
//     //没有参数，直接加
//     var newurl = UrlH + '?' + new_param + '=' + value;
//     window.history.pushState(null, null, newurl);
//   }
// };

/**
 * @updateUrlParam
 * @desc 获取参数
 * @param key 参数名
 * @param value 参数值
 */
// const updateUrlParam = (key, value) => {
//   var uri = window.location.href;
//   if (!value) {
//     return uri;
//   }
//   var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
//   var separator = uri.indexOf('?') !== -1 ? '&' : '?';
//   if (uri.match(re)) {
//     return uri.replace(re, '$1' + key + '=' + value + '$2');
//   } else {
//     return uri + separator + key + '=' + value;
//   }
// };

const removeParam = (key, sourceURL) => {
  var rtn = sourceURL.split('?')[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : '';
  if (queryString !== '') {
    params_arr = queryString.split('&');
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split('=')[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = rtn + '?' + params_arr.join('&');
  }
  return rtn;
};

onBeforeMount(() => {
  console.info('System Start Running!');
  document.body.style.overflow = 'hidden';
  const actionType = getUrlParam('actionType');
  if (actionType == 'Login_Back') {
    // 登录页面返回
    var TOKEN = getUrlParam('user_token');
    localStorage.setItem('token', TOKEN);
    const USER_INFO = {
      code: getUrlParam('user_code'),
      name: getUrlParam('user_name'),
      class: getUrlParam('user_class'),
      login_time: getUrlParam('login_time'),
    };
    login_info.code = getUrlParam('user_code');
    login_info.name = getUrlParam('user_name');
    login_info.class = getUrlParam('user_class');
    login_info.login_time = getUrlParam('login_time');
    localStorage.setItem('user_info', JSON.stringify(USER_INFO));
    // 地址栏只保留token但不刷新页面，保证地址栏干净
    window.history.pushState(
      null,
      null,
      removeParam(
        'actionType',
        removeParam(
          'login_time',
          removeParam('user_class', removeParam('user_name', removeParam('user_code', window.location.href))),
        ),
      ),
    );
  }
  // 查询Token
  const VERIFY_TOKEN = localStorage.getItem('token');
  if ((VERIFY_TOKEN == null || !VERIFY_TOKEN) && config.login_verify == true) {
    // 没有登录数据，遣返登录页面
    console.warn('未登录，跳转统一认证');
    setTimeout(() => {
      location.href = getLoginURL();
    }, 1500);
  } else if (config.login_verify == true) {
    // 验证登录
    setTimeout(async () => {
      if (await VerifyToken()) {
        // pass
        var param_path = getUrlParam('path');
        if (param_path) {
          console.info('检测到 Path 参数,跳转至指定页面。');
          if (VerifyPath(param_path) === true) {
            handleChangeComponent(param_path, true);
          }
        }
        handleChangeComponent(MainContent.lastChoose, true);
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
      } else {
        location.href = getLoginURL();
      }
    }, 100);
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
    // handleChangeComponent(MainContent.lastChoose,true,false)
    // var param_path = getUrlParam("path");
    // if (param_path) {
    //     console.log("检测到 Path 参数,跳转至指定页面。");
    //     if (VerifyPath(param_path) === true) {
    //         handleChangeComponent(param_path, true);
    //     }
    // }
  }
  // load message
  getMessage();
  LoadUserPermissions();
  const currentPage = getCurrentPage();
  if (currentPage) {
    SideMenu.ComponentValue = currentPage;
    SideMenu.value = currentPage;
  }
});

onMounted(() => {
  document.body.style.overflow = '';
  // document.getElementById("loading").display = "none"
  theme.value = ThemeMode();
  window.addEventListener('load', (e) => {
    GetPageWidth(e);
  });
  window.addEventListener('resize', (e) => {
    GetPageWidth(e);
  });
  if (getUrlParam('__DEBUG_DONTCHECKLOGINSTATUS') != 'yes') {
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
.autoPadding {
  padding: 12px;
}

@keyframes light-to-dark {
  0% {
    clip-path: polygon(0 0, 0 0, calc(0.14054083 * -100vh) 100%, calc(0.14054083 * -100vh) 100%);
  }

  to {
    clip-path: polygon(0 0, calc((0.14054083 * 100vh) + 100%) 0, 100% 100%, calc(0.14054083 * -100vh) 100%);
  }
}

@keyframes dark-to-light {
  0% {
    clip-path: polygon(calc((0.14054083 * 100vh) + 100%) 0, calc((0.14054083 * 100vh) + 100%) 0, 100% 100%, 100% 100%);
  }

  to {
    clip-path: polygon(0 0, calc((0.14054083 * 100vh) + 100%) 0, 100% 100%, calc(0.14054083 * -100vh) 100%);
  }
}

:root::view-transition-group(root) {
  animation-duration: 1s;
}

:root::view-transition-new(root),
:root::view-transition-old(root) {
  mix-blend-mode: normal;
}

:root::view-transition-old(root),
:root[theme-mode='dark']::view-transition-old(root) {
  animation: none;
}

:root::view-transition-new(root) {
  animation-name: dark-to-light;
}

:root[theme-mode='dark']::view-transition-new(root) {
  animation-name: light-to-dark;
}

html::view-transition {
  position: fixed;
  inset: 0px;
}

:root::view-transition-group(root) {
  animation-duration: 1s;
}

html::view-transition-group(root) {
  width: 2512px;
  height: 906px;
  transform: matrix(1, 0, 0, 1, 0, 0);
  color-scheme: normal;
  text-orientation: mixed;
  writing-mode: horizontal-tb;
  backdrop-filter: none;
  mix-blend-mode: normal;
  animation-name: -ua-view-transition-group-anim-root;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
}

html::view-transition-group(*) {
  position: absolute;
  top: 0px;
  left: 0px;
  animation-duration: 0.25s;
  animation-fill-mode: both;
}

:root::view-transition-new(root) {
  animation-name: dark-to-light;
}

:root::view-transition-new(root),
:root::view-transition-old(root) {
  mix-blend-mode: normal;
}

html::view-transition-new(root) {
  animation-name: -ua-view-transition-fade-in, -ua-mix-blend-mode-plus-lighter;
}

html::view-transition-new(*) {
  animation-duration: inherit;
  animation-fill-mode: inherit;
}

::view-transition-new(*) {
  position: absolute;
  inset-block-start: 0px;
  inline-size: 100%;
  block-size: auto;
}

@keyframes -ua-view-transition-group-anim-root {
  0% {
    transform: matrix(1, 0, 0, 1, 0, 0);
    width: 2512px;
    height: 906px;
    backdrop-filter: none;
  }
}

:root {
  --transition-default: cubic-bezier(0.645, 0.045, 0.355, 1);
  --td-errp-color: #e3e6ebb8;
  --pagesmall: rgba(0, 0, 0, 0.6);
  --CornerBackgroundColor: #fff;
  --text-color: #000;
  --dai1: var(--td-bg-color-page);
  --dai2: var(--td-bg-color-container);
  --loading-block: rgba(0, 0, 0, 0.1);
  --loading-border: black;
}

:root[theme-mode='dark'] {
  --td-errp-color: rgba(74, 74, 74, 0.4);
  --pagesmall: rgba(255, 255, 255, 0.6);
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
