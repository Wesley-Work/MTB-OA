<template>
    <!--顶部菜单-->
    <t-head-menu v-if="TitleMenu.show" :theme="light" @change="changeHandler" style="
            transition: all 0.28s cubic-bezier(0.645, 0.045, 0.355, 1);
            position: fixed;
            top: 0px;
            z-index: 10;
            user-select: none;
        ">
        <template #logo>
            <div style="
                    width: 40px;
                    height: 40px;
                    margin-left: 13px;
                    display: flex;
                    align-items: center;
                " class="guide_sidemenus">
                <t-button shape="square" variant="text" style="border: none; width: 40px; height: 40px"
                    :onClick="ToggleSideMenu">
                    <template #icon><t-icon name="bulletpoint" style="width: 25px; height: 25px" /></template>
                </t-button>
            </div>
            <span style="font-size: 21px; font-weight: bold; margin-left: 18px; user-select: none">{{ TitleMenu.text
            }}</span>
        </template>
        <template #operations>
            <a href="javascript:void(0);" title="切换样式" class="guide_toggletheme" style="display: flex;margin-right: 8px;">
                <t-icon class="t-menu__operations-icon" :name="theme ? 'sunny' : 'moon'" @click="ToggleTheme()"
                    style="width: 36px; height: 36px" />
            </a>
            <a href="javascript:void(1);" title="重载页面" class="guide_refresh" style="display: flex;margin-right: 8px;" @click="PageReload">
                <t-icon class="t-menu__operations-icon" name="refresh" style="width: 36px; height: 36px" />
            </a>
            <!-- <a href="javascript:void(2);" title="返回上页" class="guide_pagerollback" style="display: flex">
                <t-icon class="t-menu__operations-icon" name="rollback" style="width: 36px; height: 36px"
                    @click="PageRollBack" />
            </a> -->
            <div style="display: flex;min-width: 120px;">
                <t-dropdown :options="MainContent.AccountMenuOptions" trigger="click" @click="handleAccountMenu"
                    :popupProps="{
                        overlayInnerStyle: (triggerElem) => ({
                            width: `${triggerElem.offsetWidth}px`,
                        }),
                    }">
                    <t-button variant="text" class="we-tag-headmenu-operations-account guide_accountdropdown" block>
                        <t-icon name="user-circle" style="min-width: 20px; min-height: 20px" />
                        <span style="
                                text-overflow: ellipsis;
                                overflow: hidden;
                                max-width: 100%;
                                margin-left: 8px;
                            ">{{ login_info.name }}</span>
                        <template #suffix>
                            <t-icon name="chevron-down" size="16" /></template>
                    </t-button>
                </t-dropdown>
            </div>
        </template>
    </t-head-menu>
    <!--侧边菜单-->
    <SideMenus :theme="theme ? 'dark' : 'light'" :value="SideMenu.value" height="550px" :visiable="SideMenu.show" :value-change="SideMenuValueChange"></SideMenus>
    <!--BackTop-->
    <div style="
            box-sizing: border-box;
            transition: all 0.2s ease 0s;
            position: fixed;
            right: 32px;
            bottom: 120px;
            z-index: 300;
        ">
        <t-back-top style="position: relative" :visible-height="720" size="small" :offset="[0, 0]"
            theme="light"></t-back-top>
    </div>
    <!-- if show sidemenu need margin-left: 232px;-->
    <div style="padding: 24px" class="MainContent" :class="{ 'SideMenuShow-MainContent': SideMenu.show }"
        :NoShowMenu="!TitleMenu.show">
        <BreadCurmb :value="SideMenu.ComponentValue"></BreadCurmb>
        <section class="loading-change-components-animation" :class="{
            'loading-change-components-in': MainContent.classIn,
            'loading-change-components-out': MainContent.classOut,
        }" :page="SideMenu.value">
        <router-view></router-view>
            <!---->
            <!-- <Component :page="SideMenu.ComponentValue" @mounted="Components_LoadEnd" :UserPermissions="login_info.permissions" :PagePermissions="Page_permissions" :ChangePageUrl="SideMenuValueChange"
                @Apply-Url-Param="applyUrlParam" @Get-Url-Param="getUrlParam"/> -->
            <!---->
            <div id="copyright">
                <div>
                    Powered By
                    <a href="https://www.wesley08.top/" we-a-tag target="_blank" @click.prevent="NotClick">Wesley</a>
                    | Designed By
                    <a href="https://tdesign.tencent.com/" we-a-tag target="_blank" @click.prevent="NotClick">Tencent.</a>
                </div>
                <!-- 广告位 -->
                <!-- <div>
                    由 <a href="javaScript:void(0);" we-a-tag>DEBUG-SDZZ</a> 提供技术支持
                </div> -->
                <div>Copyright © 2021-2024 MTB All right reserved.</div>
            </div>
        </section>
    </div>
</template>

<script setup lang="jsx">
import SideMenus from "../components/hooks/useMenu.tsx"
import BreadCurmb from "../components/hooks/useBreadcrumb.tsx"

</script>

<script lang="jsx">
// import * as api from "../components/config/api.js";
// import * as config from "../components/config.js";
import { themeMode, toggleTheme } from "../components/function/theme.js";
import { config } from "../components/config";
import Component from "../components/index.tsx";
import { PoweroffIcon, UserIcon, ChatBubbleHelpIcon } from "tdesign-icons-vue-next";
import { NotifyPlugin } from "tdesign-vue-next";
import { HTTPRequest, VerifyToken, GetAPIUrl, GetSSOUrl } from '../components/function/hooks'

import { getCurrentPage, verifyPath } from '../components/hooks/common'

import router from '../routes'

var Version

export default {
    name: "InDex",
    components: {
        Component,
    },
    data() {
        return {
            TitleMenu: {
                text: config.systemname,
                show: true,
            },
            SideMenu: {
                value: "Lend",
                ComponentValue: "Lend",
                show: false,
            },
            MainContent: {
                classIn: false,
                classOut: false,
                lastChoose: "lend",
                breadcrumb: {
                    show: true,
                    parent: "设备操作",
                    current: "借出",
                    changing1: false,
                    changing2: false,
                },
                AccountMenuOptions: [
                    // { content: "个人中心", value: 1, prefixIcon: <UserIcon /> },
                    { content: "遇到问题", value: 2, prefixIcon: <ChatBubbleHelpIcon /> },
                    { content: "退出登录", value: 3, prefixIcon: <PoweroffIcon /> },
                ],
            },
            login_info: {
                name: "-",
                code: "-",
                class: "-",
                permissions: [],
                login_time: "",
            },
            Page_permissions:[],
            timer:{
                token:null,
            },
            theme: false,
            config,
        };
    },
    created() {
        console.log("System Start Running!");
    },
    beforeCreate() {
        document.body.style.overflow = "hidden";
    },
    beforeMount(){
        // this.getHDVersion() // GET Version
        const actionType = this.getUrlParam("actionType")
        if (actionType == "Login_Back") {
            // 登录页面返回
            var TOKEN = this.getUrlParam("user_token")
            localStorage.setItem("token",TOKEN)
            localStorage.setItem("permissions",this.getUrlParam("user_permissions"))
            const USER_INFO = {
                "code": this.getUrlParam("user_code"),
                "name": this.getUrlParam("user_name"),
                "class": this.getUrlParam("user_class"),
                "login_time": this.getUrlParam("login_time"),
            }
            this.$data.code = this.getUrlParam("user_code");
            this.$data.name = this.getUrlParam("user_name");
            this.$data.class = this.getUrlParam("user_class");
            this.$data.login_time = this.getUrlParam("login_time");
            localStorage.setItem("user_info",JSON.stringify(USER_INFO))
        }
        // 查询Token
        const VERIFY_TOKEN = localStorage.getItem("token")
        console.log((VERIFY_TOKEN == null || !VERIFY_TOKEN) && config.login_verify == true,VERIFY_TOKEN == null, !VERIFY_TOKEN, config.login_verify == true)
        if ((VERIFY_TOKEN == null || !VERIFY_TOKEN) && config.login_verify == true) {
            // 没有登录数据，遣返登录页面
            // location.href = config.API_URL.login_url;
        }
        else if (config.login_verify == true){
            // 验证登录
            setTimeout(async () => {
                if (await VerifyToken()) {
                    // pass
                    var param_path = this.getUrlParam("path");
                    if (param_path) {
                        console.log("检测到 Path 参数,跳转至指定页面。");
                        if (this.VerifyPath(param_path) === true) {
                            this.SideMenuValueChange(param_path, true);
                        }
                    }
                    this.SideMenuValueChange(this.$data.MainContent.lastChoose,true,false,true)
                    localStorage.setItem("token",VERIFY_TOKEN)
                    NotifyPlugin("success", {
                        title: "温馨提示",
                        content: ()=> {
                            return (
                                <div style="color: var(--text-color);font: var(--td-font-title-medium);letter-spacing: 0.3px;">
                                    欢迎使用媒体部管理系统，祝您今日工作顺利！
                                </div>
                            );
                        },
                        duration: 5000
                    });
                    this.getUserInfoByToken(VERIFY_TOKEN)
                }
                else{
                    // location.href = config.API_URL.login_url; 
                }
            }, 100);
        }
        else{
            NotifyPlugin("success", {
                title: "温馨提示",
                content: ()=> {
                    return (
                        <div style="color: var(--text-color);font: var(--td-font-title-medium);letter-spacing: 0.3px;">
                            当前已关闭登录检测，请确认当前非生产环境！！
                        </div>
                    );
                },
                duration: 5000
            });
            this.SideMenuValueChange(this.$data.MainContent.lastChoose,true,false,true)
            var param_path = this.getUrlParam("path");
            if (param_path) {
                console.log("检测到 Path 参数,跳转至指定页面。");
                if (this.VerifyPath(param_path) === true) {
                    this.SideMenuValueChange(param_path, true);
                }
            }
        }
        this.LoadUserPermissions()
        this.LoadPagesPermissions()
        const currentPage = getCurrentPage()
        if (currentPage) {
            this.$data.SideMenu.ComponentValue = currentPage
            this.$data.SideMenu.value = currentPage
        }
    },
    mounted() {
        document.body.style.overflow = "";
        // document.getElementById("loading").display = "none"
        this.$data.theme = this.ThemeMode();
        window.onload = (e) => {
            this.GetPageWidth(e);
        };
        window.onresize = (e) => {
            this.GetPageWidth(e);
        };
        // if (__DEBUG_DONTCHECKLOGINSTATUS != "yes"){
        //     // 开始检测
        //     this.startCheckToken()
        // }
        // console.log(config.API_URL);
    },
    methods: {

        LoadUserPermissions(UTOKEN=null){
            var TOKEN = UTOKEN || localStorage.getItem("token")
            var that = this
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/permissions/userHasPermissions",
                    methods: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        if (RES.errcode == 0){
                            that.$data.login_info.permissions = RES.data;
                        }
                    },
                    error: function (err) {
                        console.error(err);
                    },
                });
            } catch (e) {
                console.log(e);
            }
        },

        LoadPagesPermissions(){
            var TOKEN = localStorage.getItem("token")
            var that = this
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/permissions/pagePermissions",
                    methods: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        console.log(RES);
                        if (RES.errcode == 0){
                            that.$data.Page_permissions = RES.data;
                        }
                    },
                    error: function (err) {
                        console.error(err);
                    },
                });
            } catch (e) {
                console.log(e);
            }
        },

        /**
         * @getHDVersion
         * @获取版本号
         */
         getHDVersion(){
            var url = "http://localhost:8888/api/LatestVersion";
            const xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded; charset=UTF-8"
            );
            xhr.onload = () => {
                const result = JSON.parse(xhr.response.replace(/\r|\n/gi, ""));
                if (result.errcode == 0) {
                    console.log("Version："+result.data.version);
                    localStorage.setItem("version",result.data.version)
                    Version = result.data.version
                    return result.data.version
                }
                else{
                    console.log("获取版本号失败")
                }
            };
            xhr.onerror = () => {
                console.log("请求错误", xhr);
            };
            xhr.send();
            
        },

        /**
         * @checkToken
         * @检查Token时效
         */
        checkToken(){
            var TOKEN = localStorage.getItem("token")
            var that = this
            const xhr = new XMLHttpRequest();
            xhr.open("post", config.API_URL.MAIN_URL + "/checkToken", true);
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded; charset=UTF-8"
            );
            xhr.setRequestHeader(
                "token",TOKEN
            );
            xhr.onload = () => {
                // this.$data.loading = false;
                var result = JSON.parse(xhr.response.replace(/\r|\n/gi, ""));
                if (result.errcode != 0 || !result.data.verify) {
                    // pass
                    location.href = config.API_URL.login_url; 
                }
            };
            xhr.onerror = () => {
                console.log("请求错误", xhr);
                localStorage.removeItem("token")
                NotifyPlugin("error", {
                    title: "遇到错误",
                    content: "无法检测Token状态，请尝试重新登录",
                    duration: 0
                });
            };
            xhr.send();
        },

        /**
         * @getUserInfoByToken
         * @获取用户信息
         * @param token
         */
        getUserInfoByToken(token){
            const xhr = new XMLHttpRequest();
            xhr.open("post", config.API_URL.MAIN_URL + "/getLoginUserInfo", true);
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded; charset=UTF-8"
            );
            xhr.setRequestHeader(
                "token",token
            );
            xhr.onload = () => {
                var result = JSON.parse(xhr.response.replace(/\r|\n/gi, ""));
                this.$data.login_info.code = result.data.usercode;
                this.$data.login_info.name = result.data.name;
                this.$data.login_info.class = result.data.class;
                this.$data.login_info.login_time = result.data.login_time;
            };
            xhr.onerror = () => {
                console.log("请求错误", xhr);
            };
            xhr.send();
        },

        /**
         * @startCheckToken
         * @开始循环检查Token
         */
        startCheckToken(){
            console.log("[CheckToken] START")
            this.$data.timer.token = setInterval(() => {
                this.checkToken()
            },2500);
        },

        /**
         * @cancelCheckToken
         * @取消循环检查Token
         */
         cancelCheckToken(){
            console.log("[CheckToken] CANCEL")
            clearInterval(this.$data.timer.token)
        },

        debug() {
            console.log("【debug】");
        },

        /**
         * @GetPageWidth
         * @获取页面宽度并检测是否过小
         */
        GetPageWidth(e) {
            if (e.currentTarget.parent.innerWidth < config.minWidth) {
                console.log("尺寸过小！");
                this.$data.SideMenu.ComponentValue = "PageSmall";
            } else {
                this.$data.SideMenu.ComponentValue = this.$data.SideMenu.value;
            }
        },

        /**
         * @ToggleTheme
         * @切换主题
         */
        ToggleTheme() {
            document.startViewTransition(() => toggleTheme());
            this.$data.theme = this.ThemeMode();
        },
        
        /**
         * @ThemeMode
         * @获取主题模式
         */
        ThemeMode() {
            return themeMode();
        },

        /**
         * @ToggleSideMenu
         * @切换侧边菜单显示

         */
        ToggleSideMenu() {
            this.$data.SideMenu.show = !this.$data.SideMenu.show;
        },
        /**
         * @SideMenuValueChange
         * @侧边菜单选项变化处理函数
         * @param { String } e 选择数据项
         * @param { Boolean } NotToggle 是否应用动画
         * @param { Boolean } changeURL 是否变更地址栏后缀参数
         * @param { Boolean } ForceFlush 是否强制刷新
         */
        SideMenuValueChange(e, NotToggle = false, changeURL = true, ForceFlush = false) {
            console.log(e)
            if (this.$data.MainContent.lastChoose == e && !ForceFlush) {
                return false;
            }
            if (!this.VerifyPath(e)) {
                return false;
            }
            this.$data.SideMenu.value = e;
            NotToggle ? "" : this.ToggleSideMenu();
            //动画
            this.$data.MainContent.classOut = true;
            //上次选择
            this.$data.MainContent.lastChoose = e;
            //面包屑更新动画
            // if (
            //     config.SideMenuValueConfig[e].parent &&
            //     this.$data.MainContent.breadcrumb.parent != config.SideMenuValueConfig[e].parent
            // ) {
            //     this.$data.MainContent.breadcrumb.changing1 = true;
            // }
            // this.$data.MainContent.breadcrumb.changing2 = true;
            setTimeout(() => {
                //更新保留地址
                // if (changeURL) {
                //     this.applyUrlParam("path", e);
                // }
                router.push(`/mtb/${e}`)
                this.$data.SideMenu.ComponentValue = e;
                //动画
                this.$data.MainContent.classOut = false;
                this.$data.MainContent.classIn = true;
                //更改面包屑
                // try {
                //     if (
                //         this.$data.MainContent.breadcrumb.parent !=
                //         config.SideMenuValueConfig[e].parent
                //     ) {
                //         this.$data.MainContent.breadcrumb.parent =
                //             config.SideMenuValueConfig[e].parent;
                //     }
                // } catch (err) {
                //     console.log(err);
                //     this.$data.MainContent.breadcrumb.parent = "错误的配置";
                // }
                // try {
                //     this.$data.MainContent.breadcrumb.current =
                //         config.SideMenuValueConfig[e].current;
                // } catch (err) {
                //     console.log(err);
                //     this.$data.MainContent.breadcrumb.current = "错误的配置";
                // }
                // this.$data.MainContent.breadcrumb.changing1 = false;
                // this.$data.MainContent.breadcrumb.changing2 = false;
                //动画
                setTimeout(() => {
                    this.$data.MainContent.classIn = false;
                }, 280);
            }, 280);
        },

        /**
         * @handleAccountMenu
         * @处理右上角菜单选择内容
         * @param {*} e 选择数据项
         */
        handleAccountMenu(e) {
            e.value == 1
                ? this.SideMenuValueChange("PersionCenter", true)
                : e.value == 2
                    ? this.HasProblem()
                    : this.logout();
            this.$data.SideMenu.show = false;
        },

        logout() {
            // localStorage.removeItem("token");
            // location.reload()
            location.href = GetSSOUrl(location) + "?actionType=logout"
        },

        PageReload() {
            location.reload()
        },

        /**
         * @NotClick
         * @阻止a标签默认点击事件，防止跳转到站外链接
         */
        NotClick() {
            if (config.aTag_DontNav) {
                NotifyPlugin("warning", {
                    title: "操作失败",
                    content: "根据相关规则，不允许跳转站外链接",
                });
                return false;
            }
        },

        /**
         * @VerifyPath
         * @验证菜单选项地址是否存在
         * @param {*} path 需要验证的地址
         */
        VerifyPath(path) {
            return verifyPath(path)
            // try {
            //     var a = config.SideMenuValueConfig[path];
            //     if (a) {
            //         return true;
            //     }
            //     console.warn("验证地址 " + path + " 不存在！");
            //     NotifyPlugin("warning", { title: "无法完成的操作", content: "跳转地址错误或不存在，请联系维护人员！" });
            //     return false;
            // } catch (err) {
            //     console.warn("验证地址 " + path + " 不存在！");
            //     return false;
            // }
        },

        /**
         * @breadClick
         * @面包屑点击提示
         */
        breadClick() {
            if (this.$data.MainContent.breadcrumb.parent == "通知中心") {
                this.SideMenuValueChange("MessageList", true);
            } else {
                NotifyPlugin("warning", { title: "操作失败", content: "上级地址无法跳转" });
            }
        },

        /**
         * @getUrlParam
         * @desc 获取参数
         * @param id 参数名
         */
        getUrlParam(variable, url = window.location.search.substring(1)) {
            var vars = url.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return false;
        },

        /**
         * @applyUrlParam
         * @desc 获取参数
         * @param new_param 参数名
         * @param value 参数值
         */
        applyUrlParam(new_param, value, location = window.location ) {
            if (!new_param || !value) {
                return false;
            }
            var regUrl = location.search == "" ? false : true;
            var regParam = location.search.indexOf(new_param) == -1 ? true : false;
            var UrlH = location.origin + location.pathname;
            var UrlS = location.href;
            if (regUrl) {
                //有参数了，追加
                if (regParam) {
                    //没有参数，直接加
                    var newurl = UrlS + "&" + new_param + "=" + value;
                    window.history.pushState(null, null, newurl);
                } else {
                    //有参数，替换
                    var newurl = this.updateUrlParam(new_param, value);
                    window.history.pushState(null, null, newurl);
                }
            } else {
                //没有参数，直接加
                var newurl = UrlH + "?" + new_param + "=" + value;
                window.history.pushState(null, null, newurl);
            }
        },

        /**
         * @updateUrlParam
         * @desc 获取参数
         * @param key 参数名
         * @param value 参数值
         */
        updateUrlParam(key, value) {
            var uri = window.location.href;
            if (!value) {
                return uri;
            }
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf("?") !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, "$1" + key + "=" + value + "$2");
            } else {
                return uri + separator + key + "=" + value;
            }
        },
    },
};
</script>

<style>

@keyframes light-to-dark {
    0% {
        clip-path: polygon(0 0,0 0,calc(.14054083 * -100vh) 100%,calc(.14054083 * -100vh) 100%)
    }

    to {
        clip-path: polygon(0 0,calc((.14054083 * 100vh) + 100%) 0,100% 100%,calc(.14054083 * -100vh) 100%)
    }
}

@keyframes dark-to-light {
    0% {
        clip-path: polygon(calc((.14054083 * 100vh) + 100%) 0,calc((.14054083 * 100vh) + 100%) 0,100% 100%,100% 100%)
    }

    to {
        clip-path: polygon(0 0,calc((.14054083 * 100vh) + 100%) 0,100% 100%,calc(.14054083 * -100vh) 100%)
    }
}

:root::view-transition-group(root) {
    animation-duration: 1s;
}

:root::view-transition-new(root),:root::view-transition-old(root) {
    mix-blend-mode: normal
}

:root::view-transition-old(root),:root[theme-mode=dark]::view-transition-old(root) {
    animation: none
}

:root::view-transition-new(root) {
    animation-name: dark-to-light
}

:root[theme-mode=dark]::view-transition-new(root) {
    animation-name: light-to-dark
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

:root::view-transition-new(root), :root::view-transition-old(root) {
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


@keyframes -ua-view-transition-group-anim-root{
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

:root[theme-mode="dark"] {
    --td-errp-color: rgba(74, 74, 74, 0.4);
    --pagesmall: rgba(255, 255, 255, 0.6);
    --text-color: #fff;
    --dai1: #fff;
    --loading-block: rgba(255, 255, 255, 0.1);
    --loading-border: white;
}

.t-dropdown__item .t-dropdown__item--theme-default .t-dropdown__item{
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
.sidemenu .t-menu>.t-menu-group:first-child>.t-menu-group__title {
    padding-top: 0px !important;
}

.sidemenu {
    height: 100%;
    position: fixed !important;
    transition: transform 0.28s var(--transition-default), width 0.28s var(--transition-default) !important;
    transform: translateX(-232px);
    top: 56px;
}

.sidemenu-show {
    transform: translateX(0px);
}

.t-submenu>div {
    --ripple-color: var(--td-brand-color-light);
}

/** 顶菜单 */
.t-head-menu__inner {
    padding-right: 20px;
}

.t-menu__operations>a:nth-child(3)>svg {
    margin-right: 8px !important;
}

.t-menu__operations-icon {
    margin-right: 0px !important;
}

a:has(.t-menu__operations-icon):not(.guide_refresh) {
    margin-right: var(--td-comp-margin-l);
}


.we-tag-headmenu-operations-account .t-button__text {
    display: flex;
    align-items: center;
    max-width: 98px;
}

.t-popup--animation-enter-to[data-popper-placement^="bottom"] {
    animation: t-popup-animation-expand-in-bottom 0.2s cubic-bezier(0.38, 0, 0.24, 1),
        t-fade-in 0.2s linear !important;
}

.t-popup--animation-leave-to[data-popper-placement^="bottom"] {
    animation: t-popup-animation-expand-out-bottom 0.2s cubic-bezier(0.38, 0, 0.24, 1),
        t-fade-out 0.2s linear !important;
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
.t-breadcrumb__separator>svg.t-icon-chevron-right {
    color: var(--td-text-color-primary) !important;
}

/** Main Content */
.SideMenuShow-MainContent {
    margin-left: 232px;
}

.MainContent:not([noshowmenu="true"]) {
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
</style>
