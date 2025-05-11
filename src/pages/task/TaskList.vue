<template>
  <!---->
  <div class="TaskList">
    <div class="operation">
      <div class="refresh">
        <t-button theme="danger" variant="outline" size="large" @click="loadTaskList">
          <template #icon>
            <t-icon name="refresh" />
          </template>
        </t-button>
      </div>
      <!---->
      <div class="fullscreen"></div>
      <!---->
      <div class="showDone">
        <t-button theme="default" variant="outline" size="large" @click="showCompleted = !showCompleted">
          <template #icon>
            <t-icon name="rainbow" />
          </template>
          {{ showCompleted ? '隐藏' : '显示' }}已完成的任务
        </t-button>
      </div>
    </div>
    <!---->
    <div class="tabs"></div>
    <!---->
    <div class="inner">
      <!---->
      <div>
        <t-tabs v-model="tab_active">
          <t-tab-panel value="type" label="按任务类型排序" :destroy-on-hide="false" />
          <t-tab-panel value="status" label="按任务状态排序" :destroy-on-hide="false" />
        </t-tabs>
        <taskList
          :data="tableData"
          :tabs="tabs_classification"
          :current-tab="tab_active"
          :show-completed="showCompleted"
          :loading="tableLoading"
        ></taskList>
      </div>
      <!---->
    </div>
  </div>
  <!---->
</template>

<script setup lang="tsx">
import { onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue';
import useRequest from '../../hooks/useRequest.ts';
import { getToken } from '../../hooks/common.ts';
import { NotifyPlugin } from 'tdesign-vue-next';
import taskList from './taskListTable';
import { isArray } from 'lodash-es';

defineProps({
  handleChangeComponent: Function,
});
const showCompleted = ref(false);
const tab_active = ref('type');
const tabs_classification = ['type', 'status'];
const tableLoading = ref(false);
// const tabs = [...tabs_classification, 'weight'];
var timer = null;
const tableData = reactive({
  all: [],
  type: {},
  status: {},
  weight: {},
});

// 转换数据
const convertData = () => {
  const source = tableData.all;
  tableData.type = {};
  tableData.status = {};
  tableData.weight = {};
  source.forEach((item) => {
    const { type, status, weight } = item;
    isArray(tableData.type[type]) ? tableData.type[type].push(item) : (tableData.type[type] = [item]);
    isArray(tableData.status[status]) ? tableData.status[status].push(item) : (tableData.status[status] = [item]);
    isArray(tableData.weight[weight]) ? tableData.weight[weight].push(item) : (tableData.weight[weight] = [item]);
  });
};

const loadTaskList = () => {
  const TOKEN = getToken();
  tableLoading.value = true;
  useRequest({
    url: '/task/list',
    methods: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: TOKEN,
    },
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode != 0) {
        NotifyPlugin.error({
          title: '获取任务列表失败',
          content: json.errmsg,
        });
        return;
      }
      tableData.all = json.data;
      convertData();
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取任务列表失败',
        content: '错误：' + err,
      });
    },
    complete: function () {
      tableLoading.value = false;
    },
  });
};

onBeforeMount(() => {
  loadTaskList();
  timer = setInterval(() => {
    loadTaskList();
  }, 30000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<script lang="tsx">
export default {
  name: 'TaskList',
};
</script>

<style lang="scss" scoped>
.TaskList {
  position: relative;
  display: flex;
  flex-direction: column;
  .operation {
    display: flex;
    flex-direction: row;
    gap: 8px;
    position: absolute;
  }
  ::v-deep .inner {
    margin-top: 49px;
    z-index: 1;
    > div {
      width: 100%;
      background: var(--td-bg-color-container);
      box-shadow: var(--td-shadow-1);
      border-radius: 5px;
      > .t-tabs {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
    }
    .Table--view {
      padding: 16px;
      .tag--body {
        display: flex;
        flex-direction: column;
      }
      .tag_items .title_tag .t-tag {
        margin: 12px 0;
      }
    }
  }
  .inner ::v-deep .hidden--body .t-table__content {
    border-bottom: none !important;
    .t-table__body {
      display: none !important;
    }
  }

  .inner ::v-deep .hidden--head .t-table__content .t-table__header {
    display: none !important;
  }
}
</style>
