<template>
  <!---->
  <div
    style="
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font: var(--td-font-headline-large);
      padding-left: 12px;
    "
  >
    <div>系统日志</div>
    <div style="display: flex; gap: 8px">
      <t-radio-group :value="DayPicker" :on-change="RadioChange">
        <t-radio-button value="1">今天</t-radio-button>
        <t-radio-button value="2">近三天</t-radio-button>
        <t-radio-button value="3">近七天</t-radio-button>
      </t-radio-group>
      <t-date-picker
        :value="DatePicker"
        :disable-date="InitDateDateSelectData"
        :on-pick="PickerDate"
        value-type="YYYY-MM-DD"
      />
    </div>
  </div>
  <div>
    <t-table
      row-key="time"
      :columns="table_Columns"
      :data="table_Data"
      :sort="table_Sort"
      :loading="table_Loading"
      :pagination="table_Pagination"
      cell-empty-content="-"
      stripe
      @sort-change="sortChange"
      @select-change="handleTableSelectChange"
      @page-change="onPageChange"
    >
    </t-table>
  </div>
</template>

<script setup lang="jsx">
import { ref, reactive, computed, onMounted } from 'vue';
import { NotifyPlugin } from 'tdesign-vue-next';
import useRequest from '../../hooks/useRequest';
import { getToken } from '../../hooks/common';

defineProps({
  handleChangeComponent: Function,
});
// 列定义
const table_Columns = ref([
  {
    colKey: 'time',
    title: '时间',
    sortType: 'all',
    sorter: true,
    width: '220',
    cell: (h, { row }) => {
      return (
        [
          new Date(row.time).getFullYear(),
          new Date(row.time).getMonth() + 1 <= 9
            ? '0' + (new Date(row.time).getMonth() + 1)
            : new Date(row.time).getMonth() + 1,
          new Date(row.time).getDate() <= 9 ? '0' + new Date(row.time).getDate() : new Date(row.time).getDate(),
        ].join('-') +
        ' ' +
        new Date(row.time).toTimeString().substring(0, 8) +
        '.' +
        new Date(row.time).getMilliseconds()
      );
    },
  },
  { colKey: 'event', title: '日志标题', ellipsis: true },
  { colKey: 'log', title: '内容', ellipsis: true },
  {
    colKey: 'status',
    title: '类型',
    width: '170',
    sortType: 'all',
    sorter: true,
    cell: (h, { row }) => (
      <t-tag
        shape="square"
        theme={row.status === 0 ? 'success' : row.status === 1 ? 'danger' : row.status === 2 ? 'warning' : 'primary'}
        variant="light-outline"
      >
        {row.status === 0 ? '正常' : row.status === 1 ? '错误' : row.status === 2 ? '告警' : '记录'}
      </t-tag>
    ),
  },
  { colKey: 'USER_code', title: '用户Code', width: '160' },
  { colKey: 'USER_ip', title: '用户ip地址' },
  { colKey: 'url', title: '访问地址', ellipsis: true },
  { colKey: 'version', title: '后端版本', width: '160' },
]);

const table_Data = ref([]);
const table_BackData = ref([]);
const table_Sort = reactive({ sortBy: 'time', descending: true });
const table_Loading = ref(false);
const Data = ref([]);
const DateSelectData = ref([]);
const DatePicker = ref(new Date().toLocaleDateString());
const DayPicker = ref('1');

const table_Pagination = computed(() => ({
  current: 1,
  pageSize: 25,
  pageSizeOptions: [25, 75, 115, 150],
  total: table_Data.value.length,
  showJumper: true,
}));

const getToday = (e = new Date()) => {
  const y = e.getFullYear();
  const m = e.getMonth() + 1;
  const d = e.getDate();
  return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
};

const InitTableData = (date = getToday(), push = false) => {
  InitDatePickerData();
  table_Loading.value = true;
  const TOKEN = getToken();
  useRequest({
    url: '/log/system',
    methods: 'POST',
    data: { date: date || '' },
    header: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', token: TOKEN },
    success: (res) => {
      const RES = JSON.parse(res);
      if (!RES.data.length) {
        if (!push) table_Data.value = [];
        return;
      }
      if (push) {
        RES.data[0].data.forEach((item, idx) => {
          table_Data.value.push(item);
          if (idx === RES.data[0].data.length - 1) {
            table_Loading.value = false;
            table_BackData.value = [...table_Data.value];
          }
        });
      } else {
        Data.value = RES.data;
        table_Data.value = RES.data[0].data;
        table_BackData.value = [...RES.data[0].data];
        table_Loading.value = false;
      }
    },
    error: (err) => {
      table_Loading.value = false;
      console.error(err);
      NotifyPlugin.error({ title: '获取日志内容失败', content: err, duration: 5000 });
    },
  });
};

const CleanTable = () => {
  table_Data.value = [];
};

const InitDatePickerData = () => {
  table_Loading.value = true;
  const TOKEN = getToken();
  useRequest({
    url: '/log/getFileDate',
    methods: 'POST',
    data: { type: 'SYSTEM' },
    header: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', token: TOKEN },
    success: (res) => {
      const RES = JSON.parse(res);
      DateSelectData.value = RES.data.map((i) => i.date);
      table_Loading.value = false;
    },
    error: (err) => {
      table_Loading.value = false;
      console.error(err);
      NotifyPlugin.error({ title: '获取日志日期失败', content: err, duration: 5000 });
    },
  });
};

const PickerDate = (e) => {
  DatePicker.value = e;
  DayPicker.value = e.toLocaleDateString() === new Date().toLocaleDateString() ? '1' : '0';
  if (DateSelectData.value.includes(e.toLocaleDateString())) {
    InitTableData(getToday(e));
  } else {
    NotifyPlugin.error({ title: '日期选择错误', content: '请检查日期是否正确', duration: 5000 });
  }
};

const RadioChange = (e) => {
  DayPicker.value = e;
  let first = true;
  if (e === '1') {
    InitTableData();
  } else {
    CleanTable();
    const days = e === '2' ? 3 : 7;
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      InitTableData(getToday(d), !first);
      first = false;
    }
  }
};

const InitDateDateSelectData = (e) => !DateSelectData.value.includes(getToday(e));

const sortChange = (e) => {
  table_Sort.sortBy = e.sortBy;
  table_Sort.descending = e.descending;
  TableSortData();
};

const TableSortData = () => {
  const data = [...table_Data.value];
  table_Data.value = table_Sort
    ? data.sort((a, b) =>
        table_Sort.descending
          ? b[table_Sort.sortBy] - a[table_Sort.sortBy]
          : a[table_Sort.sortBy] - b[table_Sort.sortBy],
      )
    : [...table_BackData.value];
};

const handleTableSelectChange = (value, { selectedRowData }) => {};

const onPageChange = (pageInfo) => {
  table_Pagination.value.current = pageInfo.current;
  table_Pagination.value.pageSize = pageInfo.pageSize;
};

onMounted(() => {
  InitTableData();
});
</script>

<script lang="jsx">
export default {
  name: 'LogSystem',
};
</script>

<style></style>
