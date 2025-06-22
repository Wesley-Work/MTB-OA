<template>
  <t-loading :loading="loading" text="加载中..." fullscreen />
  <t-alert theme="info" style="margin-bottom: 16px" close>
    <span style="display: flex; flex-direction: column">
      <span>设备盘点须知：</span>
      <span>1. 开启盘点后，未被盘点到的设备无法被借出！</span>
      <span>2. 只会盘点媒体部设备且设备状态正常（非借出、非丢失等）</span>
      <span>3. 终止盘点后，全部设备的状态将还原（可被借出），且会丢失当前盘点的进度！再次盘点需要从头开始！</span>
      <span>后期将新增「将未盘点设备设置为丢失」等功能，若此类功能至当前仍未发布，有劳人工修改设备数据！</span>
    </span>
  </t-alert>
  <div
    id="LendComponent"
    ref="MainBox"
    class="MainBox"
    style="background: var(--td-bg-color-container); padding: 32px; border-radius: 5px"
  >
    <div class="MainBox-Operate">
      <div id="lendpage">
        <div style="display: flex; flex-direction: row; justify-content: space-between">
          <!--info-->
          <div style="min-width: 44%">
            <div>
              <t-button style="width: 100%; height: 56px; font: var(--td-font-title-large)" @click="toggle">
                {{ formData.started ? '终止盘点' : '开始盘点' }}
              </t-button>
            </div>
            <!---->
            <div style="margin-top: 13px">
              <div style="display: flex; align-items: center">
                <span class="bitian">*</span>
                <span style="color: var(--td-text-color-primary); font: var(--td-font-body-medium)">设备Code: </span>
                <t-input
                  v-model="formData.eqcode"
                  style="width: 181px; margin-left: 10px"
                  placeholder="请扫描或输入"
                  :on-enter="checkEq"
                  :autofocus="true"
                  :disabled="!formData.started"
                ></t-input>
                <t-button
                  class="lendbutton"
                  style="margin-left: -10px; z-index: 2"
                  :disabled="!formData.started"
                  @click.end="checkEq"
                >
                  CHECK
                </t-button>
              </div>
            </div>
          </div>
          <!--list-->
          <div style="max-width: 54%">
            <t-card id="weTag">
              <template #title>
                <span>
                  {{ formData.iid ? `本次盘点编号: #${formData.iid}，` : null }}
                  盘点剩余设备列表
                  {{ formData.iid ? ` | 剩余${total}个` : null }}
                </span>
              </template>
              <div style="display: flex; flex-direction: row; align-items: center">
                <t-table :data="TableData" :columns="TableColumns" row-key="id"></t-table>
              </div>
            </t-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { DialogPlugin, NotifyPlugin } from 'tdesign-vue-next';
import useRequest from '../../hooks/useRequest';

const formData = reactive({ eqcode: '', started: false, iid: null });
const loading = ref(false);
const total = ref(0);
const TableData = ref([]);
const TableColumns = ref([
  { colKey: 'id', title: '设备id', width: '40' },
  { colKey: 'name', title: '设备名称', width: '200' },
  { colKey: 'code', title: '设备Code', width: '150' },
]);
const timeInterval = ref();

const toggle = () => {
  if (formData.started) {
    stop();
  } else {
    start();
  }
};

const cleanInput = () => {
  formData.eqcode = '';
};

const stop = () => {
  const confirm = () => {
    useRequest({
      url: '/eqCheck/stop',
      methods: 'POST',
      data: {
        iid: formData.iid,
      },
      success: (res) => {
        const result = JSON.parse(res);
        if (result.errcode !== 0) {
          NotifyPlugin.error({
            title: '取消盘点失败！',
            content: '错误：' + result.errmsg,
          });
          return;
        }
        tableData.value = [];
        formData.started = false;
        formData.iid = null;
        formData.total = 0;
      },
      error: (err) => NotifyPlugin.error({ title: '取消盘点失败！', content: err, duration: 5000 }),
    });
  };
  const dialog = DialogPlugin.confirm({
    header: '确定要取消盘点吗？',
    body: '取消后，本次盘点将结束，全部设备将恢复原有状态！',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: () => {
      dialog.destroy();
      confirm();
    },
    onClose: () => {
      dialog.destroy();
    },
  });
};

const start = () => {
  loading.value = true;
  useRequest({
    url: '/eqCheck/start',
    methods: 'POST',
    success: (res) => {
      const result = JSON.parse(res);
      if (result.errcode !== 0) {
        NotifyPlugin.error({
          title: '开始盘点失败！',
          content: '错误：' + result.errmsg,
        });
        return;
      }
      formData.started = true;
      formData.iid = result.data.iid;
      TableData.value = result.data.equipmentList;
      total.value = result.data.total;

      clearInterval(timeInterval.value);
      timeInterval.value = setInterval(() => {
        refreshList();
      }, 3000);
    },
    error: (err) => NotifyPlugin.error({ title: '开始盘点失败！', content: err, duration: 5000 }),
    complete: () => {
      cleanInput();
      loading.value = false;
    },
  });
};

const checkStatus = () => {
  useRequest({
    url: '/eqCheck/status',
    methods: 'POST',
    success: (res) => {
      const result = JSON.parse(res);
      if (result.errcode !== 0) {
        NotifyPlugin.error({
          title: '获取盘点状态失败！',
          content: '错误：' + result.errmsg,
        });
        return;
      }
      if (result.data.start) {
        refreshList();
        clearInterval(timeInterval.value);
        timeInterval.value = setInterval(() => {
          refreshList();
        }, 3000);
      } else {
        clearInterval(timeInterval.value);
      }
      formData.started = result.data.start;
      formData.iid = result.data.iid;
    },
    error: (err) => NotifyPlugin.error({ title: '获取盘点状态失败！', content: err, duration: 5000 }),
    complete: () => {
      cleanInput();
    },
  });
};

const checkEq = () => {
  useRequest({
    url: '/eqCheck/checkItem',
    methods: 'POST',
    data: {
      code: formData.eqcode,
    },
    success: (res) => {
      const result = JSON.parse(res);
      if (result.errcode !== 0) {
        NotifyPlugin.error({
          title: '盘点失败！',
          content: '错误：' + result.errmsg,
        });
        return;
      }
      TableData.value = result.data.equipmentList;
      total.value = result.data.total;
    },
    error: (err) => NotifyPlugin.error({ title: '盘点失败！', content: err, duration: 5000 }),
    complete: () => {
      cleanInput();
    },
  });
};

const refreshList = () => {
  useRequest({
    url: '/eqCheck/getInventory',
    methods: 'POST',
    success: (res) => {
      const result = JSON.parse(res);
      if (result.errcode !== 0) {
        NotifyPlugin.error({
          title: '获取盘点剩余失败！',
          content: '错误：' + result.errmsg,
        });
        return;
      }
      TableData.value = result.data.equipmentList;
      total.value = result.data.total;
    },
    error: (err) => NotifyPlugin.error({ title: '获取盘点剩余失败！', content: err, duration: 5000 }),
  });
};

onMounted(() => {
  checkStatus();
});

onUnmounted(() => {
  clearInterval(timeInterval.value);
});
</script>

<script>
export default {
  name: 'EqCheck',
};
</script>

<style></style>
