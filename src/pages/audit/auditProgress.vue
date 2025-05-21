<template>
  <div class="audit-progress-container">
    <t-card>
      <!---->
      <template #header>
        <div class="header">
          <h3>审批进度</h3>
        </div>
      </template>
      <!---->
      <t-tabs v-model="activeTab">
        <!---->
        <t-tab-panel value="myRequest" label="我发起的">
          <t-table :data="mySubmitList" :columns="myRequestTableColumns" :loading="tableLoading" stripe hover>
            <template #status="{ row }">
              <t-tag :theme="getStatusTheme(row.status)" :variant="getStatusVariant(row.status)">
                {{ getStatusText(row.status) }}
              </t-tag>
            </template>

            <template #type="{ row }">
              <t-tag theme="primary" variant="light">
                {{ getTypeText(row.type) }}
              </t-tag>
            </template>

            <template #operation="{ row }">
              <t-button variant="text" theme="primary" @click="viewDetail(row)">查看</t-button>
            </template>
          </t-table>
        </t-tab-panel>
        <!---->
        <t-tab-panel value="myApprove" label="待我审批">
          <t-table :data="myApproveList" :columns="myApproveTableColumns" :loading="tableLoading" stripe hover>
            <template #status="{ row }">
              <t-tag :theme="getStatusTheme(row.status)" :variant="getStatusVariant(row.status)">
                {{ getStatusText(row.status) }}
              </t-tag>
            </template>

            <template #type="{ row }">
              <t-tag theme="primary" variant="light">
                {{ getTypeText(row.type) }}
              </t-tag>
            </template>

            <template #operation="{ row }">
              <t-button variant="text" theme="primary" @click="viewDetail(row)">查看</t-button>
              <t-button v-if="row.status === 0" variant="text" theme="success" @click="approve(row)"> 审批 </t-button>
            </template>
          </t-table>
        </t-tab-panel>
        <!---->
      </t-tabs>
      <!---->
    </t-card>

    <!-- 审批详情对话框 -->
    <t-dialog
      v-model:visible="detailVisible"
      header="审批详情"
      :footer="false"
      width="700px"
      :close-on-overlay-click="false"
    >
      <template v-if="currentAudit">
        <div class="audit-detail">
          <div class="audit-info">
            <h4>基本信息</h4>
            <t-descriptions :data="getAuditInfo()" bordered />
          </div>

          <div class="audit-content">
            <h4>审批内容</h4>
            <template v-if="currentAudit.type === 3">
              <!-- 任务审批详情 -->
              <t-descriptions :data="getTaskAuditContent()" bordered />
            </template>
            <template v-else-if="currentAudit.type === 1">
              <!-- 设备借出审批详情 -->
              <t-descriptions :data="getEquipmentAuditContent()" bordered />
            </template>
          </div>

          <div class="audit-timeline">
            <h4>审批流程</h4>
            <t-timeline>
              <t-timeline-item v-for="(record, index) in currentAudit.records" :key="index">
                <template #dot>
                  <t-icon :name="getActionIcon(record.action)" :style="{ color: getActionColor(record.action) }" />
                </template>
                <div class="timeline-content">
                  <div class="timeline-title">
                    {{ record.approver_user_name }} ({{ record.approver_user_code }})
                    {{ getActionText(record.action) }}
                  </div>
                  <div class="timeline-time">{{ formatDate(record.created_at) }}</div>
                  <div v-if="record.comment" class="timeline-comment">意见: {{ record.comment }}</div>
                </div>
              </t-timeline-item>
            </t-timeline>
          </div>
        </div>
      </template>
    </t-dialog>

    <!-- 审批操作对话框 -->
    <t-dialog
      v-model:visible="approveVisible"
      header="审批操作"
      :confirm-btn="{ content: '确认', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      width="500px"
      @confirm="handleApproveConfirm"
    >
      <template v-if="currentAudit">
        <t-form ref="approveForm" :data="approveForm">
          <t-form-item label="审批结果">
            <t-radio-group v-model="approveForm.action">
              <t-radio :value="1">通过</t-radio>
              <t-radio :value="2">拒绝</t-radio>
            </t-radio-group>
          </t-form-item>

          <t-form-item label="审批意见">
            <t-textarea
              v-model="approveForm.comment"
              placeholder="请输入审批意见"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>
        </t-form>
      </template>
    </t-dialog>
  </div>
</template>

<script lang="tsx" setup>
import useRequest from '@/hooks/useRequest';
import { NotifyPlugin } from 'tdesign-vue-next';
import { defineComponent, onMounted, ref } from 'vue';
import { AuditItem } from './type';

type MyRequestListData = Omit<AuditItem, 'steps' | 'records'>;

const props = defineProps({
  handleChangeComponent: {
    type: Function,
    default: null,
  },
  userCode: {
    type: String,
    default: '',
  },
});

const activeTab = ref('myRequest');
const commonTableColumns = [
  { colKey: 'id', title: 'ID', width: 80 },
  { colKey: 'title', title: '标题' },
  { colKey: 'type', title: '类型', width: 120, cell: 'type' },
  { colKey: 'status', title: '状态', width: 120, cell: 'status' },
  { colKey: 'created_at', title: '创建时间', width: 220 },
];
const myRequestTableColumns = [
  ...commonTableColumns,
  { colKey: 'operation', title: '操作', width: 120, cell: 'operation' },
];
const myApproveTableColumns = [
  ...commonTableColumns,
  { colKey: 'operation', title: '操作', width: 120, cell: 'operation' },
];
const tableLoading = ref(false);

const loadMyRequestList = () => {
  useRequest({
    url: '/approval/myRequestList',
    methods: 'POST',
    success: function (res) {
      const json: MyRequestListData[] = JSON.parse(res);
      console.log(json);
    },
    error: function (err) {
      NotifyPlugin.error({
        title: '获取我的申请列表失败[Error]',
        content: '错误：' + err,
      });
    },
  });
};

onMounted(() => {
  loadMyRequestList();
});
</script>

<script lang="tsx">
export default defineComponent({
  name: 'AuditProgress',
});
</script>

<style scoped></style>
