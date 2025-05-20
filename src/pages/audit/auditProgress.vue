<template>
  <div class="audit-progress-container">
    height="1210"
      <template #header>
        <div class="header">
          <h3>我的审批</h3>
        </div>
      </template>

      <t-tabs v-model="activeTab">
        <t-tab-panel value="mySubmit" label="我发起的">
          <t-table
            :data="mySubmitList"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            stripe
            hover
            @page-change="onPageChange"
          >
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

        <t-tab-panel value="myApprove" label="待我审批">
          <t-table
            :data="myApproveList"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            stripe
            hover
            @page-change="onPageChange"
          >
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
              <t-button v-if="row.status === 0" variant="text" theme="success" @click="approve(row)">
                审批
              </t-button>
            </template>
          </t-table>
        </t-tab-panel>
      </t-tabs>
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
                  <t-icon
                    :name="getActionIcon(record.action)"
                    :style="{ color: getActionColor(record.action) }"
                  />
                </template>
                <div class="timeline-content">
                  <div class="timeline-title">
                    {{ record.approver_user_name }} ({{ record.approver_user_code }})
                    {{ getActionText(record.action) }}
                  </div>
                  <div class="timeline-time">{{ formatDate(record.created_at) }}</div>
                  <div v-if="record.comment" class="timeline-comment">
                    意见: {{ record.comment }}
                  </div>
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

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { getAuditList, getAuditDetail, operateAudit } from '@/api/audit';

export default defineComponent({
  name: 'AuditProgress',
  setup() {
    const activeTab = ref('mySubmit');
    const loading = ref(false);
    const mySubmitList = ref([]);
    const myApproveList = ref([]);
    const detailVisible = ref(false);
    const approveVisible = ref(false);
    const currentAudit = ref(null);
    
    const approveForm = reactive({
      action: 1,
      comment: '',
    });

    const pagination = reactive({
      current: 1,
      pageSize: 10,
      total: 0,
    });

    const columns = [
      { colKey: 'id', title: 'ID', width: 80 },
      { colKey: 'title', title: '标题' },
      { colKey: 'type', title: '类型', width: 120, cell: 'type' },
      { colKey: 'status', title: '状态', width: 120, cell: 'status' },
      { colKey: 'created_at', title: '创建时间', width: 180 },
      { colKey: 'operation', title: '操作', width: 120, cell: 'operation' },
    ];

    // 获取我发起的审批列表
    const fetchMySubmitList = async () => {
      loading.value = true;
      try {
        const res = await getAuditList({
          status: -1, // 所有状态
          page: pagination.current,
          size: pagination.pageSize,
          isMySubmit: true,
        });
        mySubmitList.value = res.data.list;
        pagination.total = res.data.total;
      } catch (error) {
        console.error('获取我发起的审批列表失败', error);
        MessagePlugin.error('获取审批列表失败');
      } finally {
        loading.value = false;
      }
    };

    // 获取待我审批的列表
    const fetchMyApproveList = async () => {
      loading.value = true;
      try {
        const res = await getAuditList({
          status: 0, // 待审批状态
          page: pagination.current,
          size: pagination.pageSize,
          isMyApprove: true,
        });
        myApproveList.value = res.data.list;
        pagination.total = res.data.total;
      } catch (error) {
        console.error('获取待我审批的列表失败', error);
        MessagePlugin.error('获取审批列表失败');
      } finally {
        loading.value = false;
      }
    };

    // 查看审批详情
    const viewDetail = async (row) => {
      try {
        const res = await getAuditDetail(row.id);
        currentAudit.value = res.data;
        detailVisible.value = true;
      } catch (error) {
        console.error('获取审批详情失败', error);
        MessagePlugin.error('获取审批详情失败');
      }
    };

    // 打开审批操作对话框
    const approve = (row) => {
      currentAudit.value = row;
      approveForm.action = 1;
      approveForm.comment = '';
      approveVisible.value = true;
    };

    // 提交审批操作
    const handleApproveConfirm = async () => {
      try {
        await operateAudit({
          id: currentAudit.value.id,
          action: approveForm.action,
          comment: approveForm.comment,
        });
        MessagePlugin.success('审批操作成功');
        approveVisible.value = false;
        fetchMyApproveList();
      } catch (error) {
        console.error('审批操作失败', error);
        MessagePlugin.error('审批操作失败');
      }
    };

    // 分页变化
    const onPageChange = (current) => {
      pagination.current = current;
      if (activeTab.value === 'mySubmit') {
        fetchMySubmitList();
      } else {
        fetchMyApproveList();
      }
    };

    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        0: '待审批',
        1: '已通过',
        2: '已拒绝',
        3: '已撤销',
      };
      return statusMap[status] || '未知状态';
    };

    // 获取状态主题
    const getStatusTheme = (status) => {
      const themeMap = {
        0: 'warning',
        1: 'success',
        2: 'danger',
        3: 'default',
      };
      return themeMap[status] || 'default';
    };

    // 获取状态变体
    const getStatusVariant = (status) => {
      return status === 0 ? 'light' : 'light';
    };

    // 获取类型文本
    const getTypeText = (type) => {
      const typeMap = {
        1: '设备借出审批',
        3: '任务审批',
      };
      return typeMap[type] || '未知类型';
    };

    // 获取操作图标
    const getActionIcon = (action) => {
      const iconMap = {
        0: 'time',
        1: 'check-circle',
        2: 'close-circle',
        3: 'rollback',
      };
      return iconMap[action] || 'help-circle';
    };

    // 获取操作颜色
    const getActionColor = (action) => {
      const colorMap = {
        0: '#ffaa00',
        1: '#00a870',
        2: '#e34d59',
        3: '#aaaaaa',
      };
      return colorMap[action] || '#aaaaaa';
    };

    // 获取操作文本
    const getActionText = (action) => {
      const textMap = {
        0: '待审批',
        1: '已通过',
        2: '已拒绝',
        3: '已撤销',
      };
      return textMap[action] || '未知操作';
    };

    // 格式化日期
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(
        2,
        '0',
      )}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    // 获取审批基本信息
    const getAuditInfo = () => {
      if (!currentAudit.value) return [];
      
      return [
        { label: '审批ID', content: currentAudit.value.id },
        { label: '审批类型', content: getTypeText(currentAudit.value.type) },
        { label: '审批状态', content: getStatusText(currentAudit.value.status) },
        { label: '创建时间', content: formatDate(currentAudit.value.created_at) },
        { label: '申请人', content: `${currentAudit.value.creator_name} (${currentAudit.value.creator_code})` },
      ];
    };

    // 获取任务审批内容
    const getTaskAuditContent = () => {
      if (!currentAudit.value || !currentAudit.value.details) return [];
      
      const details = typeof currentAudit.value.details === 'string' 
        ? JSON.parse(currentAudit.value.details) 
        : currentAudit.value.details;
      
      return [
        { label: '任务名称', content: details.name },
        { label: '任务内容', content: details.content },
        { label: '预期完成时间', content: details.finally_time },
        { label: '工作地点', content: details.place },
        { label: '备注', content: details.remark || '无' },
      ];
    };

    // 获取设备借出审批内容
    const getEquipmentAuditContent = () => {
      if (!currentAudit.value || !currentAudit.value.details) return [];
      
      const details = typeof currentAudit.value.details === 'string' 
        ? JSON.parse(currentAudit.value.details) 
        : currentAudit.value.details;
      
      return [
        { label: '设备编号', content: details.equipment_code },
        { label: '借出时间', content: details.lend_time },
        { label: '归还时间', content: details.return_time },
        { label: '借出人', content: details.lender },
      ];
    };

    onMounted(() => {
      fetchMySubmitList();
    });

    return {
      activeTab,
      loading,
      mySubmitList,
      myApproveList,
      columns,
      pagination,
      detailVisible,
      approveVisible,
      currentAudit,
      approveForm,
      viewDetail,
      approve,
      handleApproveConfirm,
      onPageChange,
      getStatusText,
      getStatusTheme,
      getStatusVariant,
      getTypeText,
      getActionIcon,
      getActionColor,
      getActionText,
      formatDate,
      getAuditInfo,
      getTaskAuditContent,
      getEquipmentAuditContent,
    };
  },
});
</script>

<style scoped>
.audit-progress-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.audit-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.timeline-title {
  font-weight: 500;
}

.timeline-time {
  font-size: 12px;
  color: #999;
}

.timeline-comment {
  margin-top: 5px;
  padding: 5px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>