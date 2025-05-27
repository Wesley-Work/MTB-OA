<template>
  <!---->
  <div style="margin-top: 16px">
    <t-table
      row-key="id"
      :columns="tableColumns"
      :data="tableData"
      select-on-row-click
      cell-empty-content="-"
      bordered
      :reserve-selected-row-on-paginate="false"
      :loading="TableLoading"
      :pagination="tablePagination"
      :filter-value="tableFilterValue"
      @select-change="handleTableSelectChange"
      @page-change="onPageChange"
      @filter-change="onFilterChange"
    >
    </t-table>
  </div>
</template>

<script lang="tsx" setup>
import { FilterValue, NotifyPlugin, TableProps } from 'tdesign-vue-next';
import useRequest from '../../hooks/useRequest';
import { getToken } from '../../hooks/common';
import { computed, onMounted, ref } from 'vue';
import { isNumber } from 'lodash-es';

defineProps({
  handleChangeComponent: Function,
});
const tableColumns = [
  { colKey: 'id', title: '借出编号', width: '100' },
  {
    colKey: 'lender',
    title: '借出人',
    width: '160',
    align: 'center',
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入进行过滤',
      },
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'user',
    title: '使用人',
    width: '160',
    align: 'center',
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入进行过滤',
      },
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'eqname',
    title: '设备名称',
    width: '200',
    align: 'center',
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入进行过滤',
      },
      showConfirmAndReset: true,
    },
  },
  {
    colKey: 'eqcode',
    title: '设备Code',
    width: '200',
    align: 'center',
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入进行过滤',
      },
      showConfirmAndReset: true,
    },
  },
  { colKey: 'lendtime', title: '借出时间', width: '220', align: 'center' },
  {
    colKey: 'returner',
    title: '归还人',
    width: '160',
    align: 'center',
    filter: {
      type: 'input',
      resetValue: '',
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '输入进行过滤',
      },
      showConfirmAndReset: true,
    },
  },
  { colKey: 'returntime', title: '归还时间', width: '220', align: 'center' },
  { colKey: 'remark', title: '备注', align: 'center' },
  {
    colKey: 'status',
    title: '状态',
    width: '240',
    align: 'center',
    filter: {
      type: 'single',
      list: [
        { label: '归档', value: 0 },
        { label: '未归还', value: 1 },
      ],
      showConfirmAndReset: true,
    },
    cell: (h, { row }) => {
      return (
        <t-tag theme={row.status == 0 ? 'success' : row.status == 1 ? 'warning' : 'danger'} variant="light-outline">
          {row.status == 0 ? '归档' : row.status == 1 ? '未归还' : row.status}
        </t-tag>
      );
    },
  },
];
const tableFilterValue = ref({});
const tableData = ref([]);
const tableData_Backup = ref([]);
const SelectData = ref([]);
const Total = ref(0);
const TableLoading = ref(false);
const tablePagination = computed(() => {
  {
    return {
      current: 1,
      pageSize: 25,
      pageSizeOptions: [25, 75, 100, 175],
      total: Total.value,
      showJumper: true,
    };
  }
});
const loadTotal = () => {
  var TOKEN = getToken();
  try {
    useRequest({
      url: '/record/count',
      methods: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        token: TOKEN,
      },
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode == 0) {
          Total.value = RES.data.total;
        } else {
          NotifyPlugin('error', {
            title: '获取设备借出列表总数失败',
            content: RES.errmsg,
            duration: 5000,
          });
        }
      },
      error: function (err) {
        console.error(err);
        NotifyPlugin('error', {
          title: '获取设备借出列表总数失败',
          content: err,
          duration: 5000,
        });
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const loadData = () => {
  var TOKEN = getToken();
  TableLoading.value = true;
  try {
    useRequest({
      url: '/record/listV2',
      methods: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        token: TOKEN,
      },
      data: {
        limit: tablePagination.value.pageSize,
        offset: (tablePagination.value.current - 1) * tablePagination.value.pageSize,
      },
      success: function (res) {
        var RES = JSON.parse(res);
        TableLoading.value = false;
        if (RES.errcode == 0) {
          // 数据倒序
          tableData.value = RES.data;
          tableData_Backup.value = RES.data;
        } else {
          NotifyPlugin('error', {
            title: '获取设备借出列表失败',
            content: RES.errmsg,
            duration: 5000,
          });
        }
      },
      error: function (err) {
        TableLoading.value = false;
        console.error(err);
        NotifyPlugin('error', {
          title: '获取设备借出列表失败',
          content: err,
          duration: 5000,
        });
      },
    });
  } catch (e) {
    console.error(e);
    TableLoading.value = false;
  }
};

/**
 * @filterTableData
 * @筛选表格数据
 */
const filterTableData = (filters: FilterValue) => {
  tableData.value = JSON.parse(
    JSON.stringify(
      tableData_Backup.value.filter((item) => {
        let result = true;
        if (result && filters.lender) {
          // 忽略大小写且模糊匹配
          result = item.lender.toLowerCase().includes(filters.lender.toLowerCase());
        } else if (result && filters.user) {
          // 忽略大小写且模糊匹配
          result = item.user.toLowerCase().includes(filters.user.toLowerCase());
        } else if (result && filters.eqname) {
          // 忽略大小写且模糊匹配
          result = item.eqname.toLowerCase().includes(filters.eqname.toLowerCase());
        } else if (result && filters.eqcode) {
          // 这个不模糊匹配
          result = item.eqcode.toLowerCase() === filters.eqcode.toLowerCase();
        } else if (result && filters.returner) {
          // 忽略大小写且模糊匹配
          result = item.returner.toLowerCase().includes(filters.returner.toLowerCase());
        } else if (isNumber(filters.status)) {
          result = item.status === filters.status;
        }
        return result;
      }),
    ),
  );
};

const onFilterChange: TableProps['onFilterChange'] = (filters) => {
  tableFilterValue.value = {
    ...filters,
  };
  filterTableData(filters);
};

const handleTableSelectChange = (_value, { selectedRowData }) => {
  SelectData.value = selectedRowData;
};

const onPageChange = (pageInfo) => {
  tablePagination.value.current = pageInfo.current;
  tablePagination.value.pageSize = pageInfo.pageSize;
  loadData();
};

onMounted(() => {
  loadTotal();
  loadData();
});
</script>

<script lang="tsx">
export default {
  name: 'LendList',
};
</script>

<style></style>
