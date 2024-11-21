<template>
    <!---->
    <div
        style="
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font: var(--td-font-headline-large);
            padding-left: 12px;
        ">
        <div>行为日志</div>
        <div style="display: flex; gap: 8px">
            <t-radio-group
                :value="DayPicker"
                :onChange="RadioChange">
                <t-radio-button value="1">今天</t-radio-button>
                <t-radio-button value="2">近三天</t-radio-button>
                <t-radio-button value="3">近七天</t-radio-button>
            </t-radio-group>
            <t-date-picker
                :value="DatePicker"
                :disableDate="InitDateDateSelectData"
                :onPick="PickerDate"
                valueType="YYYY-MM-DD"/>
        </div>
    </div>
    <div>
        <t-table
            row-key="time"
            :columns="table_Columns"
            :data="table_Data"
            :sort="table_Sort"
            :loading="table_Loading"
            @sort-change="sortChange"
            @select-change="handleTableSelectChange"
            @page-change="onPageChange"
            :pagination="table_Pagination"
            cellEmptyContent="-"
            stripe>
        </t-table>
    </div>
</template>

<script lang="jsx">
import { NotifyPlugin } from "tdesign-vue-next";
import { config } from "@/components/config.js";
import { HTTPRequest } from "@/components/function/hooks.js";

export default {
    name: "LogUser",
    data() {
        return {
            table_Columns: [
                { colKey: "time", title: "时间", sortType: "all", sorter: true, width: "220",
                    cell: (h, { row }) => {
                        return (
                            [
                                new Date(row.time).getFullYear(),
                                (new Date(row.time).getMonth() + 1) <= 9 ? "0" + (new Date(row.time).getMonth() + 1) : (new Date(row.time).getMonth() + 1),
                                (new Date(row.time).getDate()) <= 9 ? "0" + (new Date(row.time).getDate()) : (new Date(row.time).getDate()),
                            ].join('-') + " " + new Date(row.time).toTimeString().substring(0, 8) + "." + new Date(row.time).getMilliseconds()
                        );
                    }
                },
                { colKey: "event", title: "日志标题", ellipsis: true },
                { colKey: "log", title: "内容", ellipsis: true },
                {
                    colKey: "status",
                    title: "类型",
                    width: "170",
                    sortType: "all",
                    sorter: true,
                    cell: (h, { row }) => {
                        return (
                            <t-tag
                                shape="square"
                                theme={
                                    row.status == 0
                                        ? "success"
                                        : row.status == 1
                                        ? "danger"
                                        : row.status == 2
                                        ? "warning"
                                        : "primary"
                                }
                                variant="light-outline">
                                {row.status == 0
                                    ? "正常"
                                    : row.status == 1
                                    ? "错误"
                                    : row.status == 2
                                    ? "告警"
                                    : "记录"}
                            </t-tag>
                        );
                    },
                },
                { colKey: "USER_code", title: "用户Code", width: "160" },
                { colKey: "USER_ip", title: "用户ip地址" },
                { colKey: "url", title: "访问地址", ellipsis: true },
                { colKey: "version", title: "后端版本", width: "160" },
            ],
            table_Data: [],
            table_BackData: [],
            table_Sort: {
                sortBy: "time",
                descending: true,
            },
            table_Loading: false,
            Data: [],
            DateSelectData: [],
            DatePicker: "",
            DayPicker: "1",
        };
    },
    computed: {
        table_Pagination: function () {
            return {
                current: 1,
                pageSize: 25,
                pageSizeOptions: [25, 75, 115, 150],
                total: this.table_Data.length,
                showJumper: true,
            };
        },
    },
    mounted() {
        this.$data.DatePicker = new Date().toLocaleDateString();
        this.InitTableData();
    },

    methods: {
        getToday(e = new Date()) {
            var year = e.getFullYear();
            var month = e.getMonth() + 1 <= 9 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1;
            var day = e.getDate() <= 9 ? "0" + e.getDate() : e.getDate();
            var date = year + "-" + month + "-" + day;
            return date;
        },

        /**
         * @InitTableData
         * @加载表格数据
         */
        InitTableData(date = this.getToday(),push = false) {
            this.InitDatePickerData();
            this.$data.table_Loading = true;
            var that = this;
            var TOKEN = localStorage.getItem("token");
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/log/user",
                    methods: "POST",
                    data: {
                        date: date || "",
                    },
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        if (RES.data.length == 0) {
                            if (push == false){
                                that.$data.table_Data = [];
                            }
                            return
                        }
                        if (push) {
                            for (const index in RES.data[0].data) {
                                if (Object.hasOwnProperty.call(RES.data[0].data, index)) {
                                    const element = RES.data[0].data[index];
                                    that.$data.table_Data.push(element);
                                }
                                if (index == RES.data[0].data.length - 1) {
                                    that.$data.table_Loading = false;
                                    that.$data.table_BackData = that.$data.table_Data
                                }
                            }
                        }
                        else{
                            that.$data.Data = RES.data;
                            that.$data.table_Data = RES.data[0].data;
                            that.$data.table_BackData = RES.data[0].data
                            that.$data.table_Loading = false;
                        }
                    },
                    error: function (err) {
                        that.$data.table_Loading = false;
                        console.error(err);
                        NotifyPlugin("error", {
                            title: "获取日志内容失败",
                            content: err,
                            duration: 5000,
                        });
                    },
                });
            } catch (e) {
                console.log(e);
            }
        },


        CleanTable() {
            this.$data.table_Data = [];
        },

        InitDatePickerData() {
            this.$data.table_Loading = true;
            var that = this;
            var TOKEN = localStorage.getItem("token");
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/log/getFileDate",
                    methods: "POST",
                    data: {
                        type: "USER",
                    },
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        for (const index in RES.data) {
                            if (Object.hasOwnProperty.call(RES.data, index)) {
                                const element = RES.data[index].date;
                                that.$data.DateSelectData.push(element);
                            }
                        }
                        that.$data.table_Loading = false;
                    },
                    error: function (err) {
                        that.$data.table_Loading = false;
                        console.error(err);
                        NotifyPlugin("success", {
                            title: "获取日志日期失败",
                            content: err,
                            duration: 5000,
                        });
                    },
                });
            } catch (e) {
                console.log(e);
            }
        },

        PickerDate(e) {
            this.$data.DatePicker = e;
            this.$data.DayPicker != '1' ? '' : (this.$data.DayPicker = '0');
            e.toLocaleDateString() == new Date().toLocaleDateString() ? (this.$data.DayPicker = '1') : '';
            var that = this;
            var date = this.getToday(e)
            var object = that.$data.DateSelectData;
            for (const index in object) {
                if (Object.hasOwnProperty.call(object, index)) {
                    const element = object[index];
                    console.log(element,date)
                    if (element == date) {
                        that.InitTableData(date);
                        return true;
                    }
                }
            }
            NotifyPlugin("error", {
                title: "日期选择错误",
                content: "请检查日期是否正确",
                duration: 5000,
            });
        },

        RadioChange(e) {
            this.$data.DayPicker = e;
            var date = this.getToday()
            var first = true
            var that = this
            if (e == '1') {
                this.InitTableData()
            }
            else if (e == '2') {
                this.CleanTable()
                for (let index = 0; index < 3; index++) {
                    var a = new Date(new Date(date).setDate(new Date(date).getDate() - index))
                    first ? first = false : ''
                    var b = that.getToday(a)
                    this.InitTableData(b, first == true ? false : true)
                }
            }
            else if (e == '3') {
                this.CleanTable()
                for (let index = 0; index < 7; index++) {
                    var a = new Date(new Date(date).setDate(new Date(date).getDate() - index))
                    first ? first = false : ''
                    var b = that.getToday(a)
                    this.InitTableData(b, first == true ? false : true)
                }
            }
            else {
                NotifyPlugin("error", {
                    title: "日期选择错误",
                    content: "请检查日期是否正确",
                    duration: 5000,
                });
            }
        },

        InitDateDateSelectData(e) {
            var year = e.getFullYear();
            var month = e.getMonth() + 1 <= 9 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1;
            var day = e.getDate() <= 9 ? "0" + e.getDate() : e.getDate();
            var date = year + "-" + month + "-" + day;
            var object = this.$data.DateSelectData;
            for (const index in object) {
                if (Object.hasOwnProperty.call(object, index)) {
                    const element = object[index];
                    if (element == date) {
                        return false;
                    }
                }
            }
            return true;
        },


        sortChange(e) {
            this.$data.table_Sort = e;
            this.TableSortData();
        },

        TableSortData() {
            var data = this.$data.table_Data;
            var sort = this.$data.table_Sort;
            if (sort) {
                this.$data.table_Data = data
                    .concat()
                    .sort((a, b) =>
                        sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]
                    )
            } else {
                this.$data.table_Data = this.$data.table_BackData;
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
