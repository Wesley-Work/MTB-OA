<template>
  <div class="mainView">
    <div class="TaskListCard">
      <div class="cardHeader">
        <span>当前任务列表</span>
        <span class="desc">（选择以进行编辑）</span>
      </div>
      <div class="cardBody">
        <div class="taskList">
          <!-- <div class="taskList--item" style="display: flex; align-self: center; gap: 4px;">
                        <TaskAddIcon />
                        <span> 添加新任务</span>
                    </div> -->
          <!---->
          <div
            v-for="(task, index) in taskList"
            :key="index"
            class="taskList--item"
            :class="{ active: task.id == taskListActive }"
            @click="() => handleTaskItemClick(task)"
          >
            <span>{{ task.id }}# {{ task.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <!---->
    <div class="TaskEditerCard">
      <div class="cardHeader">
        <span>
          {{ taskListActive ? '编辑任务' : '新增任务' }}
        </span>
      </div>
      <div class="cardBody">
        <!---->
        <t-form ref="formRef" :rules="taskFormRules" :data="taskActiveItem" :colon="true" @submit="onSubmit">
          <t-space style="width: 64%">
            <div>
              <t-form-item label="任务名称" name="name">
                <t-input v-model="taskActiveItem.name" placeholder="请输入任务名称" />
              </t-form-item>
              <t-form-item label="工作地点" name="place">
                <t-input v-model="taskActiveItem.place" placeholder="请输入内容" />
              </t-form-item>
              <t-form-item label="工作时间" name="work_time">
                <t-date-range-picker
                  v-model="taskActiveItem.work_time"
                  enable-time-picker
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['请选择开始时间', '请选择结束时间']"
                  style="width: 100%"
                />
              </t-form-item>
              <t-form-item label="工作内容" name="content">
                <t-input v-model="taskActiveItem.content" placeholder="请输入内容" />
              </t-form-item>
              <t-form-item :label-width="110" label="何时前完成" name="finally_time">
                <t-date-picker
                  v-model="taskActiveItem.finally_time"
                  enable-time-picker
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择时间"
                  style="width: 100%"
                />
              </t-form-item>
              <t-form-item label="任务类型" name="type">
                <t-select
                  v-model="taskActiveItem.type"
                  :value-display="(_h, { value }) => selectValueDisplay(taskType, value)"
                >
                  <t-option v-for="item in taskType" :key="item.value" :value="item.value">
                    <t-tag variant="light-outline" :theme="item?.theme" :color="item.color">{{ item.label }}</t-tag>
                  </t-option>
                </t-select>
              </t-form-item>
              <t-form-item label="任务状态" name="status">
                <t-select
                  v-model="taskActiveItem.status"
                  :value-display="(_h, { value }) => selectValueDisplay(taskStatus, value)"
                >
                  <t-option v-for="item in taskStatus" :key="item.value" :value="item.value">
                    <t-tag variant="light-outline" :theme="item?.theme" :color="item.color">{{ item.label }}</t-tag>
                  </t-option>
                </t-select>
              </t-form-item>
              <t-form-item label="权重等级" name="weight">
                <t-rate v-model="taskActiveItem.weight"></t-rate>
              </t-form-item>
              <t-form-item label="备注" name="remark">
                <t-input v-model="taskActiveItem.remark" placeholder="请输入内容" />
              </t-form-item>
            </div>
            <!---->
            <div>
              <t-form-item label="分配人员" name="user">
                <t-transfer v-model="taskActiveItem.user" :data="transferSource"></t-transfer>
              </t-form-item>
              <t-form-item label="使用设备" name="equipment">
                <t-tagInput
                  v-model="taskActiveItem.equipment"
                  tips="需要用到的设备，可让工作人员更快速地准备，每输入完一个设备请按回车！"
                />
              </t-form-item>
            </div>
          </t-space>
          <t-form-item style="margin-top: 16px">
            <t-space size="small">
              <t-button theme="primary" type="submit" variant="outline" ghost :loading="requesting">提交内容</t-button>
              <t-popconfirm theme="danger" content="确认删除吗？" @confirm="onDelTask">
                <t-button variant="dashed" theme="danger" :disabled="!taskListActive">删除任务</t-button>
              </t-popconfirm>

              <!-- <t-button theme="default" variant="base" :disabled="taskListActive" @click="resetForm">重置表单</t-button> -->
            </t-space>
          </t-form-item>
        </t-form>
        <!---->
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { useRouter } from 'vue-router';
import { onMounted, ref, PropType } from 'vue';
import { isArray } from 'lodash-es';
import { DialogPlugin, NotifyPlugin } from 'tdesign-vue-next';
// import { TaskAddIcon } from 'tdesign-icons-vue-next';
import { taskType, taskStatus } from '@hooks/common';
import useRequest from '@hooks/useRequest';
import { selectValueDisplay } from './utils';
import { HandleChangeComponentFunctionType } from '@type/type';

const props = defineProps({
  handleChangeComponent: Function as PropType<HandleChangeComponentFunctionType>,
});
const router = useRouter();
const userList = ref([]);
const transferSource = ref([]);
const defaultItem = {
  id: null,
  name: null,
  place: null,
  content: null,
  user: [],
  equipment: [],
  work_time: [],
  status: null,
  type: null,
  weight: 3,
  finally_time: null,
  remark: null,
};
const taskList = ref([]);
const taskListActive = ref(null);
const taskActiveItem = ref({ ...defaultItem });
const taskFormRules = {
  name: [{ required: true, message: '任务名称必填', trigger: 'submit' }],
  place: [{ required: true, message: '任务地点必填', trigger: 'submit' }],
  content: [{ required: true, message: '任务内容必填', trigger: 'submit' }],
  work_time: [{ required: true, message: '工作时间必填', trigger: 'submit' }],
  status: [{ required: true, message: '任务状态必填', trigger: 'submit' }],
  type: [{ required: true, message: '任务类型必填', trigger: 'submit' }],
  finally_time: [{ required: true, message: '预期完成时间必填', trigger: 'submit' }],
};
const requesting = ref(false);

const loadUserList = () => {
  useRequest({
    url: '/get/userList',
    methods: 'POST',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode != 0) {
        NotifyPlugin.error({
          title: '获取用户列表失败[Main]',
          content: json.errmsg,
        });
        return;
      }
      userList.value = json.data;
      transferSource.value = json.data.map((user) => {
        return {
          label: `${user.name}`,
          value: user.name,
        };
      });
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取用户列表失败[Error]',
        content: '错误：' + err,
      });
    },
  });
};

const loadTaskList = () => {
  useRequest({
    url: '/task/list',
    methods: 'POST',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode != 0) {
        NotifyPlugin.error({
          title: '获取任务列表失败',
          content: json.errmsg,
        });
        return;
      }
      taskList.value = json.data.reverse();
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取任务列表失败',
        content: '错误：' + err,
      });
    },
  });
};

const handleTaskItemClick = (task) => {
  const active = taskListActive.value === task.id;
  taskListActive.value = active ? null : task.id;
  task.user = isArray(task.user) ? task.user : task.user.split(',');
  task.equipment = isArray(task.equipment)
    ? task.equipment
    : task.equipment === '' || task.equipment === null
    ? []
    : task.equipment.split(',');
  task.work_time = isArray(task.work_time) ? task.work_time : task.work_time.split(',');
  taskActiveItem.value = active ? defaultItem : task;
};

const resetForm = () => {
  taskListActive.value = null;
  taskActiveItem.value = { ...defaultItem };
};

const onSubmit = (context) => {
  const validateResult = context.validateResult;
  if (validateResult !== true) return false;
  requesting.value = true;
  const mode = taskListActive.value ? 'edit' : 'add';

  useRequest({
    url: `/task/${mode}`,
    methods: 'POST',
    data: taskActiveItem.value,
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode == 0) {
        NotifyPlugin.success({
          title: '操作成功',
          content: `${
            taskListActive.value
              ? '成功编辑了' + taskActiveItem.value?.id + '号任务'
              : '添加了' + json.data.id + '号任务'
          }`,
        });
        resetForm();
        loadTaskList();
      } else if (json.errcode === -60060) {
        const dialog = DialogPlugin.confirm({
          header: '需要审批',
          body: json.errmsg,
          confirmBtn: {
            content: '去发起审批',
            theme: 'primary',
            onClick: () => {
              props?.handleChangeComponent?.('AuditPost', true, true, {
                applicationType: 3,
                data: json.data?.details,
              });
              dialog.destroy();
            },
          },
          cancelBtn: {
            content: '关闭',
            onClick: () => {
              dialog.destroy();
            },
          },
          onClose: () => {
            dialog.destroy();
          },
        });
      } else {
        NotifyPlugin.error({
          title: '操作失败',
          content: json.errmsg,
        });
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '操作失败',
        content: err,
      });
    },
    complete: function () {
      requesting.value = false;
    },
  });
};

const onDelTask = () => {
  const { id } = taskActiveItem.value;
  useRequest({
    url: `/task/del`,
    methods: 'POST',
    data: {
      id,
    },
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode == 0) {
        NotifyPlugin.success({
          title: '操作成功',
          content: `删除${id}号任务成功`,
        });
        loadTaskList();
      } else {
        NotifyPlugin.error({
          title: '操作失败',
          content: json.errmsg,
        });
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '操作失败',
        content: err,
      });
    },
  });
};

onMounted(() => {
  loadUserList();
  loadTaskList();
});
</script>

<script lang="tsx">
export default {
  name: 'AddTask',
};
</script>

<style lang="scss">
$cardPadding: 24px;
.mainView {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
  > .TaskListCard,
  > .TaskEditerCard {
    display: flex;
    flex-direction: column;
    background-color: var(--td-bg-color-container);
    width: 100%;
    border-radius: 5px;
    > .cardHeader {
      padding: $cardPadding $cardPadding 8px;
      font: var(--td-font-mark-medium);
      font-size: 18px;
      .desc {
        margin-left: 2px;
        font: var(--td-font-body-medium);
        color: var(--td-text-color-secondary);
        word-break: break-all;
      }
    }
    > .cardBody {
      padding: 4px $cardPadding $cardPadding;
    }
  }
  > .TaskListCard {
    .taskList {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      max-height: 150px;
      overflow-y: auto;
      padding-left: 4px;
      padding-bottom: 4px;
      &::-webkit-scrollbar {
        background-color: transparent;
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #777;
        border-radius: 10px;
      }
      .taskList--item {
        padding: 8px 12px;
        width: fit-content;
        border: 1px #eee solid;
        box-shadow: var(--td-shadow-1);
        background: var(--td-bg-color-container);
        transition: all 0.28s ease-in-out;
        border-radius: 4px;
        cursor: pointer;
        font-size: 15px;
        &.active {
          color: #fff;
          background-color: var(--td-brand-color);
        }
      }
    }
  }
}
</style>
