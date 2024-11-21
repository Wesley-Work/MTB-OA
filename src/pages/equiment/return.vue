<template>
    <div
        class="MainBox"
        id="ReturnComponent"
        style="background: var(--td-bg-color-container); padding: 32px; border-radius: 5px"
        ref="MainBox">
        <div class="MainBox-Operate">
            <div id="returnpage">
                <div style="display: flex; flex-direction: row; justify-content: space-between">
                    <!--info-->
                    <div style="min-width: 35%">
                        <div>
                            <t-button style="width: 100%; height: 56px; font: var(--td-font-title-large); margin-bottom: 16px" @click.end="ChangePageUrl('lend',true)">去借出设备</t-button>
                        </div>
                        <div>
                            <t-card
                                title="设备信息"
                                style="margin: 0px 0px 13px">
                                <span>{{ EquipmentInfo }}</span>
                            </t-card>
                        </div>
                        <div
                            v-if="false"
                            style="display: flex; align-items: center; margin: 5px 0px 12px"
                            class="helpotheruserReturn_big">
                            <t-checkbox
                                class="helpotheruserReturn_box"
                                v-model="formData.help"
                                >帮还</t-checkbox
                            >
                            <div style="display: flex">
                                <t-input
                                    :disabled="!formData.help"
                                    class="helpotheruserReturn_input"
                                    placeholder="借出者Code"
                                    size="small"
                                    v-model="formData.helpWho"
                                    style="margin: 0px 10px 0px 12px" />
                            </div>
                            <t-tag
                                theme="warning"
                                variant="light-outline">
                                <template #icon>
                                    <t-icon name="error-circle" />
                                </template>
                                只有管理员才可以帮借/转借!
                            </t-tag>
                        </div>
                        <!---->
                        <div style="margin-top: 13px">
                            <div style="display: flex; align-items: center">
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
                                    class="returninput"
                                    ref="returninput"
                                    placeholder="请扫描或输入"
                                    v-model="formData.eqcode"
                                    :onEnter="Return"
                                    :autofocus="true"
                                    @Input="RequestEqInfo(formData.eqcode)"></t-input>
                                <t-button
                                    class="returnbutton"
                                    style="margin-left: -10px; z-index: 2"
                                    @click.end="Return"
                                    >归还</t-button
                                >
                            </div>
                        </div>
                    </div>
                    <!--list-->
                    <div style="max-width: 60%" return-list-table>
                        <t-card
                            id="weTag">
                            <template #title>
                                <span>本次归还设备列表（共<scrollNumber :val="TableData.length"></scrollNumber>个设备）</span>
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

<script lang="jsx">
import { config } from "../../components/config";
import { HTTPRequest } from "../../components/function/hooks";
import scrollNumber from "../../components/function/scrollnumber.vue";
import { NotifyPlugin } from "tdesign-vue-next";
import { CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue-next';

export default {
    name: "EquiMentReturn",
    components: {
        scrollNumber,
    },
    props: {
        ChangePageUrl: {
        type: Function,
        default: null
      }
    },
    data() {
        return {
            formData: {
                usercode: "",
                eqcode: "",
                help: false,
                helpWho: "",
            },
            EquipmentInfo: "暂无数据",
            TableData: [],
            TableColumns: [
                { colKey: "eqname", title: "设备名称" },
                { colKey: "eqcode", title: "设备Code", width: "200" },
                {
                    colKey: "status",
                    title: "归还状态",
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
                { colKey: "user", title: "借出人", width: "140", align: "center" },
                { colKey: "dothisthinguser", title: "操作人", width: "140", align: "center" },
                { colKey: "returntime", title: "归还时间", ellipsis: true, width: "200" },
                { colKey: "more", title: "备注" },
            ],
        };
    },

    mounted() {
        // this.initStyle();
        var USER_INFO_STR = localStorage.getItem("user_info")
        try{
            let a = JSON.parse(USER_INFO_STR)
            if (a) {
                this.$data.formData.usercode = a.code
            }
        }
        catch(e){
            NotifyPlugin("error",{
                title: '出现错误',
                content: '无法解析用户信息，请尝试重新登录！'
            })
        }
    },

    methods: {
        initStyle() {
            setTimeout(() => {
                var a = document.getElementById("weTag");
                var b = a.getElementsByClassName("t-card__body")[0];
                b.style.overflow = "hidden";
                var c = b.getElementsByTagName("div")[0].clientHeight;
                b.style.maxHeight = c + "px";
            }, 10);
        },


                /**
         * @RequestEqInfo
         * @获取设备信息
         */
         RequestEqInfo(eq_code){
            if (eq_code == '') return;
            var that = this;
            var TOKEN = localStorage.getItem("token");
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/equipment/info",
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
                            that.$data.EquipmentInfo = `id：${data.id}，设备名称：${data.name}，设备code：${data.code}，设备归属：${data.ascription ? data.ascription : "-"}，设备型号：${data.model ? data.model : "-"}，设备sn：${data.sn ? data.sn : "-"}，设备状态：${data.status ? data.status : "-"}`
                        }
                        else{
                            that.$data.EquipmentInfo = "暂无数据"
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
        },



        /**
         * @Return
         * @归还设备
         */
         Return(){
            var td = this.$data
            var that = this;
            var LEND_USERCODE = td.formData.help ? td.formData.helpWho : this.$data.formData.usercode
            var LEND_EQUIPMENTCODE = td.formData.eqcode
            that.$data.formData.eqcode = ""
            if ((LEND_EQUIPMENTCODE == "") || (td.formData.help && td.formData.helpWho == "")) { NotifyPlugin("warning",{title: "温馨提示",content: "请输入设备/用户信息再进行归还！"}); return; }
            this.$data.Requesting = true
            var TOKEN = localStorage.getItem("token");
            try {
                HTTPRequest({
                    url: config.API_URL.MAIN_URL + "/equipment/return",
                    methods: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        token: TOKEN,
                    },
                    data:{
                        equipment_code: LEND_EQUIPMENTCODE,
                        user_code: LEND_USERCODE,
                    },
                    success: function (res) {
                        var RES = JSON.parse(res);
                        if (RES.errcode == 0) {
                            // pass
                            NotifyPlugin("success",{
                                title: "归还成功",
                                content: `设备：${RES.data.eq_name} 归还成功`
                            })
                        }
                        else if (RES.errcode == -40002) {
                            // NO Permissions
                            NotifyPlugin("error",{
                                title: "归还失败",
                                content: "您没有帮他人归还设备权限！"
                            })
                        }
                        else if (RES.errcode == -40003) {
                            // Cannot find user
                            NotifyPlugin("error",{
                                title: "归还失败",
                                content: "找不到借出用户！"
                            })
                        }
                        else if (RES.errcode == -40001) {
                            // Cannot find equipment
                            NotifyPlugin("error",{
                                title: "归还失败",
                                content: "找不到设备！"
                            })
                        }
                        else if (RES.errcode == -40004) {
                            // This Equipment Already Out
                            NotifyPlugin("error",{
                                title: "归还失败",
                                content: "设备已归还！"
                            })
                        }
                        else{
                            // Unknown
                            NotifyPlugin("error",{
                                title: "归还失败",
                                content: `未知错误，错误码${RES.errcode}，${RES.errmsg}`
                            })
                        }
                        that.$data.Requesting = false
                        if (RES.errcode == 0){
                            var a = {
                                eqname: RES.data.eq_name ? RES.data.eq_name : '未知设备',
                                eqcode: RES.data.eq_code ? RES.data.eq_code : LEND_EQUIPMENTCODE,
                                //
                                status: {
                                    text: RES.errcode == 0 ? "归还成功" : "归还失败",
                                    theme: RES.errcode == 0 ? "success" : "danger",
                                    icon: RES.errcode == 0 ? <CheckCircleFilledIcon /> : <CloseCircleFilledIcon />,
                                },
                                user: RES.data.return_user ? RES.data.return_user : "未知用户",
                                returntime: RES.data.return_date ? RES.data.return_date : that.getTime(),
                                dothisthinguser: RES.data.operator,
                                more: RES.data.remark ? RES.data.remark : RES.errcode == 0 ? "ok" : RES.errmsg,
                                SHA: RES.data.SHA,
                            }
                        }
                        else{
                            var a = {
                                eqname: RES.data.eq_name ? RES.data.eq_name : '未知设备',
                                eqcode: LEND_EQUIPMENTCODE,
                                //
                                status: {
                                    text: "归还失败",
                                    theme: "danger",
                                    icon: <CloseCircleFilledIcon />,
                                },
                                returntime: that.getTime(),
                                user: RES.data.return_user ? RES.data.return_user : "未知用户",
                                dothisthinguser: RES.data.operator ? RES.data.operator : "-",
                                more: RES.errmsg,
                            }
                        }
                        that.$data.TableData.push(a)
                        that.initStyle()
                    },
                    error: function (err) {
                        that.$data.Requesting = false
                        console.error(err);
                        NotifyPlugin("error", {
                            title: "归还设备失败！",
                            content: err,
                            duration: 5000,
                        });
                    },
                });
            } catch (e) {
                that.$data.Requesting = false
                console.log(e);
            }
        },



        getTime(){
            return [
                new Date().getFullYear(),
                (new Date().getMonth() + 1) <= 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1),
                (new Date().getDate()) <= 9 ? "0" + (new Date().getDate()) : (new Date().getDate()),
            ].join('-') + " " + new Date().toTimeString().substring(0, 8)
        },
    },
};
</script>

<style>
.MainBox {
    transition: height 0.28s var(--transition-default);
    user-select: none;
}
[return-list-table] .t-card--bordered{
    border: none !important;
}
.t-card__body {
    overflow-y: hidden;
    transition: max-height 0.28s var(--transition-default) !important;
}
.t-table__empty{
    min-height: 69px !important;
}
</style>
