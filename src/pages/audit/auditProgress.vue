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
          <t-table
            row-key="id"
            :data="myRequestTableData"
            :columns="myRequestTableColumns"
            :loading="tableLoading"
            stripe
            hover
          >
          </t-table>
        </t-tab-panel>
        <!---->
        <t-tab-panel value="myApprove" label="待我审批">
          <t-table
            row-key="id"
            :data="myApproveTableData"
            :columns="myApproveTableColumns"
            :loading="tableLoading"
            stripe
            hover
          >
          </t-table>
        </t-tab-panel>
        <!---->
      </t-tabs>
      <!---->
    </t-card>

    <!-- 审批详情对话框 -->
    <t-dialog v-model:visible="detailVisible" header="审批项目详情" :footer="false" width="50%">
      <div class="audit-detail">
        <div class="audit-content">
          <ApprovalDetailInfo :data="currentShowDetailsData" />
        </div>

        <div class="audit-timeline">
          <h4>审批流程</h4>
          <!-- <t-timeline>
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
          </t-timeline> -->
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script lang="tsx" setup>
import useRequest from '@/hooks/useRequest';
import { NotifyPlugin } from 'tdesign-vue-next';
import { defineComponent, onMounted, ref } from 'vue';
import { AuditItem } from './type';
import dayjs from 'dayjs';
import ApprovalDetailInfo from './utils/renderApprovalDetailInfo';
import RenderTypeTag from './utils/renderTypeTag';
import RenderStatusTag from './utils/renderStatusTag';

type MyRequestListData = Omit<AuditItem, 'steps' | 'records'>;
type MyApprovalListData = Omit<AuditItem, 'records'>;

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
  { colKey: 'details.content', title: '标题', width: 240 },
  { colKey: 'details.other_info', title: '内容', width: 240 },
  { colKey: 'current_step', title: '当前步骤', align: 'center' },
  {
    colKey: 'type',
    title: '类型',
    width: 120,
    align: 'center',
    cell: (_h, { row }) => {
      return <RenderTypeTag type={row.type} />;
    },
  },
  {
    colKey: 'status',
    title: '状态',
    width: 120,
    align: 'center',
    cell: (h, { row }) => {
      return <RenderStatusTag status={row.status} data={row} size="medium" variant="light-outline" />;
    },
  },
  {
    colKey: 'created_at',
    title: '创建时间',
    width: 220,
    cell: (_h, { row }) => {
      return dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'updated_at',
    title: '更新时间',
    width: 220,
    cell: (_h, { row }) => {
      return dayjs(row.updated_at).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];
const myRequestTableColumns = [
  ...commonTableColumns,
  {
    colKey: 'operation',
    title: '操作',
    cell: (_h, { row }) => {
      return (
        <t-space>
          <t-link theme="primary" onClick={() => showDetail(row)}>
            查看详情
          </t-link>
        </t-space>
      );
    },
  },
];
const myApproveTableColumns = [
  ...commonTableColumns,
  { colKey: 'user_code', title: '发起人', width: 160 },
  {
    colKey: 'operation',
    title: '操作',
    cell: (_h, { row }) => {
      return (
        <t-space>
          <t-link theme="primary" onClick={() => showDetail(row)}>
            查看详情
          </t-link>
          <t-link theme="primary">前往审批</t-link>
        </t-space>
      );
    },
  },
];
const tableLoading = ref(false);
const myRequestTableData = ref([]);
const myApproveTableData = ref([]);
const detailVisible = ref(false);
const currentShowDetailsData = ref(null);

const showDetail = (data: MyRequestListData | MyApprovalListData) => {
  detailVisible.value = true;
  currentShowDetailsData.value = data;
};

const loadMyRequestList = () => {
  useRequest({
    url: '/approval/myRequestList',
    methods: 'POST',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '获取我发起的审批列表数据失败[Main]',
          content: json.errmsg,
        });
        return;
      }
      myRequestTableData.value = json.data as MyRequestListData[];
    },
    error: function (err) {
      NotifyPlugin.error({
        title: '获取我发起的审批列表数据失败[Error]',
        content: '错误：' + err,
      });
    },
  });
};

const loadMyApprovalList = () => {
  useRequest({
    url: '/approval/myApprovalList',
    methods: 'POST',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '获取待我审批列表数据失败[Main]',
          content: json.errmsg,
        });
        return;
      }
      myApproveTableData.value = json.data as MyApprovalListData[];
    },
    error: function (err) {
      NotifyPlugin.error({
        title: '获取待我审批列表失败[Error]',
        content: '错误：' + err,
      });
    },
  });
};

onMounted(() => {
  loadMyRequestList();
  loadMyApprovalList();
});
</script>

<script lang="tsx">
export default defineComponent({
  name: 'AuditProgress',
});
</script>

<style lang="scss" scoped>
.audit-detail {
  display: flex;
  flex-direction: row;
  gap: 16px;
  > div {
    width: 50%;
  }
  &:deep(.application-info-wrapper) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .detail-info,
    .application-info {
      .detail-info-header__title,
      .application-info-header__title {
        font: var(--td-font-title-small);
      }

      .application-info-item {
        display: flex;
        align-items: center;
      }

      .detail-info-body {
        background-color: var(--td-bg-color-container-hover);
        padding: 8px;
        border-radius: 10px;

        .detail-info-item,
        .application-info-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 0;
          .detail-info-body__title {
            color: var(--td-text-color-secondary);
          }
        }
      }

      .application-info-body,
      .detail-info-body {
        margin-left: 4px;
      }

      .application-info-item {
        display: flex;
        flex-direction: row;
        gap: 6px;
        padding: 12px 0;
        .application-info-body__title {
          color: var(--td-text-color-secondary);
        }
      }
    }
  }
}
</style>
