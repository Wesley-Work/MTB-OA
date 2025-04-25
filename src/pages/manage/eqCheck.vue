<template>
  <div
    id="LendComponent"
    ref="MainBox"
    class="MainBox"
    style="background: var(--td-bg-color-container); padding: 32px; border-radius: 5px"
  >
    >
    <div class="MainBox-Operate">
      <div id="lendpage">
        <div style="display: flex; flex-direction: row; justify-content: space-between">
          <!--info-->
          <div style="min-width: 44%">
            <div>
              <t-button
                style="width: 100%; height: 56px; font: var(--td-font-title-large)"
                :disabled="formData.start"
                @click="start"
                >开始清点</t-button
              >
            </div>
            <!---->
            <div style="margin-top: 13px">
              <div style="display: flex; align-items: center">
                <span class="bitian">*</span>
                <span style="color: var(--td-text-color-primary); font: var(--td-font-body-medium)">设备Code: </span>
                <t-input
                  ref="lendinput"
                  v-model="formData.eqcode"
                  style="width: 181px; margin-left: 10px"
                  class="lendinput"
                  placeholder="请扫描或输入"
                  :on-enter="newlend"
                  :autofocus="true"
                  @input="requesteqinfo(lendeqcodevalue)"
                ></t-input>
                <t-button class="lendbutton" style="margin-left: -10px; z-index: 2" @click.end="newlend">归还</t-button>
              </div>
            </div>
          </div>
          <!--list-->
          <div style="max-width: 54%">
            <t-card id="weTag">
              <template #title>
                <span>剩余设备列表</span>
              </template>
              <div style="display: flex; flex-direction: row; align-items: center">
                <t-table :data="TableData" :columns="TableColumns"></t-table>
              </div>
            </t-card>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="loading__" :class="{ show: loading, hidden: !loading }">
    <div class="text__" :class="{ hidden: textchange, show: !textchange }">
      {{ textlist[nowtext] }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { NotifyPlugin } from 'tdesign-vue-next';
import useRequest from '../../hooks/useRequest';

// 睡眠函数
// function sleep(d) {
//   for (let t = Date.now(); Date.now() - t <= d; );
// }

const formData = reactive({ eqcode: '', start: false });
const loading = ref(false);
const TableData = ref([
  {
    eqname: '一个设备设备设备设备设备设备',
    eqcode: '09098',
    user: '文俊亮',
    lendtime: '2023-07-11 22:55:34',
    dothisthinguser: '文俊亮',
    more: 'ok',
  },
]);
const TableColumns = ref([
  { colKey: 'eqname', title: '设备名称', width: '200' },
  { colKey: 'eqcode', title: '设备Code', width: '150' },
  { colKey: 'user', title: '归还人', width: '90', align: 'center' },
  { colKey: 'dothisthinguser', title: '操作人', width: '90', align: 'center' },
  { colKey: 'lendtime', title: '归还时间', ellipsis: true },
  { colKey: 'more', title: '备注', width: '170' },
]);
const textlist = [
  '请稍等，正在执行清点设备程序',
  '请不要关闭浏览器',
  '很快就好',
  '去看看窗外的风景吧',
  '稍安勿躁',
  '海内存知己，天涯若比邻',
];
const textchange = ref(false);
const nowtext = ref(0);
const timer = ref(null);
const Operation_id = ref(null);
const getStatusTimer = ref(null);

const start = () => {
  setTimeout(() => {
    formData.start = true;
    loading.value = true;
    timer.value = setInterval(() => {
      setTimeout(() => s1(), 2500);
      setTimeout(() => s2(), 5000);
    }, 7500);
  }, 280);

  const TOKEN = localStorage.getItem('token');
  useRequest({
    url: '/eqcheck/start',
    methods: 'POST',
    success: (res) => {
      const RES = JSON.parse(res);
      if (RES.errcode === 0) {
        Operation_id.value = RES.data.operation_sha;
        getStatusTimer.value = setInterval(() => getStatus(), 1000);
      } else {
        NotifyPlugin.error({ title: '执行失败', content: `未知错误，错误码${RES.errcode}，${RES.errmsg}` });
      }
    },
    error: (err) => NotifyPlugin.error({ title: '借出设备失败！', content: err, duration: 5000 }),
  });
};

const getStatus = () => {
  const TOKEN = localStorage.getItem('token');
  useRequest({
    url: '/eqcheck/status',
    methods: 'POST',
    success: (res) => {
      const RES = JSON.parse(res);
      if (RES.errcode === 0 && RES.data.progressing === false) {
        loading.value = false;
        clearInterval(getStatusTimer.value);
        clearInterval(timer.value);
      }
    },
    error: (err) => NotifyPlugin.error({ title: '获取状态失败！', content: err, duration: 5000 }),
  });
};

const s1 = () => {
  textchange.value = true;
};
const s2 = () => {
  const b = textlist.length;
  const c = Math.floor(Math.random() * b);
  const d = c === nowtext.value ? Math.floor(Math.random() * b) : c;
  const e = d === nowtext.value ? Math.floor(Math.random() * b) : d;
  const f = e === nowtext.value ? Math.floor(Math.random() * b) : e;
  nowtext.value = f;
  textchange.value = false;
};

onMounted(() => {});
</script>

<script>
export default {
  name: 'EqCheck',
};
</script>

<style>
.loading__ {
  background-color: #003cab;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  opacity: 0;
  transition: all 0.28s var(--transition-default);
  color: #fff;
  font: var(--td-font-display-large);
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 9px;
  user-select: none;
}

.loading__.show {
  opacity: 1;
}

.loading__.hidden {
  pointer-events: none;
}

.text__ {
  transition: all 1s var(--transition-default);
}

.text__.show {
  opacity: 1;
}

.text__.hidden {
  opacity: 0;
}
</style>
