<template>
  <div>
    <div style="margin-bottom: 16px">
      <t-button variant="outline" theme="primary" size="large" @click="handleAddInternetCode">
        <template #icon>
          <AddRectangleIcon />
        </template>
        添加上网码
      </t-button>
    </div>
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
import { computed, onMounted, reactive, ref } from 'vue';
import {
  Button,
  DatePicker,
  DialogPlugin,
  FilterValue,
  Form,
  FormItem,
  FormProps,
  Input,
  InputNumber,
  MessagePlugin,
  NotifyPlugin,
  Space,
  TableProps,
} from 'tdesign-vue-next';
import { AddRectangleIcon } from 'tdesign-icons-vue-next';
import useRequest from '@hooks/useRequest';
import dayjs from 'dayjs';

defineProps({
  handleChangeComponent: Function,
});
// (`id`, `code`, `can_use`, `used`, `timeout`, `creator`, `update_at`)
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
    title: '上网码',
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
    colKey: 'can_use',
    title: '可使用次数/已使用次数',
    cell: (h, { row }) => {
      return (
        <div>
          <span>
            {row.can_use} / {row.used}
          </span>
        </div>
      );
    },
  },
  {
    colKey: 'timeout',
    title: '过期时间',
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
    cell: (h, { row }) => {
      return dayjs(row?.timeout).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  { colKey: 'creator', title: '创建人', sorter: true },
  {
    colKey: 'update_at',
    title: '更新时间',
    sortType: 'all',
    cell: (h, { row }) => {
      return dayjs(row?.update_at).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'operation',
    title: '操作',
    cell: (h, { row }) => {
      return (
        <t-space>
          <t-popconfirm theme="danger" content="确认删除吗？" onConfirm={() => handleDelInternetCode(row.id)}>
            <t-link theme="danger">删除</t-link>
          </t-popconfirm>
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
const formData: FormProps['data'] = reactive({
  code: '',
  can_use: 1,
  timeout: '',
});
const formRules: FormProps['rules'] = {
  code: [
    { required: true, message: '请输入上网码', trigger: 'submit' },
    { required: true, message: '请输入上网码', trigger: 'change' },
  ],
  can_use: [
    { required: true, message: '请输入可使用次数', trigger: 'submit' },
    { required: true, message: '请输入可使用次数', trigger: 'change' },
  ],
  timeout: [
    { required: true, message: '请输入过期时间', trigger: 'submit' },
    { required: true, message: '请输入过期时间', trigger: 'change' },
  ],
};

const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
  if (validateResult === true) {
    const { code, can_use, timeout } = formData;
    const loading = MessagePlugin.loading('加载中...');
    useRequest({
      url: '/network-portal/internetCodeAdd',
      methods: 'POST',
      data: {
        code,
        can_use,
        timeout,
      },
      success: function (res) {
        const RES = JSON.parse(res);
        if (RES.errcode !== 0) {
          NotifyPlugin.error({
            title: '添加上网码失败[Main]',
            content: `因为：${RES.errmsg}`,
          });
          return;
        }
        NotifyPlugin.success({
          title: '添加上网码成功',
          content: `新增了id为[${RES.data.id}]的上网码，内容：[${code}]，可使用次数为[${can_use}次]，过期时间为[${timeout}]`,
        });
      },
      error: function (err) {
        NotifyPlugin.error({
          title: '添加上网码失败[Error]',
          content: err,
        });
      },
      complete: function () {
        MessagePlugin.close(loading);
      },
    });
  }
};

const handleAddInternetCode = () => {
  const presets = ref({
    '1天后': dayjs().toDate(),
    '3天后': dayjs().add(3, 'day').toDate(),
    '7天后': dayjs().add(7, 'day').toDate(),
    '15天后': dayjs().add(15, 'day').toDate(),
    '30天后': dayjs().add(30, 'day').toDate(),
    '∞️': dayjs('9999-12-31').toDate(),
  });
  const Dialog = DialogPlugin({
    header: '新增上网码',
    width: 680,
    body: () => {
      return (
        <div>
          <Form rules={formRules} data={formData} onSubmit={onSubmit}>
            <FormItem label="上网码" name="code">
              <Input v-model={formData.code} placeholder="请输入上网码" />
            </FormItem>
            <FormItem label="可使用次数" name="can_use">
              <InputNumber v-model={formData.can_use} placeholder="请输入可使用次数" />
            </FormItem>
            <FormItem label="过期时间" name="timeout">
              <DatePicker
                enable-time-picker
                v-model={formData.timeout}
                presets={presets.value}
                placeholder="请选择过期时间"
              />
            </FormItem>
            <FormItem>
              <div style="display: flex;flex-direction: row;gap: 8px;width: 100%;justify-content: flex-end;">
                <div style="width: 20%;">
                  <Button block theme="default" onClick={() => Dialog.destroy()}>
                    取消
                  </Button>
                </div>
                <div style="width: 20%;">
                  <Button block type="submit" onClick={() => Dialog.destroy()}>
                    提交
                  </Button>
                </div>
              </div>
            </FormItem>
          </Form>
        </div>
      );
    },
    footer: null,
    onClose: () => {
      Dialog.destroy();
    },
  });
};
const handleDelInternetCode = (id: number) => {
  useRequest({
    url: '/network-portal/internetCodeDel',
    methods: 'POST',
    data: {
      id: id,
    },
    success: function (res) {
      var RES = JSON.parse(res);
      if (RES.errcode !== 0) {
        NotifyPlugin('success', {
          title: '删除上网码失败[Main]',
          content: RES.errmsg,
        });
        return;
      }
      NotifyPlugin('success', {
        title: '删除上网码成功',
        content: `删除了ID为${id}的上网码`,
      });
      initTableData();
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin('error', {
        title: '删除上网码失败[Error]',
        content: err,
      });
    },
  });
};

const initTableData = () => {
  const { current: currentPage, pageSize } = tablePagination.value;
  tableLoading.value = true;
  try {
    useRequest({
      url: '/network-portal/internetCodeList',
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        tableData.value = RES.data;
        tableData_Backup.value = RES.data;
        // 保留分页
        const total = tableData.value.length;
        const totalPages = Math.max(Math.ceil(total / pageSize), 1);
        const newCurrentPage = currentPage > totalPages ? totalPages : currentPage;
        tablePagination.value.current = newCurrentPage;
        tablePagination.value.pageSize = pageSize;
      },
      error: function (err) {
        console.error(err);
        NotifyPlugin('error', {
          title: '获取上网认证:上网码列表失败',
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
  name: 'NetworkCode',
};
</script>
