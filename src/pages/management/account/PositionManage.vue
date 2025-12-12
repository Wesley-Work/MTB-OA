<template>
  <div class="position-manage need-full-section">
    <div class="toolbar">
      <t-button theme="primary" variant="outline" @click="openAdd">新增职位</t-button>
    </div>

    <t-table
      row-key="id"
      max-height="100%"
      :columns="tableColumns"
      :data="tableData"
      cell-empty-content="-"
      bordered
      :loading="tableLoading"
      :filter-value="tableFilterValue"
      :pagination="tablePagination"
      class="table-has-pagination"
      @filter-change="onFilterChange"
      @page-change="onPageChange"
    />

    <t-dialog
      v-model:visible="dialog.visible"
      :header="dialogTitle"
      :confirm-btn="{ content: '保存' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="onSave"
      @cancel="closeDialog"
    >
      <t-form :data="form" label-width="100px" colon>
        <t-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称' }]">
          <t-input v-model="form.name" maxlength="50" />
        </t-form-item>
        <t-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择类型' }]">
          <t-select v-model="form.type" placeholder="请选择">
            <t-option :value="0" label="系统职位" />
            <t-option :value="1" label="组内职位" />
          </t-select>
        </t-form-item>
        <t-form-item label="管理职位" name="isAdmin">
          <t-switch v-model="form.isAdmin" size="large" />
        </t-form-item>
        <t-form-item label="超管职位" name="isOwner">
          <t-switch v-model="form.isOwner" size="large" />
        </t-form-item>
        <t-form-item
          v-if="form.type === 1"
          label="组别"
          name="group_id"
          :rules="[{ required: true, message: '请选择组别' }]"
        >
          <t-select v-model="form.group_id" placeholder="请选择组别" style="width: 260px">
            <t-option v-for="g in groupOptions" :key="g.value" :value="g.value" :label="g.label" />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="tsx" setup>
import { computed, onMounted, ref } from 'vue';
import { FilterValue, NotifyPlugin, TableProps } from 'tdesign-vue-next';
import useRequest from '@/hooks/useRequest';
import { getToken } from '@/hooks/common';

type PositionItem = {
  id: number;
  name: string;
  isAdmin: number; // 0/1
  isOwner: number; // 0/1
  type: number; // 0 系统职位，1 组内职位
  notRemove: number; // 0/1
  group_id?: number | null;
  create_time?: string;
};

const tableData = ref<PositionItem[]>([]);
const tableDataBackup = ref<PositionItem[]>([]);
const tableLoading = ref(false);
const tableFilterValue = ref({});
const Total = ref(0);
const groupOptions = ref<{ label: string; value: number }[]>([]);
const groupMap = ref<Record<number, string>>({});
const tablePagination = computed(() => {
  return {
    current: 1,
    pageSize: 25,
    pageSizeOptions: [25, 50, 100, 200],
    total: Total.value,
    showJumper: true,
  };
});

const tableColumns: TableProps['columns'] = [
  { colKey: 'id', title: 'ID', width: 80, align: 'center' },
  {
    colKey: 'name',
    title: '名称',
    width: 200,
    align: 'center',
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: { placeholder: '输入进行过滤' },
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'type',
    title: '类型',
    width: 140,
    align: 'center',
    cell: (h, { row }) => (
      <t-tag theme={row.type === 1 ? 'primary' : 'default'} variant="light-outline">
        {row.type === 1 ? '组内职位' : '系统职位'}
      </t-tag>
    ),
    filter: {
      type: 'single',
      list: [
        { label: '系统职位', value: 0 },
        { label: '组内职位', value: 1 },
      ],
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'isAdmin',
    title: '管理职位',
    width: 120,
    align: 'center',
    cell: (h, { row }) => (
      <t-tag theme={row.isAdmin ? 'success' : 'default'} variant="light-outline">
        {row.isAdmin ? '是' : '否'}
      </t-tag>
    ),
    filter: {
      type: 'single',
      list: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'isOwner',
    title: '超管职位',
    width: 120,
    align: 'center',
    cell: (h, { row }) => (
      <t-tag theme={row.isOwner ? 'warning' : 'default'} variant="light-outline">
        {row.isOwner ? '是' : '否'}
      </t-tag>
    ),
    filter: {
      type: 'single',
      list: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'notRemove',
    title: '不可删除',
    width: 120,
    align: 'center',
    cell: (h, { row }) => (
      <t-tag theme={row.notRemove ? 'danger' : 'default'} variant="light-outline">
        {row.notRemove ? '是' : '否'}
      </t-tag>
    ),
    filter: {
      type: 'single',
      list: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'group_id',
    title: '组别',
    width: 100,
    align: 'center',
    cell: (h, { row }) => (
      <span>{row.group_id != null && groupMap.value[row.group_id] ? groupMap.value[row.group_id] : '-'}</span>
    ),
  },
  { colKey: 'create_time', title: '创建时间', width: 180, align: 'center' },
  {
    colKey: 'operation',
    title: '操作',
    width: 220,
    align: 'center',
    cell: (h, { row }) => (
      <t-space>
        <t-link theme="primary" hover="color" onClick={() => openEdit(row)}>
          编辑
        </t-link>
        <t-popconfirm theme="danger" content="确认删除该职位？" placement="left" onConfirm={() => onDelete(row)}>
          <t-link theme="danger" hover="color" disabled={row.notRemove === 1}>
            删除
          </t-link>
        </t-popconfirm>
      </t-space>
    ),
  },
];

function headers() {
  return {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    token: getToken(),
  };
}

function loadData() {
  tableLoading.value = true;
  useRequest({
    url: '/position/list',
    methods: 'POST',
    header: headers(),
    success(res) {
      tableLoading.value = false;
      const R = JSON.parse(res);
      if (R.errcode === 0) {
        tableDataBackup.value = R.data || [];
        filterTableData(tableFilterValue.value as FilterValue);
      } else {
        NotifyPlugin.error({ title: '加载职位列表失败', content: R.errmsg, duration: 5000 });
      }
    },
    error(err) {
      tableLoading.value = false;
      console.error(err);
      NotifyPlugin.error({ title: '加载职位列表失败', content: String(err), duration: 5000 });
    },
  });
}

function loadGroups() {
  useRequest({
    url: '/group/list',
    methods: 'POST',
    header: headers(),
    success(res) {
      const R = JSON.parse(res);
      if (R.errcode === 0 && Array.isArray(R.data)) {
        const opts = R.data.map((it: any) => ({ label: it.name, value: Number(it.id) }));
        groupOptions.value = opts;
        const mp: Record<number, string> = {};
        for (const o of opts) mp[o.value] = o.label;
        groupMap.value = mp;
      }
    },
    error(err) {
      console.error(err);
      NotifyPlugin.error({ title: '获取组别列表失败', content: String(err), duration: 5000 });
    },
  });
}

function filterTableData(filters: FilterValue) {
  const filtered = JSON.parse(
    JSON.stringify(
      tableDataBackup.value.filter((item) => {
        let result = true;
        if (result && filters.name) {
          result = String(item.name || '')
            .toLowerCase()
            .includes(String(filters.name).toLowerCase());
        } else if (result && typeof filters.type === 'number') {
          result = item.type === filters.type;
        } else if (result && typeof filters.isAdmin === 'number') {
          result = Number(item.isAdmin) === filters.isAdmin;
        } else if (result && typeof filters.isOwner === 'number') {
          result = Number(item.isOwner) === filters.isOwner;
        } else if (result && typeof filters.notRemove === 'number') {
          result = Number(item.notRemove) === filters.notRemove;
        }
        return result;
      }),
    ),
  );
  Total.value = filtered.length;
  const offset = (tablePagination.value.current - 1) * tablePagination.value.pageSize;
  const limit = tablePagination.value.pageSize;
  tableData.value = filtered.slice(offset, offset + limit);
}

const onFilterChange: TableProps['onFilterChange'] = (filters) => {
  tableFilterValue.value = { ...filters };
  // 重置页码到第一页再筛选
  tablePagination.value.current = 1 as any;
  filterTableData(filters);
};

const onPageChange = (pageInfo) => {
  tablePagination.value.current = pageInfo.current;
  tablePagination.value.pageSize = pageInfo.pageSize;
  filterTableData(tableFilterValue.value as FilterValue);
};

const dialog = ref({ visible: false, editing: false, id: 0 });
const form = ref<{
  id?: number;
  name: string;
  type: number;
  isAdmin: boolean;
  isOwner: boolean;
  group_id: number | null;
}>({
  name: '',
  type: 0,
  isAdmin: false,
  isOwner: false,
  group_id: null,
});

const dialogTitle = computed(() => (dialog.value.editing ? '编辑职位' : '新增职位'));

function openAdd() {
  dialog.value = { visible: true, editing: false, id: 0 };
  form.value = { name: '', type: 0, isAdmin: false, isOwner: false, group_id: null };
}

function openEdit(row: PositionItem) {
  dialog.value = { visible: true, editing: true, id: row.id };
  form.value = {
    id: row.id,
    name: row.name,
    type: row.type,
    isAdmin: !!row.isAdmin,
    isOwner: !!row.isOwner,
    group_id: row.group_id ?? null,
  };
}

function closeDialog() {
  dialog.value.visible = false;
}

function onSave() {
  const payload: any = {
    name: form.value.name?.trim(),
    type: form.value.type,
    isAdmin: form.value.isAdmin ? 1 : 0,
    isOwner: form.value.isOwner ? 1 : 0,
  };
  if (form.value.type === 1) {
    payload.group_id = form.value.group_id;
  }
  if (dialog.value.editing) payload.id = dialog.value.id;

  useRequest({
    url: dialog.value.editing ? '/position/edit' : '/position/add',
    methods: 'POST',
    header: headers(),
    data: payload,
    success(res) {
      const R = JSON.parse(res);
      if (R.errcode === 0) {
        NotifyPlugin.success({ title: '保存成功' });
        dialog.value.visible = false;
        loadData();
      } else {
        NotifyPlugin.error({ title: '保存失败', content: R.errmsg, duration: 5000 });
      }
    },
    error(err) {
      console.error(err);
      NotifyPlugin.error({ title: '保存失败', content: String(err), duration: 5000 });
    },
  });
}

function onDelete(row: PositionItem) {
  useRequest({
    url: '/position/del',
    methods: 'POST',
    header: headers(),
    data: { id: row.id },
    success(res) {
      const R = JSON.parse(res);
      if (R.errcode === 0) {
        NotifyPlugin.success({ title: '删除成功' });
        loadData();
      } else {
        NotifyPlugin.error({ title: '删除失败', content: R.errmsg, duration: 5000 });
      }
    },
    error(err) {
      console.error(err);
      NotifyPlugin.error({ title: '删除失败', content: String(err), duration: 5000 });
    },
  });
}

onMounted(() => {
  loadGroups();
  loadData();
});
</script>

<script lang="tsx">
export default { name: 'PositionManage' };
</script>

<style scoped>
.position-manage {
  padding: 16px;
}
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}
</style>
