<template>
    <div class="MainBox" style="background: var(--td-bg-color-container);padding: 32px;border-radius: 5px;position: relative;" id="MainBox">
        <div class="MainBox-Operate">
            <div>
                <div style="display: flex; flex-direction: column">
                    <div style="display: flex; align-items: center">
                        <span class="bitian">*</span>
                        <span style="
                                color: var(--td-text-color-primary);
                                font: var(--td-font-body-medium);
                            ">借出编号:
                        </span>
                        <t-input style="width: 181px; margin-left: 10px" class="lendinput" ref="lendinput"
                            placeholder="请扫描或输入" v-model="formData.code" :onEnter="check" :autofocus="true"></t-input>
                        <t-button class="lendbutton" style="margin-left: -10px; z-index: 2" @click.end="check">查询</t-button>
                    </div>
                    <t-row style="margin-top: 12px;">
                        <t-col :flex="6">
                            <div>
                                <t-descriptions title="借出信息" bordered :colon="true" :column="2">
                                    <t-descriptions-item label="借出记录id">{{ data.id }}</t-descriptions-item>
                                    <t-descriptions-item label="设备Code">{{ data.eqcode }}</t-descriptions-item>
                                    <t-descriptions-item label="设备名称">{{ data.eqname }}</t-descriptions-item>
                                    <t-descriptions-item label="借出人">{{ data.lender }}</t-descriptions-item>
                                    <t-descriptions-item label="使用人">{{ data.user }}</t-descriptions-item>
                                    <t-descriptions-item label="归还人">{{ data.returner }}</t-descriptions-item>
                                    <t-descriptions-item label="借出时间">{{ data.lendtime }}</t-descriptions-item>
                                    <t-descriptions-item label="归还时间">{{ data.returntime }}</t-descriptions-item>
                                    <t-descriptions-item label="借出记录SHA" :span="2">{{ data.record_sha }}</t-descriptions-item>
                                    <t-descriptions-item label="备注" :span="2">{{ data.remark }}</t-descriptions-item>
                                </t-descriptions>
                            </div>
                        </t-col>
                        <t-col :flex="5"></t-col>
                    </t-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="jsx">
// import * as api from "../../components/config/api.js";
import useRequest from "../../hooks/useRequest";
import * as config from "../../components/config";
import { getToken } from "../../hooks/common";
import { NotifyPlugin } from "tdesign-vue-next";

export default {
    name: "LendList",
    data() {
        return {
            formData: {
                code: "",
            },
            data: {},
            loading: false,
            hasresult: false,
        };
    },

    mounted() { },

    methods: {
        check() {
            const TOKEN = getToken();
            var that = this
            useRequest({
                url: "/record/item",
                methods: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    token: TOKEN,
                },
                data: {
                    id: this.$data.formData.code,
                },
                success: function (res) {
                    const json = JSON.parse(res);
                    if (json.errcode != 0) {
                        NotifyPlugin.error({
                            title: "获取记录失败",
                            content: "错误：" + json.errmsg,
                        })
                        return;
                    }
                    that.$data.data = json.data;
                },
                error: function (err) {
                    console.error(err)
                    NotifyPlugin.error({
                        title: "获取记录失败",
                        content: "错误：" + err,
                    })
                }
            })
        },
    },
};
</script>

<style>
[data-w-di13cx] .t-col-3:first-child{
    padding-bottom: 16px;
}
</style>
