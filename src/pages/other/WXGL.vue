<template>
    <div class="MainBox" id="WXGLComponent"
        style="background: var(--td-bg-color-container); padding: 32px; border-radius: 5px" ref="MainBox">
        <div class="MainBox-Operate">
            <div id="wxglpage">
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                    <!--wxgl-->
                    <div style="min-width: 35%">
                        <!---->
                        <div style="margin-top: 13px">
                            <div style="display: flex; align-items: center;width: 68%;">
                                <span style="
                                        color: var(--td-text-color-primary);
                                        font: var(--td-font-body-medium);
                                        width: 91px;
                                    ">使用成员:
                                </span>
                                <t-select v-model="formData.person" :options="personData" placeholder="请选择成员" filterable
                                    clearable></t-select>
                            </div>
                        </div>
                        <!---->
                        <div style="margin-top: 13px">
                            <div style="display: flex; align-items: center;width: 68%;">
                                <!-- <span class="bitian">*</span> -->
                                <span style="
                                        color: var(--td-text-color-primary);
                                        font: var(--td-font-body-medium);
                                    ">部牌ID:
                                </span>
                                <t-input style="width: calc(100% - 106px); margin-left: 10px"
                                    placeholder="请扫描或输入" v-model="formData.lendcode" :onEnter="onLend"></t-input>
                                <t-button style="margin-left: -10px; z-index: 2" @click.end="onLend">取出</t-button>
                            </div>
                        </div>
                        <div style="margin-top: 13px">
                            <div style="display: flex; align-items: center;width: 68%;">
                                <t-input style="width: calc(100% - 106px); margin-left: 56px"
                                    placeholder="请扫描或输入" v-model="formData.returncode" :onEnter="onReturn"></t-input>
                                <t-button style="margin-left: -10px; z-index: 2" @click.end="onReturn">归还</t-button>
                            </div>
                        </div>
                    </div>
                    <!--list-->
                    <div style="max-width: 60%" lend-list-table>
                        <t-card id="weTag">
                            <template #title>
                                <span>本次操作列表</span>
                            </template>
                            <div style="display: flex; flex-direction: row; align-items: center">
                                <t-table :data="TableData" :columns="TableColumns"></t-table>
                            </div>
                        </t-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="jsx">
import { config } from "@/components/config.js";
import { HTTPRequest } from "@/components/function/hooks.js";
import scrollNumber from "@/components/function/scrollnumber.vue";
import { NotifyPlugin } from "tdesign-vue-next";
import { CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next';

export default {
    name: "WxGL",
    components: {
        scrollNumber,
    },
    data() {
        return {
            formData: {
                person: '',
                lendcode:'',
                returncode:'',
            },
            personData: [],
            TableData: [],
            TableColumns: [
                { colKey: "CardID", title: "牌ID" },
                {
                    colKey: "status",
                    title: "借出状态",
                    width: "120",
                    align: "center",
                    cell: (h, { row }) => {
                        return (
                            <t-tag
                                shape="round"
                                theme={row.status.theme}
                                variant="light-outline">
                                {row.status.icon}
                                {row.status.text}
                            </t-tag>
                        );
                    },
                },
                { colKey: "user", title: "借出/归还人", width: "210", align: "center" },
                { colKey: "dothisthinguser", title: "操作人", width: "160", align: "center" },
                { colKey: "operation_time", title: "操作时间", ellipsis: true },
                { colKey: "more", title: "备注", width: "250" },
            ],
        };
    },

    mounted() {
        // this.initStyle();
        this.initSelectData()
    },

    methods: {
        initStyle() {
            var a = document.getElementById("weTag");
            var b = a.getElementsByClassName("t-card__body")[0];
            b.style.overflow = "hidden";
            var c = b.getElementsByTagName("div")[0].clientHeight;
            b.style.maxHeight = c + 56 + "px";
        },

        initSelectData(){
            var that = this;
            var TOKEN = localStorage.getItem("token");
            HTTPRequest({
                url: config.API_URL.MAIN_URL + "/wxgl",
                methods: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    token: TOKEN,
                },
                data:{
                    mode: "getuserlist"
                },
                success: function (res) {
                    var RES = JSON.parse(res);
                    var data = RES.data
                    for (const index in data) {
                        if (Object.hasOwnProperty.call(data, index)) {
                            const element = data[index];
                            const items = { label: element.name, value: element.name }
                            that.$data.personData.push(items)
                        }
                    }
                },
                error: function (err) {
                    that.$data.Requesting = false
                    console.error(err);
                    NotifyPlugin("error", {
                        title: "获取人员名单失败！",
                        content: err,
                        duration: 5000,
                    });
                },
            });
        },

        onLend(){
            var that = this;
            var TOKEN = localStorage.getItem("token");
            HTTPRequest({
                url: config.API_URL.MAIN_URL + "/wxgl",
                methods: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    token: TOKEN,
                },
                data:{
                    mode: "lend",
                    usercode: that.$data.formData.person,
                    cardid: that.$data.formData.lendcode
                },
                success: function (res) {
                    var RES = JSON.parse(res);
                    if (RES.errcode == 0) {
                        NotifyPlugin("success", {
                            title: "取出成功",
                            duration: 5000,
                        });
                    }
                    else if (RES.errcode == -1001) {
                        NotifyPlugin("error", {
                            title: "取出失败！",
                            content: "缺少参数",
                            duration: 5000,
                        });
                        return;
                    }
                    else{
                        NotifyPlugin("error", {
                            title: "取出失败！",
                            content: RES.errmsg,
                            duration: 5000,
                        });
                    }
                    var a = {
                        CardID: RES.data.CardID,
                        status: {
                            text: RES.errcode == 0 ? "取出成功" : "取出失败",
                            theme: RES.errcode == 0 ? "success" : "danger",
                            icon: RES.errcode == 0 ? <CheckCircleFilledIcon /> : <CloseCircleFilledIcon />,
                        },
                        user: RES.data.username,
                        dothisthinguser: "晚修管理账号",
                        operation_time:RES.data.operation_time,
                        more: "ok",
                    }
                    that.$data.TableData.push(a)
                },
                error: function (err) {
                    that.$data.Requesting = false
                    console.error(err);
                    NotifyPlugin("error", {
                        title: "取出失败！",
                        content: err,
                        duration: 5000,
                    });
                },
            });
        },

        onReturn(){
            var that = this;
            var TOKEN = localStorage.getItem("token");
            HTTPRequest({
                url: config.API_URL.MAIN_URL + "/wxgl",
                methods: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    token: TOKEN,
                },
                data:{
                    mode: "return",
                    usercode: that.$data.formData.person,
                    cardid: that.$data.formData.returncode
                },
                success: function (res) {
                    var RES = JSON.parse(res);
                    if (RES.errcode == 0) {
                        NotifyPlugin("success", {
                            title: "归还成功",
                            duration: 5000,
                        });
                    }
                    else if (RES.errcode == -1001) {
                        NotifyPlugin("error", {
                            title: "归还失败",
                            content: "缺少参数",
                            duration: 5000,
                        });
                    }
                    else{
                        NotifyPlugin("error", {
                            title: "归还成功！",
                            content: RES.errmsg,
                            duration: 5000,
                        });
                        var a = {
                            CardID: RES.data.CardID,
                            status: {
                                text: RES.errcode == 0 ? "归还成功" : "归还失败",
                                theme: RES.errcode == 0 ? "success" : "danger",
                                icon: RES.errcode == 0 ? <CheckCircleFilledIcon /> : <CloseCircleFilledIcon />,
                            },
                            user: RES.data.username,
                            dothisthinguser: "晚修管理账号",
                            operation_time:RES.data.operation_time,
                            more: "ok",
                        }
                        that.$data.TableData.push(a)
                    }

                },
                error: function (err) {
                    that.$data.Requesting = false
                    console.error(err);
                    NotifyPlugin("error", {
                        title: "归还失败！",
                        content: err,
                        duration: 5000,
                    });
                },
            });
        },
    },
};
</script>

<style>
.MainBox {
    transition: height 0.28s var(--transition-default);
    user-select: none;
}

.t-card__body {
    overflow-y: hidden;
    transition: max-height 0.28s var(--transition-default) !important;
}

[lend-list-table] .t-card--bordered {
    border: none !important;
}
</style>
