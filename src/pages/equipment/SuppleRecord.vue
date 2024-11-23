<template>
    <div class="SuppleRecord--Container">
        <div class="back">
            <t-button theme="primary" variant="outline" ghost @click="handleChangeComponent('Lend',true)">
                <template #icon>
                    <t-icon name="arrow-left"/>
                </template>
                返回上级
            </t-button>
        </div>
        <div class="SuppleRecord--View">
            <div class="form-content">
                <t-form ref="formRef" :rules="formRules" :data="formData" :colon="true" style="width: 45%;" @submit="onSubmit">
                    <t-form-item label="设备Code" name="equipment_code">
                        <t-input v-model="formData.equipment_code" @input="fetchEquipmentInfo" />
                    </t-form-item>
                    <t-form-item label="借出时间" name="lend_date">
                        <t-date-picker v-model="formData.lend_date" enableTimePicker format="YYYY-MM-DD HH:ss" :disableDate="{after: dayjs().subtract(0, 'day').format()}" @change="onLendDateChange"/>
                    </t-form-item>
                    <t-form-item label="借出人" name="isMeLend">
                        <t-radio-group v-model="formData.isMeLend">
                          <t-radio-button :value="true">是我借的</t-radio-button>
                          <t-radio-button :value="false">不是我借的</t-radio-button>
                        </t-radio-group>
                    </t-form-item>
                    <t-form-item label="借出人Code" name="lend_usercode" v-if="!formData.isMeLend">
                        <t-input v-model="formData.lend_usercode"/>
                    </t-form-item>
                    <t-form-item label="归还时间" name="return_date">
                        <t-date-picker v-model="formData.return_date" enableTimePicker format="YYYY-MM-DD HH:ss" :disabled="formData.lend_date === ''" :placeholder="formData.lend_date === '' ? '请先选择借出日期' : '请选择日期'" :disableDate="{before: dayjs(formData.lend_date).subtract(0, 'day').format()}"/>
                    </t-form-item>
                    <t-form-item label="归还人" name="isMeLend">
                        <t-radio-group v-model="formData.isMeReturn">
                          <t-radio-button :value="true">是我还的</t-radio-button>
                          <t-radio-button :value="false">不是我还的</t-radio-button>
                        </t-radio-group>
                    </t-form-item>
                    <t-form-item label="归还人Code" name="lend_usercode" v-if="!formData.isMeReturn">
                        <t-input v-model="formData.return_usercode"/>
                    </t-form-item>
                </t-form>
                <!---->
                <div class="equipment-info">
                    <t-descriptions bordered :column="3" size="small">
                      <t-descriptions-item label="设备id">{{ equipmentInfo.id ?? "-" }}</t-descriptions-item>
                      <t-descriptions-item label="设备名称">{{ equipmentInfo.name ?? "-" }}</t-descriptions-item>
                      <t-descriptions-item label="设备Code">{{ equipmentInfo.code ?? "-" }}</t-descriptions-item>
                      <t-descriptions-item label="设备归属">{{ equipmentInfo.belong ?? "-" }}</t-descriptions-item>
                      <t-descriptions-item label="设备型号">{{ equipmentInfo.model ?? "-" }}</t-descriptions-item>
                      <t-descriptions-item label="设备sn">{{ equipmentInfo.sn ?? "-" }}</t-descriptions-item>
                      <t-descriptions-item label="设备状态">{{ equipmentInfo.status ?? "-" }}</t-descriptions-item>
                    </t-descriptions>
                </div>
            </div>
            <div class="operation">
                <div style="width: 560px; gap: 8px; display: flex; flex-direction: column;">
                    <t-button theme="default" @click="resetForm" size="large" variant="outline">重置表单</t-button>
                    <t-button theme="primary" @click="submitForm" size="large">添加记录</t-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="tsx">
import useRequest from '../../hooks/useRequest';
import { MessagePlugin, NotifyPlugin } from 'tdesign-vue-next';
import { reactive, ref } from 'vue';
import dayjs from "dayjs";
import { getToken } from '../../hooks/common';
import { format } from 'echarts/types/src/util/time.js';


const props = defineProps({
    handleChangeComponent: {
        type: Function,
        default: null
    }
})
const tips = "该项必填"
const formRef = ref(null)
const formRules = {
    equipment_code: [{ required: true, message: tips }],
    lend_date: [{ required: true, message: tips }],
    isMeLend: [{ required: true, message: tips }],
    lend_usercode: [{ required: true, message: tips }],
    return_date: [{ required: true, message: tips }],
    isMeReturn: [{ required: true, message: tips }],
    return_usercode: [{ required: true, message: tips }]
};
const formData = ref({
    equipment_code: "",
    lend_date: "",
    isMeLend: true,
    lend_usercode: "",
    return_date: "",
    isMeReturn: true,
    return_usercode: ""
})
const equipmentInfo = ref({})

const onLendDateChange = (e) => {
    // 若归还日期已选择，且大于借出日期，则自动更新归还日期
    const needForceChange = formData.value.return_date && dayjs(e).isAfter(dayjs(formData.value.return_date),"day")
    if (needForceChange) {
        NotifyPlugin.info({
            title: "强制更新",
            content: "因归还日期小于借出日期，已自动更新归还日期"
        })
        formData.value.return_date = e
    }
}

const resetForm = () => {
    // formRef.value?.reset()
    formData.value = {
        equipment_code: "",
        lend_date: "",
        isMeLend: true,
        lend_usercode: "",
        return_date: "",
        isMeReturn: true,
        return_usercode: ""
    }
}

const onSubmit = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    handleApplyRecord();
  }
};

const submitForm = () => {
    formRef.value.submit()
}

const fetchEquipmentInfo = () => {
    const TOKEN = getToken();
    useRequest({
        url: "/equipment/info",
        methods: "POST",
        header: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            token: TOKEN,
        },
        data:{
            code: formData.value.equipment_code,
        },
        success: function (res) {
            equipmentInfo.value = JSON.parse(res)?.data
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "设备信息获取失败",
                content: "请检查设备编号是否正确"
            })
        }
    })
}

const handleApplyRecord = () => {
    const TOKEN = getToken();
    useRequest({
        url: "/record/add",
        methods: "POST",
        header: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            token: TOKEN,
        },
        data:{
            ...formData.value
        },
        success: function (res) {
            console.log(res)
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "新增记录失败",
                content: "错误：" + err,
            })
        }
    })
}

</script>

<script lang="tsx"></script>

<style scoped lang="scss">

.SuppleRecord--Container{
    display: flex;
    flex-direction: column;
    gap: 16px;
    .SuppleRecord--View{
        background-color: var(--td-bg-color-container);
        padding: 24px;
        border-radius: 5px;
        .form-content{
            display: flex;
            flex-direction: row;
            gap: 24px;
        }
        .equipment-info{
            width: 55%;
        }
        .operation{
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 890px;
            text-align: center;
            margin: 0px auto;
        }
    }
}

</style>