<template>
  <div style="padding-top: 16px">
    <t-table
      row-key="id"
      :columns="tableColumns"
      :data="tableData"
      select-on-row-click
      :reserve-selected-row-on-paginate="false"
      :sort="tableSort"
      :pagination="tablePagination"
      :loading="tableLoading"
      :filter-value="tableFilterValue"
      cell-empty-content="-"
      stripe
      bordered
      @sort-change="sortChange"
      @page-change="onPageChange"
      @filter-change="onFilterChange"
    >
    </t-table>
  </div>
</template>

<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue';
import { FilterValue, NotifyPlugin, TableProps } from 'tdesign-vue-next';
import useRequest from '@hooks/useRequest';

defineProps({
  handleChangeComponent: Function,
});
const tableColumns = [
  {
    colKey: 'id',
    title: 'id',
    sortType: 'all',
    sorter: true,
    width: '80',
  },
  {
    colKey: 'code',
    title: '账号Code',
    sortType: 'all',
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
    colKey: 'name',
    title: '用户',
    sortType: 'all',
    ellipsis: true,
    ellipsisTitle: false,
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
    colKey: 'mac',
    title: '绑定MAC',
    sortType: 'all',
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
  { colKey: 'lastverify_timestamp', title: '上次认证时间', sorter: true },
  { colKey: 'remark', title: '备注', sortType: 'all' },
  {
    colKey: 'operation',
    title: '操作',
    cell: (h, { row }) => {
      return (
        <t-space>
          <t-link theme="danger">删除</t-link>
        </t-space>
      );
    },
  },
];
const tableData = ref([]);
const tableData_Backup = ref([]);
const tableSort = ref({
  sortBy: 'id',
  descending: false,
});
const tableLoading = ref(false);
const tableFilterValue = ref({});
const tablePagination = computed(() => {
  return {
    current: 1,
    pageSize: 25,
    pageSizeOptions: [25, 75, 115, 150],
    total: tableData.value.length,
    showJumper: true,
  };
});

const initTableData = () => {
  const { current: currentPage, pageSize } = tablePagination.value;
  tableLoading.value = true;
  try {
    useRequest({
      url: '/network-portal/bindList',
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        tableData.value = RES.data;
        tableData_Backup.value = RES.data;
        // 保留分页
        const total = tableData.value.length;
        const totalPages = Math.ceil(total / pageSize);
        const newCurrentPage = currentPage > totalPages ? totalPages : currentPage;
        tablePagination.value.current = newCurrentPage;
        tablePagination.value.pageSize = pageSize;
      },
      error: function (err) {
        console.error(err);
        NotifyPlugin('error', {
          title: '获取上网认证:绑定信息列表失败',
          content: err,
          duration: 5000,
        });
      },
      complete: function () {
        tableLoading.value = false;
      },
    });
  } catch (e) {
    console.error(e);
  }
};

// 表格排序
const sortChange = (e) => {
  tableSort.value = e;
  tableSortData();
};

// 表格排序子函数
const tableSortData = () => {
  var data = tableData.value;
  var sort = tableSort.value;
  if (sort) {
    tableData.value = data
      .concat()
      .sort((a, b) =>
        sort.descending
          ? Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' }).compare(a[sort.sortBy], b[sort.sortBy])
          : Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' }).compare(b[sort.sortBy], a[sort.sortBy]),
      );
  } else {
    tableData.value = tableData_Backup.value;
  }
};

// 表格分页变更
const onPageChange = (pageInfo, _context) => {
  tablePagination.value.current = pageInfo.current;
  tablePagination.value.pageSize = pageInfo.pageSize;
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
        if (result && filters.eq_name) {
          // 忽略大小写且模糊匹配
          result = item.eq_name.toLowerCase().includes(filters.eq_name.toLowerCase());
        } else if (result && filters.eq_code) {
          // 忽略大小写且模糊匹配
          result = item.eq_code.toLowerCase().includes(filters.eq_code.toLowerCase());
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

onMounted(() => {
  initTableData();
});
</script>

<script lang="tsx">
export default {
  name: 'NetworkPortal',
};
</script>
