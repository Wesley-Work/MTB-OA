<template>
  <!---->
  <div>
    <t-table
      row-key="id"
      max-height="100%"
      :columns="tableColumns"
      :data="tableData"
      select-on-row-click
      cell-empty-content="-"
      bordered
      :reserve-selected-row-on-paginate="false"
      :loading="TableLoading"
      class="need-full-section table-has-pagination"
    >
    </t-table>
  </div>
</template>

<script lang="tsx" setup>
import { NotifyPlugin } from 'tdesign-vue-next';
import useRequest from '@hooks/useRequest';
import { getToken } from '@hooks/common';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { BrowseIcon } from 'tdesign-icons-vue-next';

dayjs.extend(utc);

defineProps({
  handleChangeComponent: Function,
});
const tableColumns = [
  { colKey: 'id', title: '编号', width: '100' },
  {
    colKey: 'name',
    title: '姓名',
    width: '200',
    align: 'center',
  },
  {
    colKey: 'usercode',
    title: '用户Code',
    width: '200',
    align: 'center',
  },
  {
    colKey: 'login_time',
    title: '登陆时间',
    width: '220',
    align: 'center',
    cell: (h, { row }) => {
      return dayjs.utc(row.login_time).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'timeout',
    title: '登录过期时间',
    width: '220',
    align: 'center',
    cell: (h, { row }) => {
      return dayjs.unix(row.timeout).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'renewalLimit',
    title: '密钥可续期时间',
    width: '220',
    align: 'center',
    cell: (h, { row }) => {
      return dayjs.unix(row.renewalLimit).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'TOKEN',
    title: '密钥',
    align: 'center',
    cell: (h, { row }) => {
      return (
        <div>
          <span>{row.showToken && row.TOKEN}</span>
          {row.showToken ? null : (
            <BrowseIcon
              onClick={() => {
                row.showToken = true;
              }}
            />
          )}
        </div>
      );
    },
  },
  {
    colKey: 'operation',
    title: '操作',
    align: 'center',
    cell: (h, { row }) => {
      return (
        <div>
          <t-button
            theme="danger"
            variant="outline"
            onClick={() => {
              kickOut(row);
            }}
          >
            踢下线
          </t-button>
        </div>
      );
    },
  },
];
const tableData = ref([]);
const tableData_Backup = ref([]);
const TableLoading = ref(false);

const kickOut = (row) => {
  const { id } = row;

  var TOKEN = getToken();
  TableLoading.value = true;
  try {
    useRequest({
      url: '/user/online-user/kick-out',
      methods: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        token: TOKEN,
      },
      data: {
        id: id,
      },
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode == 0) {
          NotifyPlugin('success', {
            title: '踢下线成功',
            content: RES.errmsg,
            duration: 5000,
          });
        } else {
          NotifyPlugin('error', {
            title: '踢下线失败',
            content: RES.errmsg,
            duration: 5000,
          });
        }
      },
      error: function (err) {
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
  } finally {
    loadData();
  }
};

const loadData = () => {
  var TOKEN = getToken();
  TableLoading.value = true;
  try {
    useRequest({
      url: '/user/online-user',
      methods: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        token: TOKEN,
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

onMounted(() => {
  loadData();
});
</script>

<script lang="tsx">
export default {
  name: 'LendList',
};
</script>

<style></style>
