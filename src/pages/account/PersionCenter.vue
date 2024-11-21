<template>
    <div>
        <t-row>
            <t-col flex="3" style="padding-right: 12px;">
                <div>
                    <div class="welcometitle">
                        <div>
                            Hi，{{ userinfo.name }}
                            <span style="margin-left: 20px; font: var(--td-font-body-medium)">{{ now }}，今天是你加入媒体部的第 {{ day
                            }} 天~</span>
                        </div>
                    </div>
                </div>
                <div>
                    <t-card class="userinfolist">
                        <template #header>
                            <div class="t-card__title">个人信息</div>
                        </template>
                        <div>
                            <t-row>
                                <t-col span="3">
                                    <div class="contract-title">姓名</div>
                                    <div class="contract-detail">{{ userinfo.name }}</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">班级</div>
                                    <div class="contract-detail">{{ userinfo.class }}</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">UserCode</div>
                                    <div class="contract-detail">{{ userinfo.code }}</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">用户id</div>
                                    <div class="contract-detail">6179f08c-06e0-4de2-935f-cda80b4c48cd</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">权限等级</div>
                                    <div class="contract-detail">LEAVE {{ userinfo.admin }}</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">管理主体</div>
                                    <div class="contract-detail">媒体部</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">直属上级</div>
                                    <div class="contract-detail">{{ userinfo.father }}</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">职位</div>
                                    <div class="contract-detail">{{ userinfo.position }}</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">入职时间</div>
                                    <div class="contract-detail">{{ userinfo.jointime }}</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">所属团队</div>
                                    <div class="contract-detail">{{ userinfo.group }}</div>
                                </t-col>
                                <t-col span="3">
                                    <div class="contract-title">关联账户</div>
                                    <div class="contract-detail">-</div>
                                </t-col>
                            </t-row>
                        </div>
                    </t-card>
                </div>
            </t-col>
            <t-col flex="1" style="padding-left: 12px;">
                <div
                    style="padding: 32px;height: 166px;background: var(--td-brand-color);border-radius: var(--td-radius-medium);color: var(--td-text-color-primary);">
                    <div class="">
                        <t-avatar size="80px">{{ userinfo.name.split("")[0] }}</t-avatar>
                        <div
                            style="font: 24px / var(--td-line-height-title-large) var(--td-font-family);margin-top: 30px;color: var(--td-text-color-anti);">
                            {{ userinfo.name }}</div>
                        <div
                            style="font: var(--td-font-body-medium);margin-top: var(--td-comp-margin-s);color: var(--td-text-color-anti);">
                            MTB {{ position }}</div>
                    </div>
                </div>
                <div>
                    <t-card class="usergroup">
                        <template #header>
                            <div class="t-card__title">团队成员</div>
                        </template>
                        <div>
                            <t-list>
                                <t-list-item>
                                    <t-list-item-meta image="https://avatars.githubusercontent.com/pengYYYYY" title="人" description="？？？？？？？" />
                                </t-list-item>
                            </t-list>
                        </div>
                    </t-card>
                </div>
            </t-col>
        </t-row>
    </div>
</template>

<script>
import * as api from "../../components/config/api.js";
import * as config from "../../components/config"; // for testing, replace with "./config.js" for production server. 描述自身数据库信息以";
export default {
    name: "PersionCenter",
    data() {
        return {
            userinfo: {
                name: "张三三",
                code: "001",
                class: "不知道231",
                admin: 0,
                father: "技术组组长-33",
                position: "技术支持",
                jointime: "1998-07-01",
                group: "团委学生会/媒体部/技术组/基础业务群系",

            },
            now: "中午好",
            day: "10",
            position: "副部长 技术组组长 书记",
        };
    },
    // setup() {
    //     const isDark = useDark({
    //         selector: 'html',
    //         attribute: 'theme-mode',
    //         valueDark: 'dark',
    //         valueLight: 'light',
    //     })

    //     const toggleDark = useToggle(isDark)
    //     return {
    //         isDark,
    //         toggleDark,
    //     }
    // },
    mounted() { },

    methods: {},
};
</script>

<style>
.welcometitle {
    padding: 32px;
    font: var(--td-font-title-large);
    background: var(--td-bg-color-container);
    color: var(--td-text-color-primary);
    text-align: left;
    border-radius: var(--td-radius-medium);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.usergroup {
    margin-top: var(--td-comp-margin-l) !important;
    padding: 32px !important;
    border: none !important;
}

.usergroup .t-card__header {
    padding: 0 !important;
    margin-bottom: var(--td-comp-margin-m) !important;
}

.usergroup .t-card__title {
    font: var(--td-font-title-large);
    font-weight: 400;
}

.userinfolist {
    margin-top: var(--td-comp-margin-l) !important;
    padding: 32px !important;
    border: none !important;
}

.userinfolist .t-card__header {
    padding: 0 !important;
    margin-bottom: var(--td-comp-margin-m) !important;
}

.userinfolist .t-card__title {
    font: var(--td-font-title-large);
    font-weight: 400;
}

.userinfolist .t-card__body,.usergroup .t-card__body {
    padding: 0 !important;
}

.usergroup .t-list-item{
    margin-top: var(--td-comp-margin-xxl) !important;
    padding: 0 !important;
}

.usergroup .t-list-item__meta-avatar{
    width: 48px !important;
    height: 48px !important;
}

.contract-title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: var(--td-comp-margin-xxxl) 0 var(--td-comp-margin-l);
    font: var(--td-font-body-medium);
    color: var(--td-text-color-placeholder);
}

.contract-detail {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font: var(--td-font-body-medium);
    color: var(--td-text-color-primary);
}
</style>