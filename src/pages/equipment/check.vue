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
                    <div v-if="hasresult">
                        <t-row align="middle">
                            <t-col :span="6">
                                <div data-w-di13cx>
                                    <t-row>
                                        <t-col v-for="(item, index) in data" :key="item.id" :span="3">
                                            <div>{{ item.lable }}</div>
                                            <div>{{ item.text }}</div>
                                        </t-col>
                                    </t-row>
                                </div>
                            </t-col>
                            <t-col :span="6">
                                <div>
                                    <t-steps layout="vertical" :current="4" readonly>
                                        <t-step-item title="借出设备" content="" />
                                        <t-step-item title="使用" content="" />
                                        <t-step-item title="归还" content="" />
                                    </t-steps>
                                </div>
                            </t-col>
                        </t-row>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <t-loading attach="#MainBox" size="middle" :loading="loading" text="搜索中..."></t-loading>
</template>

<script lang="jsx">
// import * as api from "../../components/config/api.js";
import * as config from "../../components/config";
export default {
    name: "LendList",
    data() {
        return {
            formData: {
                code: "",
            },
            data: [
                {
                    lable: "设备编号",
                    text: "123456789",
                }, {
                    lable: "设备编号",
                    text: "123456789",
                }, {
                    lable: "设备编号",
                    text: "123456789",
                }, {
                    lable: "设备编号",
                    text: "123456789",
                }, {
                    lable: "设备编号",
                    text: "123456789",
                }, {
                    lable: "设备编号",
                    text: "123456789",
                }, {
                    lable: "设备编号",
                    text: "123456789",
                },
            ],
            loading: false,
            hasresult: false,
        };
    },

    mounted() { },

    methods: {
        check() {
            this.$data.loading = true;
        },
    },
};
</script>

<style>
[data-w-di13cx] .t-col-3:first-child{
    padding-bottom: 16px;
}
</style>
