<template>
    <div>
        <div style="display: flex; flex-direction: row">
            <t-space size="small">
                <t-button variant="outline" theme="primary" ghost style="--ripple-color: #fff"
                    @click="Dialog_Model.AddUser = true; AddUserDialogFrom.reg_time = new Date(); AddUserDialogFrom.join_time = new Date();">
                    <template #icon>
                        <t-icon name="add" />
                    </template>
                    添加账号
                </t-button>
                <t-button :disabled="SelectData.length > 1 || SelectData.length === 0" @click="
                        (console.log(SelectData[0])),
                        (EditUserDialogFrom.id = SelectData[0].id),
                        (EditUserDialogFrom.name = SelectData[0].name),
                        (EditUserDialogFrom.code = SelectData[0].code),
                        (EditUserDialogFrom.class = SelectData[0].class),
                        (EditUserDialogFrom.password = ''),
                        (EditUserDialogFrom.group = SelectData[0].group),
                        (EditUserDialogFrom.grade = SelectData[0].grade),
                        (EditUserDialogFrom.share_device = SelectData[0].share_device),
                        (EditUserDialogFrom.reg_time = new Date(SelectData[0].reg_time)),
                        (EditUserDialogFrom.join_time = new Date(SelectData[0].join_time)),
                        (AddUserDialogFrom.permissions = []),
                        (Dialog_Model.EditUser = true),
                        initEditPermissions()
                        ">
                    <template #icon>
                        <t-icon name="edit-1" />
                    </template>
                    编辑
                </t-button>
                <t-popconfirm theme="danger" content="确认删除？删除后不可恢复！" placement="bottom" :onConfirm="DeleteEquipment">
                    <t-button :disabled="SelectData.length === 0" theme="danger">
                        <template #icon>
                            <t-icon name="delete" />
                        </template>
                        {{ SelectData.length == 0 ? "删除" : "删除 " + SelectData.length + " 个" }}
                    </t-button>
                </t-popconfirm>
                <t-upload theme="file" accept=".xls,.xlsx" :requestMethod="ParsingFile"/>
            </t-space>
        </div>
        <div style="padding-top: 16px">
            <t-table row-key="id" :columns="table_Columns" :data="table_Data" select-on-row-click
                :reserveSelectedRowOnPaginate="false" :sort="table_Sort" @sort-change="sortChange"
                @select-change="handleTableSelectChange" @page-change="onPageChange" :pagination="table_Pagination"
                :loading="table_Loading" cellEmptyContent="-" stripe bordered>
            </t-table>
        </div>
    </div>
    <!--Add Dialog-->
    <t-dialog v-model:visible="Dialog_Model.AddUser" header="添加用户" width="45%" :closeBtn="false" cancelBtn="取消"
        confirmBtn="确认添加" :onConfirm="VerifyAddForm" :closeOnEscKeydown="false">
        <mtb-tag TAG />
        <div style="width: 100%; margin-top: 8px">
            <t-space direction="horizontal" size="16px" style="width: 100%">
                <t-space direction="vertical" size="12px" style="width: 100%">
                    <div style="font-size: 20px;font-weight: 700;color: var(--td-text-color-primary);">基本信息</div>
                    <div>
                        <t-input v-model="AddUserDialogFrom.name" label="用户名称：" type="text" required />
                    </div>
                    <div>
                        <t-input v-model="AddUserDialogFrom.code" label="用户Code：" type="text" required />
                    </div>
                    <div>
                        <t-input v-model="AddUserDialogFrom.class" label="班级：" type="text" unrequired />
                    </div>
                    <div>
                        <t-input-number v-model="AddUserDialogFrom.grade" theme="column" :max="2099" :min="2021"
                            label="年级：" unrequired style="width: 100%;"></t-input-number>
                    </div>
                    <div>
                        <div style="display: flex">
                            <t-input v-model="AddUserDialogFrom.password" label="账户密码：" type="text" required />
                            <t-button variant="dashed" @click="AddUserDialogFrom.password = '123456'">默认密码</t-button>
                        </div>
                    </div>
                </t-space>
                <t-space direction="vertical" size="12px" style="width: 100%">
                    <div style="font-size: 20px;font-weight: 700;color: var(--td-text-color-primary);">其他信息</div>
                    <div required>
                        <t-button variant="dashed" block @click="Dialog_Model.Permissions = true">配置权限</t-button>
                    </div>
                    <div>
                        <t-select :value="AddUserDialogFrom.group" :options="groupOptions" label="组别：" placeholder="请选择"
                            :onChange="(e) => { AddUserDialogFrom.group = e }" />
                    </div>
                    <div>
                        <t-input-number v-model="AddUserDialogFrom.share_device" theme="column" :max="99" :min="0" required
                            label="共享设备数：" unrequired style="width: 100%;"></t-input-number>
                    </div>
                    <div style="display: flex;align-items: center;">
                        <span
                            style="width: 25%;z-index: 2;height: 100%;text-align: center;display: flex;align-items: center;font-size: var(--td-font-size-body-medium);color: var(--td-text-color-primary);">加入时间：</span>
                        <t-date-picker style="width: 100%;" :allowInput="true" placeholder="请选择"
                            :value="AddUserDialogFrom.join_time"></t-date-picker>
                    </div>
                    <div style="display: flex;align-items: center;">
                        <span
                            style="width: 25%;z-index: 2;height: 100%;text-align: center;display: flex;align-items: center;font-size: var(--td-font-size-body-medium);color: var(--td-text-color-primary);">注册时间：</span>
                        <t-date-picker style="width: 100%;" :allowInput="true" placeholder="请选择"
                            format="YYYY-MM-DD HH:mm:ss" :enableTimePicker="true"
                            :value="AddUserDialogFrom.reg_time"></t-date-picker>
                    </div>
                </t-space>
            </t-space>
        </div>
    </t-dialog>
    <!--Edit Dialog-->
    <t-dialog v-model:visible="Dialog_Model.EditUser" header="编辑用户" width="45%" :closeBtn="false" cancelBtn="取消"
        confirmBtn="提交更新" :onConfirm="EditForm" :closeOnEscKeydown="false">
        <mtb-tag TAG />
        <div style="width: 100%; margin-top: 8px">
            <t-space direction="horizontal" size="16px" style="width: 100%">
                <t-space direction="vertical" size="12px" style="width: 100%">
                    <div style="font-size: 20px;font-weight: 700;color: var(--td-text-color-primary);">基本信息</div>
                    <div>
                        <t-input v-model="EditUserDialogFrom.name" label="用户名称：" type="text" required />
                    </div>
                    <div>
                        <t-input v-model="EditUserDialogFrom.code" label="用户Code：" type="text" required />
                    </div>
                    <div>
                        <t-input v-model="EditUserDialogFrom.class" label="班级：" type="text" unrequired />
                    </div>
                    <div>
                        <t-input-number v-model="EditUserDialogFrom.grade" theme="column" :max="2099" :min="2021"
                            label="年级" unrequired style="width: 100%;"></t-input-number>
                    </div>
                    <div>
                        <div style="display: flex;">
                            <t-input v-model="EditUserDialogFrom.password" label="账户密码：" placeholder="加密后密码不会显示，如需修改密码请输入密码" type="text" clearable required />
                            <t-button variant="dashed" @click="EditUserDialogFrom.password = '123456'">默认密码</t-button>
                        </div>
                    </div>
                </t-space>
                <t-space direction="vertical" size="12px" style="width: 100%">
                    <div style="font-size: 20px;font-weight: 700;color: var(--td-text-color-primary);">其他信息</div>
                    <div required>
                        <t-button variant="dashed" block @click="Dialog_Model.Permissions = true">配置权限</t-button>
                    </div>
                    <div>
                        <t-select :value="EditUserDialogFrom.group" :options="groupOptions" label="组别："
                            placeholder="请选择" :onChange="(e) => { EditUserDialogFrom.group = e }" />
                    </div>
                    <div>
                        <t-input-number v-model="EditUserDialogFrom.share_device" theme="column" :max="99" :min="0" required
                            label="共享设备数：" unrequired style="width: 100%;"></t-input-number>
                    </div>
                    <div style="display: flex;align-items: center;">
                        <span
                            style="width: 25%;z-index: 2;height: 100%;text-align: center;display: flex;align-items: center;font-size: var(--td-font-size-body-medium);color: var(--td-text-color-primary);">加入时间：</span>
                        <t-date-picker style="width: 100%;" :presets="{ '今天': dayjs() }" :allowInput="true"
                            placeholder="请选择" :value="EditUserDialogFrom.join_time"
                            :onChange="(e) => { EditUserDialogFrom.join_time = e }"></t-date-picker>
                    </div>
                    <div style="display: flex;align-items: center;">
                        <span
                            style="width: 25%;z-index: 2;height: 100%;text-align: center;display: flex;align-items: center;font-size: var(--td-font-size-body-medium);color: var(--td-text-color-primary);">注册时间：</span>
                        <t-date-picker style="width: 100%;" :presets="{ '今天': dayjs() }" :allowInput="true"
                            placeholder="请选择" format="YYYY-MM-DD HH:mm:ss" :enableTimePicker="true"
                            :value="EditUserDialogFrom.reg_time"
                            :onChange="(e) => { EditUserDialogFrom.reg_time = e }"></t-date-picker>
                    </div>
                </t-space>
            </t-space>
        </div>
    </t-dialog>
    <!--Permissions Dialog-->
    <t-dialog v-model:visible="Dialog_Model.Permissions" header="选择权限" width="40%" :closeBtn="false" cancelBtn="取消"
        confirmBtn="保存" :onConfirm="SUM_Permissions" :closeOnEscKeydown="false">
        <div>
            <t-checkbox key="all" :check-all="true" v-if="ckey == 0" :label="'全选：'+key+'组'" />
            <div v-for="(index,key) in PermissionsList" :key="key" style="display: flex;align-items: center;margin: 4px 0px;">
                <span style="font-size: 15px;font-weight: bold;">{{ key }}：</span>
                <div style="display: inline-flex;flex-wrap: wrap;column-gap: 16px !important;">
                    <t-checkbox v-for="(obj,ckey) in index" :key="ckey" :label="obj.object" :value="obj.val" :checked="AddUserDialogFrom.permissions.includes(obj.val)" @change="(e) => { SelectPermissions(obj.val,e) }"/>
                </div>
            </div>
        </div>
        <t-space style="margin-top: 16px;">
            <span>快捷设置：</span>
            <t-button variant="outline" theme="primary" @click="AddUserDialogFrom.permissions = ['network.connect', 'account.manage.get', 'equipment.get', 'equipment.record.getlist', 'equipment.record.get', 'equipment.return', 'equipment.lend']">默认用户</t-button>
            <t-button variant="dashed" theme="primary" @click="AddUserDialogFrom.permissions = [ 'network.connect', 'account.manage.get', 'equipment.get', 'equipment.record.getlist', 'equipment.record.get', 'equipment.return', 'equipment.lend', 'equipment.check.start', 'equipment.check.status', 'account.manage.getlist', 'equipment.manage.getlist', 'log.manage.user', 'log.manage.request', 'log.manage.system', 'log.manage.getdate', 'account.online.getlist', 'account.kickout', 'account.random' ]">老师账号</t-button>
            <t-button variant="dashed" theme="warning" @click="AddUserDialogFrom.permissions = [ 'equipment.get', 'equipment.record.getlist', 'wxgl.wxgl' ]">晚修管理组</t-button>
            <t-button theme="success" variant="dashed" @click="AddUserDialogFrom.permissions = [ 'equipment.get', 'equipment.record.getlist', 'wxgl.wxgl', 'network.connect', 'permissions.manage', 'log.manage.user', 'account.manage.get', 'log.manage.request', 'account.manage.add', 'equipment.manage.add', 'equipment.check.start', 'equipment.lend.helpothers', 'account.kickout', 'account.online.getlist', 'equipment.lend', 'equipment.check.status', 'equipment.record.get', 'equipment.manage.edit', 'account.manage.edit', 'log.manage.system', 'account.manage.del', 'equipment.manage.del', 'equipment.record.edit', 'equipment.return.helpothers', 'equipment.return', 'account.random', 'equipment.record.del', 'log.manage.getdate', 'account.manage.getlist', 'equipment.manage.getlist' ]">管理员</t-button>
        </t-space>
    </t-dialog>
</template>

<script setup lang="jsx">
import { ref } from "vue";
import dayjs from 'dayjs';
</script>

<script lang="jsx">
import { NotifyPlugin } from "tdesign-vue-next";
import { config } from "../../components/config";
import { HTTPRequest } from "../../components/function/hooks";
import sha256 from 'crypto-js/sha256'
// import * as XLSX from "xlsx";

export default {
    name: "userManage",
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
                    colKey: "code",
                    title: "Code",
                    sortType: "all",
                    sorter: true,
                    width: "200",
                },
                {
                    colKey: "name",
                    title: "姓名",
                },
                { colKey: "class", title: "班级", sortType: "all", sorter: true },
                {
                    colKey: "grade", title: "年级", sortType: "all", sorter: true, width: 120,
                    cell: (h, { row }) => {
                        return <t-tag>{row.grade + "级"}</t-tag>
                    }
                },
                {
                    colKey: "group", title: "组别", sortType: "all", sorter: true, width: 110,
                    cell: (h, { row }) => {
                        return (
                            row.group == 1 ? "照片组" : row.group == 2 ? "视频组" : row.group == 3 ? "海报组" : row.group == 4 ? "特效组" : row.group == 5 ? "技术组" : row.group == 6 ? "晚修管理" : "未分组"
                        )
                    }
                },
                {
                    colKey: "reg_time", title: "注册日期", sortType: "all", sorter: true, ellipsis: true,
                    cell: (h, { row }) => {
                        return dayjs(row.reg_time).format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                {
                    colKey: "join_time", title: "加入时间", sortType: "all", sorter: true, ellipsis: true,
                    cell: (h, { row }) => {
                        return dayjs(row.join_time).format('YYYY-MM-DD')
                    }
                },
                {
                    colKey: "login_time", title: "上次登录时间", sortType: "all", sorter: true, ellipsis: true,
                    cell: (h, { row }) => {
                        return row.login_time ? dayjs(row.login_time).format('YYYY-MM-DD HH:mm:ss') : '-'
                    }
                },
                // {
                //     colKey: "status",
                //     title: "账号状态",
                //     sortType: "all",
                //     sorter: true,
                // },
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
                AddUser: false,
                Permissions: false,
                EditUser: false,
            },
            AddUserDialogFrom: {
                name: "",
                code: "",
                class: "",
                password: "",
                permissions: [],
                group: "",
                grade: 2023,
                share_device: 2,
                reg_time: new Date(),
                join_time: new Date(),
            },
            EditUserDialogFrom: {
                id: null,
                name: null,
                code: null,
                class: null,
                password: null,
                share_device: null,
                group: null,
                grade: null,
                reg_time: null,
                join_time: null,
            },
            PermissionsOption: [],
            upload_file_data: [],
            groupOptions: [],// 组列表
            PermissionsList: {},// 权限列表
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
        this.InitGroupData()
        this.InitTableData()
        this.InitPermissionsListData()
    },
    methods: {
        ParsingFile(e){
            var that = this
            return new Promise(function (resolve, reject) {
                that.ParsingFile_son(e).then((res) => {
                    resolve(res)
                }).catch((res) => {
                    reject(res)
                })
            })
        },


        ParsingFile_son(e){
            var that = this
            return new Promise(function (resolve, reject) {
                if (!/\.(xls|xlsx)$/.test(e.name.toLowerCase())) {
                    NotifyPlugin("error",{
                        title: "错误",
                        content: "上传格式不正确，请上传xls或者xlsx格式",
                    });
                    reject({ status: 'fail', error: '上传失败，文件格式不正确', response:{ files: [{ name: e.name }] } });
                }
                try{
                    // 读取文件
                    var reader = new FileReader();
                    reader.onload = function () {
                        var fileData = reader.result;
                        var wb = XLSX.read(fileData, { type: 'binary', cellDates: true });
                        //{header:1}取消标题列.
                        var rowObj = XLSX.utils.sheet_to_json(wb.Sheets['Sheet1'], { header: 1 });
                        if (rowObj.length <= 0) {
                            NotifyPlugin("error",{
                                title: "错误",
                                content: "空文件！",
                            });
                            reject({ status: 'fail', error: '解析失败，空文件！', response:{ files: [{ name: e.name }] } });
                        }
                        rowObj.forEach((item,index) => {
                            if (index != 0) {
                                that.upload_file_data.push({
                                    code: item[0],
                                    name: item[1],
                                    class: item[2],
                                    grade: item[3],
                                    group: item[4],
                                    password: item[5],
                                    permissions: item[6] == 0 ? 26738688 : item[6],
                                    reg_time: item[7],
                                    join_time: item[8],
                                });
                            }
                        });
                    };
                    //已二进制的形式读取文件
                    reader.readAsBinaryString(e.raw);
                    resolve({ status: 'success', response:{ files: [{ name: e.name }] }})
                }
                catch(error){
                    reject({ status: 'fail', error: `解析文件失败，${error}`, response:{ files: [{ name: e.name }] } });
                }
            })
        },

        /**
         * @InitGroupData
         * @初始化用户组数据
         */
        InitGroupData(){
            var that = this;
            var TOKEN = localStorage.getItem("token");
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/group/list",
                    methods: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        if (RES.errcode == 0){
                            for (const key in RES.data) {
                                if (Object.hasOwnProperty.call(RES.data, key)) {
                                    const element = RES.data[key];
                                    that.$data.groupOptions.push({ label: element.name, value: element.id, type: element.type })
                                }
                            }
                        }
                    },
                    error: function (err) {
                        console.error(err);
                        NotifyPlugin("error", {
                            title: "获取组列表失败",
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
         * @InitPermissionsListData
         * @初始化权限列表数据
         */
         InitPermissionsListData(){
            var that = this;
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/permissions/systemlist",
                    methods: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        if (RES.errcode == 0){
                            for (const index in RES.data) {
                                if (Object.hasOwnProperty.call(RES.data, index)) {
                                    const element = RES.data[index];
                                    if (!element.remark) {
                                        that.$data.PermissionsList["未定义"] ? '' : that.$data.PermissionsList["未定义"] = []
                                        that.$data.PermissionsList["未定义"].push(element)
                                    }
                                    else{
                                        that.$data.PermissionsList[element.remark] ? '' : that.$data.PermissionsList[element.remark] = []
                                        that.$data.PermissionsList[element.remark].push(element)
                                    }
                                }
                            }
                        }
                    },
                    error: function (err) {
                        console.error(err);
                        NotifyPlugin("error", {
                            title: "获取权限列表失败",
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
         * @InitTableData
         * @初始化表格数据
         */
        InitTableData() {
            this.$data.table_Loading = true;
            var that = this;
            var TOKEN = localStorage.getItem("token");
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/user/list",
                    methods: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        console.log(RES.data)
                        that.$data.table_Data = RES.data;
                        that.$data.table_BackData = RES.data;
                        that.$data.table_Loading = false;
                    },
                    error: function (err) {
                        that.$data.table_Loading = false;
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
         * @提交添加账号验证表单
         */
        VerifyAddForm() {
            var FORMDATA = this.$data.AddUserDialogFrom;
            if (!FORMDATA.name || !FORMDATA.code || !FORMDATA.password || FORMDATA.permissions_sum == 0) {
                NotifyPlugin("error", {
                    title: "添加用户失败",
                    content: "请填写必填信息",
                    duration: 5000,
                });
                return false;
            }
            // PASS
            var that = this;
            var TOKEN = localStorage.getItem("token");
            HTTPRequest({
                url: config.API_URL.MAIN_URL + "/user/add",
                methods: "POST",
                data: {
                    name: FORMDATA.name,
                    code: FORMDATA.code,
                    class: FORMDATA.class,
                    password: sha256(FORMDATA.password),
                    permissions: FORMDATA.permissions_sum,
                    group: FORMDATA.group,
                    grade: FORMDATA.grade,
                    reg_time: new Date(FORMDATA.reg_time).getTime().toString(),
                    join_time: new Date(FORMDATA.join_time).getTime().toString(),
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    token: TOKEN,
                },
                success: function (res) {
                    var RES = JSON.parse(res);
                    if (RES.errcode === 0) {
                        var U_id = RES.data.id;
                        NotifyPlugin("success", {
                            title: "添加账号成功",
                            content: `成功添加了id为${U_id}的用户`,
                            duration: 5000,
                        });
                        console.log(`添加了id为${U_id}的用户`);
                        // 刷新数据
                        that.InitTableData();
                    }
                },
                error: function (err) {
                    NotifyPlugin("error", {
                        title: "添加账号失败",
                        content: err,
                        duration: 5000,
                    });
                    console.error(err);
                },
            });
            // 关闭dialog
            this.$data.Dialog_Model.AddUser = false;
            // 还原表单
            FORMDATA = {
                name: "",
                code: "",
                class: "",
                password: "",
                permissions: [16777216, 8388608, 1048576, 524288],
                permissions_sum: 0,
                group: 0,
                grade: 2023,
                reg_time: new Date(),
                join_time: new Date(),
            };
        },

        SelectPermissions(item,select) {
            var that = this;
            if (select) {
                that.$data.AddUserDialogFrom.permissions.push(item)
            }
            else{
                let index = that.$data.AddUserDialogFrom.permissions.indexOf(item);
                if (index !== -1) {
                    that.$data.AddUserDialogFrom.permissions.splice(index, 1);
                }
            }
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
                        url: config.API_URL.MAIN_URL + "/user/del",
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
                                var U_id = RES.data.id;
                                console.log(`删除了id为${U_id}的用户`);
                            }
                            NotifyPlugin("success", {
                                title: "删除账号成功",
                                content: `成功删除了id为${U_id}的用户`,
                                duration: 5000,
                            });
                            // 刷新数据
                            this.InitTableData();
                        },
                        error: function (err) {
                            NotifyPlugin("error", {
                                title: "删除账号失败",
                                content: err,
                                duration: 5000,
                            });
                            console.error(err);
                        },
                    });
                    if (index == list.length - 1) {
                        // 清空选择
                        this.$data.SelectData = [];
                        this.InitTableData();
                    }
                }
            }
        },

        /**
         * @EditForm
         * @编辑账号
         */
        EditForm() {
            this.SUM_Permissions()
            var that = this;
            var FORMDATA = this.$data.EditUserDialogFrom;
            var TOKEN = localStorage.getItem("token");
            HTTPRequest({
                url: config.API_URL.MAIN_URL + "/user/edit",
                methods: "POST",
                data: {
                    id: FORMDATA.id,
                    name: FORMDATA.name,
                    code: FORMDATA.code,
                    class: FORMDATA.class,
                    password: FORMDATA.password ? sha256(FORMDATA.password) : null,
                    share_device: FORMDATA.share_device,
                    permissions: that.$data.AddUserDialogFrom.permissions,
                    group: FORMDATA.group,
                    grade: FORMDATA.grade,
                    reg_time: new Date(FORMDATA.reg_time).getTime(),
                    join_time: new Date(FORMDATA.join_time).getTime(),
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
                            title: "编辑账号信息成功",
                            content: `成功编辑了id为${E_id}的账号信息`,
                            duration: 5000,
                        });
                        console.log(`编辑了id为${E_id}的账号信息`);
                        // 刷新数据
                        that.InitTableData();
                    }
                },
                error: function (err) {
                    NotifyPlugin("error", {
                        title: "编辑账号信息失败",
                        content: err,
                        duration: 5000,
                    });
                    console.error(err);
                },
            });
            // 关闭dialog
            this.$data.Dialog_Model.EditUser = false;
            this.$data.SelectData = []
            // 还原表单
            FORMDATA = {
                id: null,
                name: null,
                code: null,
                class: null,
                password: null,
                share_device: null,
                group: null,
                grade: null,
                reg_time: null,
                join_time: null,
            };
        },

        initEditPermissions() {
            this.$data.AddUserDialogFrom.permissions = []
            var data = this.$data.EditUserDialogFrom.permissions_init
            var DATA = this.$data.AddUserDialogFrom.permissions
            var permissions = this.PermissionsOption
            for (const index in permissions) {
                if (Object.hasOwnProperty.call(permissions, index)) {
                    const element = permissions[index].value;
                    if ((data & element) == element) {
                        DATA.push(element)
                    }
                }
            }
        },


        sum(arr) {
            var len = arr.length;
            if (len == 0) {
                return 0;
            } else if (len == 1) {
                return arr[0];
            } else {
                return arr[0] | this.sum(arr.slice(1));
            }
        },

        SUM_Permissions() {
            var a = this.$data.AddUserDialogFrom.permissions
            this.$data.AddUserDialogFrom.permissions_sum = this.sum(a)
            console.log(this.sum(a))
            this.$data.Dialog_Model.Permissions = false
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

div[unrequired]::before {
    content: " ";
    width: 12.36px;
}

div[unrequired] {
    display: flex;
    align-items: center;
}
</style>async async 