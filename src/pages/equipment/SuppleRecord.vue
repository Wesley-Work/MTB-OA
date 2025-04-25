<template>
  <div class="SuppleRecord--Container">
    <div class="back">
      <t-button theme="primary" variant="outline" ghost @click="props.handleChangeComponent('Lend', true)">
        <template #icon>
          <t-icon name="arrow-left" />
        </template>
        返回上级
      </t-button>
    </div>
    <div class="SuppleRecord--View">
      <div class="form-content">
        <t-form ref="formRef" :rules="formRules" :data="formData" :colon="true" style="width: 45%" @submit="onSubmit">
          <t-form-item label="设备Code" name="equipment_code">
            <t-input v-model="formData.equipment_code" @input="fetchEquipmentInfo" />
          </t-form-item>
          <t-form-item label="借出时间" name="lend_date">
            <t-date-picker
              v-model="formData.lend_date"
              enable-time-picker
              format="YYYY-MM-DD HH:ss"
              :disable-date="{ after: dayjs().subtract(0, 'day').format() }"
              @change="onLendDateChange"
            />
          </t-form-item>
          <t-form-item label="借出人" name="isMeLend">
            <t-radio-group v-model="formData.isMeLend">
              <t-radio-button :value="true">是我借的</t-radio-button>
              <t-radio-button :value="false">不是我借的</t-radio-button>
            </t-radio-group>
          </t-form-item>
          <t-form-item v-if="!formData.isMeLend" label="借出人Code" name="lend_usercode">
            <t-input v-model="formData.lend_usercode" />
          </t-form-item>
          <t-form-item label="归还时间" name="return_date">
            <t-date-picker
              v-model="formData.return_date"
              enable-time-picker
              format="YYYY-MM-DD HH:ss"
              :disabled="formData.lend_date === ''"
              :placeholder="formData.lend_date === '' ? '请先选择借出日期' : '请选择日期'"
              :disable-date="{ before: dayjs(formData.lend_date).subtract(0, 'day').format() }"
            />
          </t-form-item>
          <t-form-item label="归还人" name="isMeLend">
            <t-radio-group v-model="formData.isMeReturn">
              <t-radio-button :value="true">是我还的</t-radio-button>
              <t-radio-button :value="false">不是我还的</t-radio-button>
            </t-radio-group>
          </t-form-item>
          <t-form-item v-if="!formData.isMeReturn" label="归还人Code" name="lend_usercode">
            <t-input v-model="formData.return_usercode" />
          </t-form-item>
        </t-form>
        <!---->
        <div class="equipment-info">
          <t-descriptions bordered :column="3" size="small">
            <t-descriptions-item label="设备id">{{ equipmentInfo?.id ?? '-' }}</t-descriptions-item>
            <t-descriptions-item label="设备名称">{{ equipmentInfo?.name ?? '-' }}</t-descriptions-item>
            <t-descriptions-item label="设备Code">{{ equipmentInfo?.code ?? '-' }}</t-descriptions-item>
            <t-descriptions-item label="设备归属">{{ equipmentInfo?.belong ?? '-' }}</t-descriptions-item>
            <t-descriptions-item label="设备型号">{{ equipmentInfo?.model ?? '-' }}</t-descriptions-item>
            <t-descriptions-item label="设备sn">{{ equipmentInfo?.sn ?? '-' }}</t-descriptions-item>
            <t-descriptions-item label="设备状态">{{ equipmentInfo?.status ?? '-' }}</t-descriptions-item>
          </t-descriptions>
        </div>
      </div>
      <div class="operation">
        <div style="width: 560px; gap: 8px; display: flex; flex-direction: column">
          <t-button theme="default" size="large" variant="outline" @click="resetForm">重置表单</t-button>
          <t-button theme="primary" size="large" @click="submitForm">添加记录</t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import useRequest from '@hooks/useRequest';
import { NotifyPlugin } from 'tdesign-vue-next';
import { ref } from 'vue';
import dayjs from 'dayjs';
import type { EquipmentInfo } from '@type/type';

const props = defineProps({
  handleChangeComponent: {
    type: Function,
    default: null,
  },
});
const tips = '该项必填';
const formRef = ref(null);
const formRules = {
  equipment_code: [{ required: true, message: tips }],
  lend_date: [{ required: true, message: tips }],
  isMeLend: [{ required: true, message: tips }],
  lend_usercode: [{ required: true, message: tips }],
  return_date: [{ required: true, message: tips }],
  isMeReturn: [{ required: true, message: tips }],
  return_usercode: [{ required: true, message: tips }],
};
const formData = ref({
  equipment_code: '',
  lend_date: '',
  isMeLend: true,
  lend_usercode: '',
  return_date: '',
  isMeReturn: true,
  return_usercode: '',
});
const equipmentInfo = ref<EquipmentInfo>(null);

const onLendDateChange = (e) => {
  // 若归还日期已选择，且大于借出日期，则自动更新归还日期
  const needForceChange = formData.value.return_date && dayjs(e).isAfter(dayjs(formData.value.return_date), 'day');
  if (needForceChange) {
    NotifyPlugin.info({
      title: '强制更新',
      content: '因归还日期小于借出日期，已自动更新归还日期',
    });
    formData.value.return_date = e;
  }
};

const resetForm = () => {
  // formRef.value?.reset()
  formData.value = {
    equipment_code: '',
    lend_date: '',
    isMeLend: true,
    lend_usercode: '',
    return_date: '',
    isMeReturn: true,
    return_usercode: '',
  };
};

const onSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    handleApplyRecord();
  }
};

const submitForm = () => {
  formRef.value.submit();
};

const fetchEquipmentInfo = () => {
  useRequest({
    url: '/equipment/info',
    methods: 'POST',
    data: {
      code: formData.value.equipment_code,
    },
    success: function (res) {
      equipmentInfo.value = JSON.parse(res)?.data;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '设备信息获取失败',
        content: '请检查设备Code是否正确',
      });
    },
  });
};

const handleApplyRecord = () => {
  useRequest({
    url: '/record/add',
    methods: 'POST',
    data: {
      ...formData.value,
    },
    success: function (res) {
      const RES = JSON.parse(res);
      if (RES.errcode == 0) {
        NotifyPlugin.success({
          title: '新增记录成功',
          content: '记录ID：' + RES?.data?.id,
        });
        resetForm();
      } else {
        NotifyPlugin.error({
          title: '新增记录失败',
          content: '错误：' + RES.errmsg,
        });
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '新增记录失败',
        content: '错误：' + err,
      });
    },
  });
};
</script>

<script lang="tsx"></script>

<style scoped lang="scss">
.SuppleRecord--Container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .SuppleRecord--View {
    background-color: var(--td-bg-color-container);
    padding: 24px;
    border-radius: 5px;
    .form-content {
      display: flex;
      flex-direction: row;
      gap: 24px;
      margin-bottom: 36px;
    }
    .equipment-info {
      width: 55%;
    }
    .operation {
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
