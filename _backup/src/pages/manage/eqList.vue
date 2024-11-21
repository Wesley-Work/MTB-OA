<template>
    <div>
        <div style="display: flex; flex-direction: row">
            <t-space size="small">
                <t-button
                    variant="outline"
                    theme="primary"
                    ghost
                    style="--ripple-color: #fff"
                    @click="Dialog_Model.AddEq = true">
                    <template #icon>
                        <t-icon name="add" />
                    </template>
                    添加设备
                </t-button>
                <t-button
                    :disabled="SelectData.length > 1 || SelectData.length === 0"
                    @click="
                        (EditEqDialogFrom.id = SelectData[0].id),
                            (EditEqDialogFrom.eq_name = SelectData[0].eq_name),
                            (EditEqDialogFrom.eq_code = SelectData[0].eq_code),
                            (EditEqDialogFrom.model = SelectData[0].model),
                            (EditEqDialogFrom.sn = SelectData[0].sn),
                            (EditEqDialogFrom.status = SelectData[0].status),
                            (EditEqDialogFrom.type = SelectData[0].type),
                            (Dialog_Model.EditEq = true)
                    ">
                    <template #icon>
                        <t-icon name="edit-1" />
                    </template>
                    编辑
                </t-button>
                <t-popconfirm
                    theme="danger"
                    content="确认删除？删除后不可恢复！"
                    placement="bottom"
                    :onConfirm="DeleteEquipment">
                    <t-button :disabled="SelectData.length === 0" theme="danger">
                        <template #icon>
                            <t-icon name="delete" />
                        </template>
                        {{ SelectData.length == 0 ? "删除" : "删除 " + SelectData.length + " 个" }}
                    </t-button>
                </t-popconfirm>
            </t-space>
        </div>
        <div style="padding-top: 16px">
            <t-table
                row-key="id"
                :columns="table_Columns"
                :data="table_Data"
                select-on-row-click
                :reserveSelectedRowOnPaginate="false"
                :sort="table_Sort"
                @sort-change="sortChange"
                @select-change="handleTableSelectChange"
                @page-change="onPageChange"
                :pagination="table_Pagination"
                :loading="table_Loading"
                cellEmptyContent="-"
                stripe
                bordered>
            </t-table>
        </div>
    </div>
    <!---->
    <!--添加设备Dialog-->
    <t-dialog
        v-model:visible="Dialog_Model.AddEq"
        header="添加设备"
        width="42%"
        :closeBtn="false"
        cancelBtn="取消"
        confirmBtn="确认添加"
        :onConfirm="VerifyAddForm"
        :closeOnEscKeydown="false">
        <mtb-tag TAG />
        <div style="width: 100%; margin-top: 8px">
            <t-space direction="horizontal" size="16px" style="width: 100%">
                <t-space direction="vertical" size="12px" style="width: 100%">
                    <!--设备名称-->
                    <div>
                        <t-input v-model="AddEqDialogFrom.eq_name" label="设备名称：" type="text" required />
                    </div>
                    <div>
                        <t-input v-model="AddEqDialogFrom.eq_code" label="设备Code：" type="text" required />
                    </div>
                    <div>
                        <t-input v-model="AddEqDialogFrom.ascription" label="设备归属：" placeholder="" type="text" />
                    </div>
                    <div>
                        <t-input v-model="AddEqDialogFrom.model" label="设备型号：" placeholder="" type="text" />
                    </div>
                    <div>
                        <t-input v-model="AddEqDialogFrom.sn" label="设备sn码：" placeholder="" type="text" />
                    </div>
                </t-space>
                <t-space direction="vertical" size="12px" style="width: 100%">
                    <div>
                        <t-select
                            v-model="AddEqDialogFrom.type"
                            label="设备种类："
                            :value-display="TYPEvalueDisplay"
                            required>
                            <t-option
                                v-for="item in Add_Dialog_EqType"
                                :key="item.id"
                                :value="item.id"
                                :label="item.label">
                                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
                            </t-option>
                        </t-select>
                    </div>
                    <div>
                        <t-select
                            v-model="AddEqDialogFrom.status"
                            label="设备状态："
                            :value-display="STATUSvalueDisplay"
                            required>
                            <t-option
                                v-for="item in Add_Dialog_EqStatus"
                                :key="item.id"
                                :value="item.id"
                                :label="item.label"
                                :disabled="item.notchoose ? true : false"
                                :title="item.notchoose ? '不能将初始状态设为该值' : false">
                                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
                            </t-option>
                        </t-select>
                    </div>
                </t-space>
            </t-space>
        </div>
    </t-dialog>
    <!---->
    <t-dialog
        v-model:visible="Dialog_Model.EditEq"
        header="编辑设备"
        width="42%"
        :closeBtn="false"
        cancelBtn="取消"
        confirmBtn="提交编辑"
        :onConfirm="EditForm"
        :closeOnEscKeydown="false">
        <mtb-tag TAG />
        <div style="width: 100%; margin-top: 8px">
            <t-space direction="horizontal" size="16px" style="width: 100%">
                <t-space direction="vertical" size="12px" style="width: 100%">
                    <!--设备名称-->
                    <div>
                        <t-input v-model="EditEqDialogFrom.eq_name" label="设备名称：" type="text" required />
                    </div>
                    <div>
                        <t-input v-model="EditEqDialogFrom.eq_code" label="设备Code：" type="text" required />
                    </div>
                    <div>
                        <t-input v-model="EditEqDialogFrom.ascription" label="设备归属：" placeholder="" type="text" />
                    </div>
                    <div>
                        <t-input v-model="EditEqDialogFrom.model" label="设备型号：" placeholder="" type="text" />
                    </div>
                    <div>
                        <t-input v-model="EditEqDialogFrom.sn" label="设备sn码：" placeholder="" type="text" />
                    </div>
                </t-space>
                <t-space direction="vertical" size="12px" style="width: 100%">
                    <div>
                        <t-select
                            v-model="EditEqDialogFrom.type"
                            label="设备种类："
                            :value-display="TYPEvalueDisplay"
                            required>
                            <t-option
                                v-for="item in Add_Dialog_EqType"
                                :key="item.id"
                                :value="item.id"
                                :label="item.label">
                                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
                            </t-option>
                        </t-select>
                    </div>
                    <div>
                        <t-select
                            v-model="EditEqDialogFrom.status"
                            label="设备状态："
                            :value-display="STATUSvalueDisplay"
                            required>
                            <t-option
                                v-for="item in Edit_Dialog_EqStatus"
                                :key="item.id"
                                :value="item.id"
                                :label="item.label"
                                :disabled="item.not.indexOf(EditEqDialogFrom.status) === -1 ? false : true"
                                :title="item.not.indexOf(EditEqDialogFrom.status) === -1 ? false : '当前状态不能变更为该状态'">
                                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
                            </t-option>
                        </t-select>
                    </div>
                </t-space>
            </t-space>
        </div>
    </t-dialog>
</template>

<script setup lang="jsx">
import { ref } from "vue";
import { getCurrentInstance } from "vue";
const that = getCurrentInstance();

const Add_Dialog_EqType = [
    {
        id: 0,
        label: "媒体部设备",
        theme: "primary",
    },
    {
        id: 1,
        label: "晚修管理部部牌",
        theme: "warning",
    },
];

const Add_Dialog_EqStatus = [
    {
        id: 0,
        label: "正常",
        theme: "success",
    },
    {
        id: 1,
        label: "作为固定设备",
        theme: "primary",
    },
    {
        id: 2,
        label: "已借出",
        theme: "warning",
        notchoose: true,
    },
    {
        id: 3,
        label: "丢失",
        theme: "danger",
    },
    {
        id: 4,
        label: "清点中",
        theme: "primary",
        notchoose: true,
    },
];

const Edit_Dialog_EqStatus = [
    {
        id: 0,
        label: "正常",
        theme: "success",
        not: [2],
    },
    {
        id: 1,
        label: "作为固定设备",
        theme: "primary",
        not: [2],
    },
    {
        id: 2,
        label: "已借出",
        theme: "warning",
        not: [0, 1, 3, 4],
    },
    {
        id: 3,
        label: "丢失",
        theme: "danger",
        not: [],
    },
    {
        id: 4,
        label: "清点中",
        theme: "primary",
        not: [2],
    },
];

const TYPEvalueDisplay = (h, { value }) => {
    return (
        <t-tag theme={Add_Dialog_EqType[value].theme} variant="light-outline">
            {Add_Dialog_EqType[value].label}
        </t-tag>
    );
};

const STATUSvalueDisplay = (h, { value }) => {
    return (
        <t-tag theme={Add_Dialog_EqStatus[value].theme} variant="light-outline">
            {Add_Dialog_EqStatus[value].label}
        </t-tag>
    );
};
</script>

<script lang="jsx">
import { NotifyPlugin } from "tdesign-vue-next";
import { config } from "@/components/config.js";
import { HTTPRequest } from "@/components/function/hooks.js";

export default {
    name: "EqList",
    data() {
        return {
            table_Columns: [
                {
                    colKey: "row-select",
                    type: "multiple",
                    width: 45,
                },
                {
                    colKey: "id",
                    title: "id",
                    sortType: "all",
                    sorter: true,
                    width: "80",
                },
                {
                    colKey: "eq_code",
                    title: "设备Code",
                    sortType: "all",
                    sorter: true,
                    width: "200",
                },
                {
                    colKey: "eq_name",
                    title: "设备名",
                    sortType: "all",
                    sorter: true,
                    ellipsis: true,
                },
                { colKey: "model", title: "型号",sortType: "all", sorter: true },
                { colKey: "sn", title: "设备sn码" },
                { colKey: "ascription", title: "归属",sortType: "all", sorter: true },
                {
                    colKey: "type",
                    title: "设备种类",
                    sortType: "all",
                    sorter: true,
                    cell: (h, { row }) => {
                        return (
                            <t-tag shape="round" theme={row.type === 0 ? "primary" : "success"} variant="light-outline">
                                {row.type == 0 ? "部门设备" : "晚修管理部部牌"}
                            </t-tag>
                        );
                    },
                },
                {
                    colKey: "status",
                    title: "状态",
                    sortType: "all",
                    sorter: true,
                    cell: (h, { row }) => {
                        return (
                            <t-tag
                                shape="square"
                                theme={
                                    row.status === 0
                                        ? "success"
                                        : row.status === 1
                                        ? "primary"
                                        : row.status === 2
                                        ? "warning"
                                        : row.status === 3
                                        ? "danger"
                                        : row.status === 4
                                        ? "primary"
                                        : "default"
                                }
                                variant="light-outline">
                                {row.status === 0
                                    ? "正常"
                                    : row.status === 1
                                    ? "作为固定设备"
                                    : row.status === 2
                                    ? "已借出"
                                    : row.status === 3
                                    ? "丢失"
                                    : row.status === 4
                                    ? "清点中"
                                    : "数据错误"}
                            </t-tag>
                        );
                    },
                },
            ],
            table_Data: [],
            table_BackData: [],
            table_Sort: {
                sortBy: "id",
                descending: false,
            },
            table_Loading: false,
            SelectData: [],
            Dialog_Model: {
                AddEq: false,
                EditEq: false,
            },
            AddEqDialogFrom: {
                eq_name: "",
                eq_code: "",
                ascription: "",
                model: "",
                sn: "",
                type: 0,
                status: 0,
            },
            EditEqDialogFrom: {
                id: "",
                eq_name: "",
                eq_code: "",
                ascription: "",
                model: "",
                sn: "",
                type: 0,
                status: 0,
            },
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
        this.InitTableData();
    },

    methods: {
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
                    url: config.API_URL.MAIN_URL + "/equipment/list",
                    methods: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        that.$data.table_Data = RES.data;
                        that.$data.table_BackData = RES.data;
                        that.$data.table_Loading = false
                    },
                    error: function (err) {
                        that.$data.table_Loading = false
                        console.error(err);
                        NotifyPlugin("error", {
                            title: "获取设备列表失败",
                            content: err,
                            duration: 5000,
                        });
                    },
                });
            } catch (e) {
                console.log(e);
            }
        },

        /**
         * @VerifyAddForm
         * @提交添加设备验证表单
         */
        VerifyAddForm() {
            var FORMDATA = this.$data.AddEqDialogFrom;
            if (!FORMDATA.eq_name || !FORMDATA.eq_code) {
                NotifyPlugin("error", {
                    title: "添加设备失败",
                    content: "请填写设备必填信息",
                    duration: 5000,
                });
                return false;
            }
            // PASS
            var that = this;
            var TOKEN = localStorage.getItem("token");
            HTTPRequest({
                url: config.API_URL.MAIN_URL + "/equipment/add",
                methods: "POST",
                data: {
                    eqname: FORMDATA.eq_name,
                    eqcode: FORMDATA.eq_code,
                    ascription: FORMDATA.ascription,
                    sn: FORMDATA.sn,
                    model: FORMDATA.model,
                    type: FORMDATA.type,
                    status: FORMDATA.status,
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    token: TOKEN,
                },
                success: function (res) {
                    var RES = JSON.parse(res);
                    if (RES.errcode === 0) {
                        var E_id = RES.data.id;
                        NotifyPlugin("success", {
                            title: "添加设备成功",
                            content: `成功添加了id为${E_id}的设备`,
                            duration: 5000,
                        });
                        console.log(`添加了id为${E_id}的设备`);
                        // 刷新数据
                        that.InitTableData();
                    }
                },
                error: function (err) {
                    NotifyPlugin("error", {
                        title: "添加设备失败",
                        content: err,
                        duration: 5000,
                    });
                    console.error(err);
                },
            });
            // 关闭dialog
            this.$data.Dialog_Model.AddEq = false;
            // 还原表单
            FORMDATA = {
                eq_name: "",
                eq_code: "",
                ascription: "",
                model: "",
                sn: "",
                type: 0,
                status: 0,
            };
        },

        /**
         * @DeleteEquipment
         * @删除设备
         */
        DeleteEquipment() {
            var that = this;
            var list = this.$data.SelectData;
            var TOKEN = localStorage.getItem("token");
            for (const index in list) {
                if (Object.hasOwnProperty.call(list, index)) {
                    const element = list[index];
                    HTTPRequest({
                        url: config.API_URL.MAIN_URL + "/equipment/del",
                        methods: "POST",
                        data: {
                            id: element.id,
                        },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            token: TOKEN,
                        },
                        success: function (res) {
                            var RES = JSON.parse(res);
                            if (RES.errcode === 0) {
                                var E_id = RES.data.id;
                                console.log(`删除了id为${E_id}的设备`);
                            }
                            NotifyPlugin("success", {
                                title: "删除设备成功",
                                content: `成功删除了id为${E_id}的设备`,
                                duration: 5000,
                            });
                        },
                        error: function (err) {
                            NotifyPlugin("error", {
                                title: "删除设备失败",
                                content: err,
                                duration: 5000,
                            });
                            console.error(err);
                        },
                    });
                    if (index == list.length - 1) {
                        // 清空选择
                        this.$data.SelectData = [];
                        // 刷新数据
                        this.InitTableData();
                    }
                }
            }
        },

        /**
         * @EditForm
         * @编辑设备
         */
        EditForm() {
            var that = this;
            var FORMDATA = this.$data.EditEqDialogFrom;
            var TOKEN = localStorage.getItem("token");
            HTTPRequest({
                url: config.API_URL.MAIN_URL + "/equipment/edit",
                methods: "POST",
                data: {
                    id: FORMDATA.id,
                    eqname: FORMDATA.eq_name,
                    eqcode: FORMDATA.eq_code,
                    ascription: FORMDATA.ascription,
                    sn: FORMDATA.sn,
                    model: FORMDATA.model,
                    type: FORMDATA.type,
                    status: FORMDATA.status,
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    token: TOKEN,
                },
                success: function (res) {
                    var RES = JSON.parse(res);
                    if (RES.errcode === 0) {
                        var E_id = RES.data.id;
                        NotifyPlugin("success", {
                            title: "编辑设备信息成功",
                            content: `成功编辑了id为${E_id}的设备`,
                            duration: 5000,
                        });
                        console.log(`编辑了id为${E_id}的设备信息`);
                        // 刷新数据
                        that.InitTableData();
                    }
                },
                error: function (err) {
                    NotifyPlugin("error", {
                        title: "编辑设备信息失败",
                        content: err,
                        duration: 5000,
                    });
                    console.error(err);
                },
            });
            // 关闭dialog
            this.$data.Dialog_Model.EditEq = false;
            this.$data.SelectData = []
            // 还原表单
            FORMDATA = {
                id: "",
                eq_name: "",
                eq_code: "",
                ascription: "",
                model: "",
                sn: "",
                type: 0,
                status: 0,
            };
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
                        sort.descending ? Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' }).compare(a[sort.sortBy], b[sort.sortBy]) : Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' }).compare(b[sort.sortBy], a[sort.sortBy])
                    );
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

<style>
.t-dialog__body:has(mtb-tag[TAG]) {
    padding-bottom: 0px !important;
}

div[required]::before {
    content: "*";
    color: red;
    padding-right: 6px;
}

div[required] {
    display: flex;
    align-items: center;
}
</style>
