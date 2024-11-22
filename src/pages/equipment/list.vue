<template>
    <!-- <t-space size="small">
        <t-button variant="outline" theme="primary" ghost style="--ripple-color: #fff" @click="attc">
            <template #icon>
                <t-icon name="add" />
            </template>
            补记录
        </t-button>
        <t-button :disabled="SelectData.length > 1 || SelectData.length == 0">
            <template #icon>
                <t-icon name="edit-1" />
            </template>
            编辑
        </t-button>
        <t-popconfirm theme="danger" content="确认删除？删除后不可恢复！" placement="bottom" :onConfirm="del">
            <t-button :disabled="SelectData.length == 0" theme="danger">
                <template #icon>
                    <t-icon name="delete" />
                </template>
                删除
            </t-button>
        </t-popconfirm>
    </t-space> -->
    <div style="display: flex;flex-direction: row;align-items: center;gap: 4px;font-size: 18px;font-family: PingFang SC, Microsoft YaHei, Arial Regular;color: var(--td-warning-color);font-weight: 600;">
        <span style="font-size: 26px;display: flex;"><info-circle-icon /></span>
        <span>本页面数据不包含晚修管理部牌借出数据！</span>
    </div>
    <!---->
    <div style="margin-top: 16px;">
        <t-table row-key="id" :columns="table_Columns" :data="table_Data" select-on-row-click cellEmptyContent="-" bordered
            :reserveSelectedRowOnPaginate="false" @select-change="handleTableSelectChange" @page-change="onPageChange"
            :pagination="table_Pagination">
        </t-table>
    </div>
</template>

<script lang="jsx" setup>
import { InfoCircleIcon } from 'tdesign-icons-vue-next';
</script>

<script lang="jsx">
import { config } from "../../components/config";
import { HTTPRequest } from "../../components/function/hooks";
import { NotifyPlugin } from "tdesign-vue-next";


export default {
    name: "LendList",
    data() {
        return {
            NotifyPlugin,
            table_Columns: [
                {
                    colKey: "row-select",
                    type: "single",
                    width: 45,
                },
                { colKey: "id", title: "借出编号", width: "100" },
                { colKey: "lender", title: "借出人", width: "160",align: "center" },
                { colKey: "user", title: "使用人", width: "160",align: "center" },
                { colKey: "eqname", title: "设备名称", width: "200",align: "center"},
                { colKey: "eqcode", title: "设备Code", width: "200",align: "center" },
                { colKey: "lendtime", title: "借出时间", width: "220",align: "center" },
                { colKey: "returner", title: "归还人", width: "160",align: "center" },
                { colKey: "returntime", title: "归还时间", width: "220",align: "center" },
                {
                    colKey: "status", title: "状态", width: "240",align: "center",
                    cell: (h, { row }) => {
                        return (
                            <t-tag theme={row.status == 0 ? 'success' : row.status == 1 ? 'warning' : 'danger'} variant="light-outline">
                                {row.status == 0 ? '归档' : row.status == 1 ? '未归还' : row.status}
                            </t-tag>
                        );
                    },
                },
            ],
            table_Data: [],
            SelectData: [],
        }
    },
    computed: {
        table_Pagination: function () {
            return {
                current: 1,
                pageSize: 25,
                pageSizeOptions: [25, 75, 100, 175],
                total: this.table_Data.length,
                showJumper: true,
            }
        },
    },
    mounted() {
        this.InitTableData();
    },
    methods: {


        attc(){
            NotifyPlugin('warning',{
                title: '提示',
                content: ()=> {
                    return (
                        <div style='color: var(--text-color);font: var(--td-font-title-medium);letter-spacing: 0.3px;'>对不起，该功能正在开发中（不一定上线）请使用借出设备功能！</div>
                    )
                }
            })
        },

        /**
         * @InitTableData
         * @初始化表格数据
         */
         InitTableData() {
            this.$data.table_Loading = true;
            var that = this;
            var TOKEN = localStorage.getItem("token");
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/record/list",
                    methods: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        if (RES.errcode == 0) {
                            that.$data.table_Data = RES.data
                        }
                        else{
                            NotifyPlugin("error", {
                                title: "获取设备借出列表失败",
                                content: RES.errmsg,
                                duration: 5000,
                            });
                        }
                    },
                    error: function (err) {
                        that.$data.table_Loading = false;
                        console.error(err);
                        NotifyPlugin("error", {
                            title: "获取设备借出列表失败",
                            content: err,
                            duration: 5000,
                        });
                    },
                });
            } catch (e) {
                console.log(e);
            }
        },




        handleTableSelectChange(value, { selectedRowData }) {
            this.$data.SelectData = selectedRowData;
        },
        onPageChange(pageInfo, context) {
            this.table_Pagination.current = pageInfo.current;
            this.table_Pagination.pageSize = pageInfo.pageSize;
        },
    },
};
</script>

<style></style>
