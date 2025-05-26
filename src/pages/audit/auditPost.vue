<template>
  <div ref="wrapper" class="audit-post-container">
    <!---->
    <t-card>
      <!---->
      <template #header>
        <div class="header">
          <h3>发起审批</h3>
        </div>
      </template>
      <!---->
      <t-form ref="form" :data="formData" :rules="rules" @submit="handleSubmit">
        <!---->
        <div style="display: flex; flex-direction: row; gap: 16px">
          <!---->
          <div style="width: 50%">
            <!-- 审批类型选择 -->
            <t-form-item label="审批类型" name="application">
              <t-radio-group
                v-model="formData.application"
                variant="primary-filled"
                @change="handleApplicationTypeChange"
              >
                <t-radio-button v-for="item in radioGroupOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </t-radio-button>
              </t-radio-group>
            </t-form-item>

            <!-- 设备借出审批表单 -->
            <template v-if="formData.application === 1">
              <t-form-item label="设备Code" name="details.equipment.eq_code">
                <t-input v-model="formData.details.equipment.eq_code" placeholder="请输入设备Code" />
              </t-form-item>

              <t-form-item label="借出人" name="details.equipment.lender">
                <t-input v-model="formData.details.equipment.lender" placeholder="请输入借出人" />
              </t-form-item>

              <t-form-item :label-width="150" label="借出时间/使用时间" name="details.equipment.lend_time">
                <t-date-picker
                  v-model="formData.details.equipment.lend_time"
                  placeholder="请选择时间"
                  style="width: 100%"
                />
              </t-form-item>

              <t-form-item label="预期归还时间" name="details.equipment.return_time">
                <t-date-picker
                  v-model="formData.details.equipment.return_time"
                  placeholder="请选择时间"
                  style="width: 100%"
                />
              </t-form-item>
            </template>

            <!-- 任务审批表单 -->
            <template v-else-if="formData.application === 3">
              <t-form-item label="操作类型" name="details.task.operate_type">
                <t-radio-group
                  v-model="formData.details.task.operate_type"
                  variant="outline"
                  :disabled="!!formData.details.task.id"
                >
                  <t-radio-button value="add"> 新增 </t-radio-button>
                  <t-radio-button value="edit"> 编辑 </t-radio-button>
                  <t-radio-button value="del"> 删除 </t-radio-button>
                </t-radio-group>
              </t-form-item>

              <t-form-item v-if="formData.details.task.operate_type !== 'add'" label="任务id" name="details.task.id">
                <t-input v-model="formData.details.task.id" disabled placeholder="字段无效，请重试" />
              </t-form-item>

              <t-form-item label="任务名称" name="details.task.name">
                <t-input v-model="formData.details.task.name" placeholder="请输入任务名称" />
              </t-form-item>

              <t-form-item label="工作地点" name="details.task.place">
                <t-input v-model="formData.details.task.place" placeholder="请输入工作地点" />
              </t-form-item>

              <t-form-item label="工作时间" name="details.task.work_time">
                <t-date-range-picker
                  v-model="formData.details.task.work_time"
                  enable-time-picker
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['请选择开始时间', '请选择结束时间']"
                  style="width: 100%"
                />
              </t-form-item>

              <t-form-item label="任务内容" name="details.task.content">
                <t-textarea
                  v-model="formData.details.task.content"
                  placeholder="请输入任务内容"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
              </t-form-item>

              <t-form-item :label-width="125" label="预期完成时间" name="details.task.finally_time">
                <t-date-picker
                  v-model="formData.details.task.finally_time"
                  placeholder="请选择预期完成时间"
                  style="width: 100%"
                />
              </t-form-item>

              <t-form-item label="任务类型" name="details.task.type">
                <t-select
                  v-model="formData.details.task.type"
                  :value-display="(_h, { value }) => selectValueDisplay(taskType, value)"
                >
                  <t-option v-for="item in taskType" :key="item.value" :value="item.value">
                    <t-tag variant="light-outline" :theme="item?.theme" :color="item.color">{{ item.label }}</t-tag>
                  </t-option>
                </t-select>
              </t-form-item>

              <t-form-item label="任务状态" name="details.task.status">
                <t-select
                  v-model="formData.details.task.status"
                  :value-display="(_h, { value }) => selectValueDisplay(taskStatus, value)"
                >
                  <t-option v-for="item in taskStatus" :key="item.value" :value="item.value">
                    <t-tag variant="light-outline" :theme="item?.theme" :color="item.color">{{ item.label }}</t-tag>
                  </t-option>
                </t-select>
              </t-form-item>

              <t-form-item label="权重等级" name="details.task.weight">
                <t-rate v-model="formData.details.task.weight"></t-rate>
              </t-form-item>

              <t-form-item label="分配人员" name="details.task.user">
                <t-transfer v-model="formData.details.task.user" :data="transferSource"></t-transfer>
              </t-form-item>

              <t-form-item label="使用设备" name="details.task.equipment">
                <t-tagInput
                  v-model="formData.details.task.equipment"
                  tips="需要用到的设备，可让工作人员更快速地准备，每输入完一个设备请按回车！"
                />
              </t-form-item>

              <t-form-item label="备注" name="details.task.remark">
                <t-textarea
                  v-model="formData.details.task.remark"
                  placeholder="请输入备注"
                  :autosize="{ minRows: 2, maxRows: 3 }"
                />
              </t-form-item>
            </template>

            <!-- 其他事项审批表单 -->
            <template v-else>
              <t-form-item label="审批名称" name="details.other.key">
                <t-input v-model="formData.details.other.key" placeholder="请输入审批名称" />
              </t-form-item>

              <t-form-item label="审批内容" name="details.other.content">
                <t-textarea
                  v-model="formData.details.other.content"
                  :autosize="{ minRows: 5, maxRows: 15 }"
                  placeholder="请输入内容"
                />
              </t-form-item>

              <t-form-item label="值" name="details.other.value">
                <t-input v-model="formData.details.other.value" placeholder="请输入值" />
              </t-form-item>

              <t-form-item label="其他内容" name="details.other.extra">
                <t-textarea
                  v-model="formData.details.other.extra"
                  placeholder="请输入其他内容"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
              </t-form-item>
            </template>
          </div>
          <!---->
          <div class="audit-post-timeline" style="width: 50%">
            <div style="font: var(--td-font-title-medium); display: flex; align-items: center; gap: 4px">
              <span>审批流程</span>
              <t-popup :content="() => helpInfo()">
                <HelpCircleIcon />
              </t-popup>
            </div>
            <!---->
            <!-- <t-timeline mode="same" style="padding: 12px 0px 0px 24px">
              <t-timeline-item v-for="(item, index) in previewTimelineOptions" :key="index" v-bind="item" />
            </t-timeline> -->
            <RenderPreviewTimeline
              :type="formData.application === 1 ? 'equipment' : formData.application === 3 ? 'task' : 'other'"
              :source-data="{ eq_code: formData.details.equipment.eq_code }"
              :user-list="userList"
              :prepare-step-list="prepareStepList"
              :user-code="userCode"
              @change="handlePreviewTimelineChange"
            />
          </div>
          <!---->
        </div>
        <!---->
        <div style="width: 80%; margin: 0px auto; padding: 48px 0 24px">
          <t-button theme="primary" type="submit" block>提交审批</t-button>
        </div>
        <!---->
      </t-form>
      <!---->
    </t-card>
    <!---->
  </div>
</template>

<script setup lang="tsx">
import { onMounted, PropType, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { LoadingPlugin, NotifyPlugin } from 'tdesign-vue-next';
import { HelpCircleIcon } from 'tdesign-icons-vue-next';
import RenderPreviewTimeline from './components/renderPreviewTimeline';
import { selectValueDisplay } from '../task/utils';
import { taskType, taskStatus } from '@hooks/common';
import useRequest from '@hooks/useRequest';
import type { TdFormProps } from 'tdesign-vue-next';
import type {
  ApprovalPreviewStepData,
  AuditDetailOfLend,
  AuditDetailOfOther,
  AuditDetailOfTask,
  AuditStepItem,
} from './type';
import type { HandleChangeComponentFunctionType } from '@type/type';
import { isEmpty } from 'lodash-es';

const route = useRoute();

const wrapper = ref(null);
const radioGroupOptions = [
  { label: '设备借出审批', value: 1, key: 'equipment' },
  { label: '任务审批', value: 3, key: 'task' },
  { label: '其他事项审批', value: 4, key: 'other' },
];
const transferSource = ref([]);
const props = defineProps({
  handleChangeComponent: {
    type: Function as PropType<HandleChangeComponentFunctionType>,
    default: null,
  },
  userCode: {
    type: String,
    default: '',
  },
});
const formData = reactive({
  application: 4, // 默认选择其他事项审批
  details: {
    // 设备借出审批字段
    equipment: {
      eq_code: '',
      lend_time: '',
      return_time: '',
      lender: '',
    },
    // 任务审批字段
    task: {
      operate_type: 'add',
      id: null,
      content: '',
      equipment: [],
      finally_time: '',
      name: '',
      place: '',
      remark: '',
      status: null,
      type: null,
      user: [],
      weight: 3,
      work_time: [],
    },
    // 其他事项审批
    other: {
      content: '',
      extra: '',
      key: '',
      value: '',
    },
  },
});

const rules = {
  application: [{ required: true, message: '请选择审批类型', trigger: 'change' }],
  // 设备借出审批
  'details.equipment.eq_code': [{ required: true, message: '设备Code必填', trigger: 'change' }],
  'details.equipment.lender': [{ required: true, message: '借出人必填', trigger: 'change' }],
  'details.equipment.lend_time': [{ required: true, message: '借出时间/使用时间必填', trigger: 'change' }],
  'details.equipment.return_time': [{ required: true, message: '预期归还时间必填', trigger: 'change' }],
  // 任务审批
  'details.task.operate_type': [{ required: true, message: '操作类型必填', trigger: 'change' }],
  'details.task.id': [{ required: true, message: '任务id必填', trigger: 'change' }],
  'details.task.name': [{ required: true, message: '任务名称必填', trigger: 'change' }],
  'details.task.place': [{ required: true, message: '任务地点必填', trigger: 'change' }],
  'details.task.content': [{ required: true, message: '任务内容必填', trigger: 'change' }],
  'details.task.work_time': [{ required: true, message: '工作时间必填', trigger: 'change' }],
  'details.task.status': [{ required: true, message: '任务状态必填', trigger: 'change' }],
  'details.task.type': [{ required: true, message: '任务类型必填', trigger: 'change' }],
  'details.task.finally_time': [{ required: true, message: '预期完成时间必填', trigger: 'change' }],
  // 其他审批
  'details.other.key': [{ required: true, message: '审批名称必填', trigger: 'change' }],
  'details.other.content': [{ required: true, message: '审批内容必填', trigger: 'change' }],
};
const prepareStepList = ref<ApprovalPreviewStepData>();
const userList = ref();
const helpInfo = () => {
  return formData.application === 1 ? (
    <div style="display: flex; flex-direction: column;">
      <span>设备借出审批：</span>
      <span>第一审批人为 部门部长或部门技术或部门技术</span>
      <span>第二审批人为 设备物主</span>
    </div>
  ) : formData.application === 3 ? (
    <div style="display: flex; flex-direction: column;">
      <span>任务审批：</span>
      <span>第一审批人为 上级组长（若无组长则系统自动通过该流程）</span>
      <span>第二审批人为 部门部长或部门管理或部门技术</span>
    </div>
  ) : (
    <div style="display: flex; flex-direction: column;">
      <span>其他事项审批：</span>
      <span>第一审批人默认为 上级组长（若无组长则系统自动通过该流程），支持自定义选择</span>
      <span>第二审批人默认为 部长或技术或管理，支持自定义选择</span>
    </div>
  );
};
let previewStep = [];

const handlePreviewTimelineChange = (step_order: number, data: AuditStepItem[]) => {
  previewStep = previewStep.filter((item) => item.step_order !== step_order);
  previewStep.push(...data);
};

const handleApplicationTypeChange = async (value: number) => {
  if (value === 3) {
    await loadUserList();
  }
  await loadStepList();
  formData.application = value;
};

const handleSubmit: TdFormProps['onSubmit'] = ({ validateResult, firstError }) => {
  if (validateResult !== true) {
    NotifyPlugin.error({
      title: '表单校验错误提示',
      content: firstError,
    });
  }

  if (validateResult) {
    const stepList = previewStep;
    const appKey = formData.application === 1 ? 'equipment' : formData.application === 3 ? 'task' : 'other';
    const appDetails = formData.details[appKey];

    useRequest({
      url: '/approval/post',
      methods: 'POST',
      data: {
        type: appKey,
        steps: JSON.stringify(stepList),
        details: JSON.stringify(appDetails),
      },
      success: function (res) {
        const json = JSON.parse(res);
        if (json.errcode != 0) {
          NotifyPlugin.error({
            title: '添加审批失败[Main]',
          });
        }
      },
    });
  }
};

const loadStepList = () => {
  const appType = formData.application;
  const appKey = appType === 1 ? 'equipment' : appType === 3 ? 'task' : 'other';
  const loadingInstance = LoadingPlugin({
    attach: () => wrapper.value,
    showOverlay: true,
    text: '加载中...',
    size: '20px',
  });
  useRequest({
    url: '/approval/getStepList',
    methods: 'POST',
    data: {
      approvalType: appKey,
    },
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode != 0) {
        NotifyPlugin.error({
          title: '获取审批步骤列表失败[Main]',
          content: json.errmsg,
        });
        return;
      }
      prepareStepList.value = json.data;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取审批步骤列表失败[Error]',
        content: '错误：' + err,
      });
    },
    complete: () => {
      loadingInstance.hide();
    },
  });
};

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

// 获取审信息
const loadApproverList = () => {
  useRequest({
    url: '/approve/userList',
    methods: 'POST',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode != 0) {
        NotifyPlugin.error({
          title: '获取审批人列表失败[Main]',
          content: json.errmsg,
        });
        return;
      }
      // userList.value = json.data;
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
        title: '获取审批人列表失败[Error]',
        content: '错误：' + err,
      });
    },
  });
};

onMounted(() => {
  const { applicationType, data: sourceData } = route.query;

  loadUserList();

  let data: AuditDetailOfLend | AuditDetailOfTask | AuditDetailOfOther;

  try {
    if (sourceData) {
      data = JSON.parse(sourceData as string);
    }
  } catch (e) {
    console.error(e);
    NotifyPlugin.error({
      title: '设置审批内容失败',
      content: '错误：' + e,
    });
    return;
  }
  if (applicationType === '1') {
    // 设置字段
    const { eq_code, lend_time, return_time, lender } = data as AuditDetailOfLend;
    // 主字段
    formData.application = 1;
    // 表单字段
    formData.details.equipment.eq_code = eq_code;
    formData.details.equipment.lend_time = lend_time;
    formData.details.equipment.return_time = return_time;
    formData.details.equipment.lender = lender;
  }

  if (applicationType === '3') {
    // 设置字段
    const {
      operate_type,
      id,
      content,
      equipment,
      finally_time,
      name,
      place,
      remark,
      status,
      type,
      user,
      weight,
      work_time,
    } = data as AuditDetailOfTask;
    // 主字段
    formData.application = 3;
    // 表单字段
    formData.details.task.operate_type = operate_type;
    formData.details.task.id = id;
    formData.details.task.content = content;
    formData.details.task.place = place;
    formData.details.task.name = name;
    formData.details.task.status = status;
    formData.details.task.type = type;
    formData.details.task.finally_time = finally_time;
    formData.details.task.work_time = (work_time as string)?.split(',');
    formData.details.task.user = (user as string).split(',').filter((item) => !!item);
    formData.details.task.weight = weight;
    formData.details.task.equipment = (equipment as string).split(',').filter((item) => !!item);
    formData.details.task.remark = remark;
  }

  loadStepList();
});
</script>

<style scoped>
.audit-post-container {
  max-width: 100%;
  margin: 0 auto;
  margin: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
