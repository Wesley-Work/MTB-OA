<template>
    <div
        class="MainBox"
        id="LendComponent"
        style="background: var(--td-bg-color-container); padding: 32px; border-radius: 5px"
        ref="MainBox">
        <div class="MainBox-Operate">
            <div id="lendpage">
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                    <!--info-->
                    <div style="min-width: 35%">
                        <div>
                            <t-space style="width: 100%;">
                                <t-button style="width: 100%; height: 56px; font: var(--td-font-title-large); margin-bottom: 16px" @click.end="handleChangeComponent('Return',true)" variant="outline" theme="primary">去归还设备</t-button>
                                <t-button style="width: 100%; height: 56px; font: var(--td-font-title-large); margin-bottom: 16px" @click.end="handleChangeComponent('SuppleRecord',true)" theme="primary">补借出记录</t-button>
                            </t-space>
                        </div>
                        <div>
                            <t-card
                                title="设备信息"
                                style="margin: 0px 0px 13px">
                                <span>{{ EquipmentInfo }}</span>
                            </t-card>
                        </div>
                        <div
                            style="display: flex; align-items: center; margin: 5px 0px 12px;width: fit-content;"
                            class="helpotheruserlend_big guide_helplend">
                            <t-checkbox
                                class="helpotheruserlend_box"
                                v-model="formData.help"
                                @click.end="formData.guest = false"
                                >帮借/转借</t-checkbox
                            >
                            <div style="display: flex">
                                <t-input
                                    :disabled="!formData.help"
                                    class="helpotheruserlend_input"
                                    placeholder="使用者Code"
                                    size="small"
                                    v-model="formData.helpWho"
                                    style="margin: 0px 10px 0px 12px" />
                            </div>
                        </div>
                        <div
                            style="display: flex; align-items: center; margin: 5px 0px 12px;width: fit-content;"
                            class="helpotheruserlend_big guide_guestlend">
                            <t-checkbox
                                class="helpotheruserlend_box"
                                v-model="formData.guest"
                                @click.end="formData.help = false"
                                >访客借出</t-checkbox
                            >
                            <div style="display: flex">
                                <t-input
                                    :disabled="!formData.guest"
                                    class="helpotheruserlend_input"
                                    placeholder="借出人/使用人"
                                    size="small"
                                    v-model="formData.guestname"
                                    style="margin: 0px 10px 0px 12px" />
                            </div>
                            <t-tag theme="success" variant="light-outline">
                                <template #icon>
                                    <t-icon name="error-circle" />
                                </template>
                                注意：为访客借出设备，责任人为操作人！ 
                            </t-tag>
                        </div>
                        <!---->
                        <div style="margin-top: 13px">
                            <div style="display: flex; align-items: center;width: fit-content;" class="guide_lendinput">
                                <span class="bitian">*</span>
                                <span
                                    style="
                                        color: var(--td-text-color-primary);
                                        font: var(--td-font-body-medium);
                                    "
                                    >设备Code:
                                </span>
                                <t-input
                                    style="width: 181px; margin-left: 10px"
                                    class="lendinput"
                                    ref="lendinput"
                                    placeholder="请扫描或输入"
                                    v-model="formData.eqcode"
                                    :onEnter="Lend"
                                    :autofocus="true"
                                    @Input="RequestEqInfo(formData.eqcode)"></t-input>
                                <t-button
                                    class="lendbutton"
                                    style="margin-left: -10px; z-index: 2"
                                    @click.end="Lend"
                                    :loading="Requesting"
                                    >借出</t-button
                                >
                            </div>
                        </div>
                    </div>
                    <!--list-->
                    <div style="max-width: 60%" lend-list-table>
                        <t-card
                            id="weTag">
                            <template #title>
                                <span>本次借出设备列表（共<scrollNumber :val="TableData.length"></scrollNumber>个设备）</span>
                            </template>
                            <div style="display: flex; flex-direction: row; align-items: center">
                                <t-table
                                    :data="TableData"
                                    :columns="TableColumns"></t-table>
                            </div>
                        </t-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="tsx">
import { config } from "../../components/config";
import useRequest from "../../hooks/useRequest";
import scrollNumber from "../../components/function/scrollnumber.vue";
import { NotifyPlugin } from "tdesign-vue-next";
import { CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next';
import { ref, reactive } from "vue";
import { LendTableDataItem } from "../../types/type";
import { getToken } from "../../hooks/common";

const formData = reactive({
                    usercode: "",
                    eqcode: "",
                    help: false,
                    helpWho: "",
                    guest:false,
                    guestname:"",
                })
const EquipmentInfo = ref("暂无数据")
const Requesting = ref(false)
const TableData = ref([])
const TableColumns = [
                        { colKey: "lend_id", title: "借出编号", width: "60" },
                        { colKey: "eqname", title: "设备名称", minWidth: "80" },
                        { colKey: "eqcode", title: "设备Code", width: "160" },
                        {
                            colKey: "status",
                            title: "借出状态",
                            width: "110",
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
                        { colKey: "user", title: "借出人", align: "center", minWidth: "80" },
                        { colKey: "dothisthinguser", title: "操作人", align: "center", minWidth: "80" },
                        { colKey: "lendtime", title: "借出时间", ellipsis: true, width: "200" },
                        { colKey: "more", title: "备注", minWidth: "80" },
                    ]

const props = defineProps({
    handleChangeComponent: {
        type: Function,
        default: null
    }
})

/**
 * @loadTableViewHeight
 * @加载表格高度
 */
const loadTableViewHeight = () => {
    setTimeout(() => {
        var ElDom = document.getElementById("weTag")
        if (!ElDom) {
            console.error("未找到元素: weTag")
            NotifyPlugin.error({
                title: "TableHeightError",
                content: "加载高度失败：未找到元素"
            })
            return;
        }
        var TableBody = ElDom.getElementsByClassName("t-table__body")[0] as HTMLElement
        TableBody.style.overflow = "hidden"
        var innerHeight = TableBody.getElementsByTagName("div")[0].clientHeight
        TableBody.style.maxHeight = innerHeight + "px"
    });
}

/**
 * @RequestEqInfo
 * @获取设备信息
 */
const RequestEqInfo= (eq_code) => {
    if (eq_code == '') return;
    var TOKEN = getToken();
    try {
        useRequest({
            url: "/equipment/info",
            methods: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                token: TOKEN,
            },
            data:{
                code: eq_code
            },
            success: function (res) {
                var RES = JSON.parse(res);
                if (RES.errcode == 0){
                    var data = RES.data
                    EquipmentInfo.value = `id：${data.id}，设备名称：${data.name}，设备code：${data.code}，设备归属：${data.ascription ? data.ascription : "-"}，设备型号：${data.model ? data.model : "-"}，设备sn：${data.sn ? data.sn : "-"}，设备状态：${data.status ? data.status : "-"}`
                }
                else{
                    EquipmentInfo.value = "暂无数据"
                }
            },
            error: function (err) {
                console.error(err);
                NotifyPlugin("error", {
                    title: "获取设备信息失败",
                    content: err,
                    duration: 5000,
                });
            },
        });
    } catch (e) {
        console.log(e);
    }
}

/**
 * @Lend
 * @借出设备
 */
const Lend = () => {
    const lendUserCode = formData.help ? formData.helpWho : formData.usercode
    var LEND_EQUIPMENTCODE = formData.eqcode
    formData.eqcode = ""
    if ((LEND_EQUIPMENTCODE == "") || (formData.help && formData.helpWho == "")) {
        NotifyPlugin("warning",{title: "温馨提示",content: `请输入正确的信息再进行借出！`})
        return;
    }
    Requesting.value = true
    var TOKEN = getToken();
    try {
        useRequest({
            url: "/equipment/lend",
            methods: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                token: TOKEN,
            },
            data:{
                equipment_code: LEND_EQUIPMENTCODE,
                user_code: lendUserCode,
                guest: formData.guest ? formData.guestname : "",
            },
            success: function (res) {
                var RES = JSON.parse(res);
                var errmsg = RES.errmsg
                if (RES.errcode == 0) {
                    // pass
                    NotifyPlugin("success",{
                        title: "借出成功",
                        content: `设备：${RES.data.eq_name} 借出成功`
                    })
                }
                else if (RES.errcode == -30001) {
                    // NO Permissions
                    NotifyPlugin("error",{
                        title: "借出失败",
                        content: "您没有帮他人借出设备权限！"
                    })
                    errmsg = "您没有帮他人借出设备权限"
                }
                else if (RES.errcode == -30002) {
                    // Cannot find user
                    NotifyPlugin("error",{
                        title: "借出失败",
                        content: "找不到借出用户！"
                    })
                    errmsg = "找不到借出用户"
                }
                else if (RES.errcode == -30003) {
                    // Cannot find equipment
                    NotifyPlugin("error",{
                        title: "借出失败",
                        content: "找不到设备！"
                    })
                    errmsg = "找不到设备"
                }
                else if (RES.errcode == -30004) {
                    // This Equipment Already Out
                    NotifyPlugin("error",{
                        title: "借出失败",
                        content: "设备已借出！"
                    })
                    errmsg = "设备已借出"
                }
                else{
                    // Unknown
                    NotifyPlugin("error",{
                        title: "借出失败",
                        content: `未知错误，错误码${RES.errcode}，${RES.errmsg}`
                    })
                }
                Requesting.value = false
                const ecodeOK = RES.errcode === 0
                const newItem:LendTableDataItem = {
                    eqname: RES.data.eq_name ?? '未知设备',
                    eqcode: ecodeOK ? RES.data.eqcode ?? LEND_EQUIPMENTCODE : LEND_EQUIPMENTCODE,
                    status: {
                        text: ecodeOK ? "借出成功" : "借出失败",
                        theme: ecodeOK ? "success" : "danger",
                        icon: ecodeOK ? <CheckCircleFilledIcon /> : <CloseCircleFilledIcon />,
                    },
                    user: ecodeOK ? RES.data.lend_user ?? "未知用户" : "-",
                    lendtime: RES.data.lend_time ?? getTime(),
                    dothisthinguser: ecodeOK ? RES.data.operator : "-",
                    more: ecodeOK ? RES.data.remark ?? errmsg : errmsg,
                    SHA: RES.data.SHA ?? null,
                }
                TableData.value.push(newItem)
                loadTableViewHeight()
            },
            error: function (err) {
                Requesting.value = false
                console.error(err);
                NotifyPlugin("error", {
                    title: "借出设备失败！",
                    content: err,
                    duration: 5000,
                });
            },
        });
    } catch (e) {
        Requesting.value = false
        console.error(e);
    }
}

const getTime = () => {
    return [
        new Date().getFullYear(),
        (new Date().getMonth() + 1) <= 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1),
        (new Date().getDate()) <= 9 ? "0" + (new Date().getDate()) : (new Date().getDate()),
    ].join('-') + " " + new Date().toTimeString().substring(0, 8)
}

</script>

<script lang="tsx">

export default {
    name: "EquiMentLend",
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
[lend-list-table] .t-card--bordered{
    border: none !important;
}
.t-table__empty{
    min-height: 69px !important;
}
</style>
