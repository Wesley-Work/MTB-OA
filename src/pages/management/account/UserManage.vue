<template>
  <div style="background-color: var(--td-bg-color-container); border-radius: 5px">
    <div style="display: flex; flex-direction: row; padding: 12px; justify-content: space-between">
      <t-space size="small">
        <t-button variant="outline" theme="primary" @click="handleAdd">
          <template #icon>
            <t-icon name="add" />
          </template>
          添加账号
        </t-button>
        <t-popconfirm
          theme="danger"
          content="确认删除？删除后不可恢复！"
          placement="bottom"
          :on-confirm="DeleteAccount"
        >
          <t-button :disabled="SelectData.length === 0" theme="danger">
            <template #icon>
              <t-icon name="delete" />
            </template>
            {{ SelectData.length == 0 ? '删除' : '删除 ' + SelectData.length + ' 个' }}
          </t-button>
        </t-popconfirm>
        <t-button theme="success" @click="exportToXlsx">
          <template #icon>
            <t-icon name="file-export" />
          </template>
          导出账号列表
        </t-button>
        <!-- <t-upload theme="file" accept=".xls,.xlsx" :requestMethod="uploadFile" /> -->
      </t-space>
    </div>
    <div>
      <t-table
        row-key="id"
        :columns="table_Columns"
        :data="tableData"
        select-on-row-click
        :reserve-selected-row-on-paginate="false"
        :sort="tableSort"
        :pagination="tablePagination"
        :loading="tableLoading"
        cell-empty-content="-"
        stripe
        bordered
        @sort-change="sortChange"
        @select-change="handleTableSelectChange"
        @page-change="onPageChange"
      >
      </t-table>
    </div>
  </div>
  <!--Edit Dialog include add-->
  <t-dialog
    v-model:visible="Dialog_Model.edit"
    :header="(actionMode === 'add' ? '新增' : '编辑') + '用户'"
    width="45%"
    :close-btn="false"
    cancel-btn="取消"
    confirm-btn="提 交"
    :on-confirm="submitForm"
    :close-on-esc-keydown="false"
  >
    <mtb-tag t-a-g />
    <div style="width: 100%; margin-top: 8px">
      <t-space direction="horizontal" size="16px" style="width: 100%">
        <t-space direction="vertical" size="12px" style="width: 100%">
          <div style="font-size: 20px; font-weight: 700; color: var(--td-text-color-primary)">基本信息</div>
          <div>
            <t-input v-model="EditUserDialogForm.name" label="用户名称：" type="text" required />
          </div>
          <div>
            <t-input v-model="EditUserDialogForm.code" label="用户Code：" type="text" required />
          </div>
          <div>
            <t-input v-model="EditUserDialogForm.class" label="班级：" type="text" unrequired />
          </div>
          <div>
            <t-input-number
              v-model="EditUserDialogForm.grade"
              theme="column"
              :max="2099"
              :min="2021"
              label="年级："
              unrequired
              style="width: 100%"
            ></t-input-number>
          </div>
          <div>
            <div style="display: flex">
              <t-input
                v-if="actionMode === 'add'"
                v-model="EditUserDialogForm.password"
                required
                label="账户密码："
                type="text"
              />
              <t-input v-else v-model="EditUserDialogForm.password" unrequired label="账户密码：" type="text" />
              <t-button variant="dashed" @click="EditUserDialogForm.password = '123456'">默认密码</t-button>
            </div>
          </div>
        </t-space>
        <t-space direction="vertical" size="12px" style="width: 100%">
          <div style="font-size: 20px; font-weight: 700; color: var(--td-text-color-primary)">其他信息</div>
          <div required>
            <t-button variant="dashed" block @click="showPermissionsDialog">配置权限</t-button>
          </div>
          <div>
            <t-select
              :value="EditUserDialogForm.group"
              :options="groupOptions"
              label="组别："
              placeholder="请选择"
              :on-change="
                (e) => {
                  EditUserDialogForm.group = e;
                }
              "
            />
          </div>
          <div>
            <t-input-number
              v-model="EditUserDialogForm.share_device"
              theme="column"
              :max="99"
              :min="0"
              label="共享设备数："
              style="width: 100%"
            ></t-input-number>
          </div>
          <div style="display: flex; align-items: center">
            <span
              style="
                width: 25%;
                z-index: 2;
                height: 100%;
                text-align: center;
                display: flex;
                align-items: center;
                font-size: var(--td-font-size-body-medium);
                color: var(--td-text-color-primary);
              "
              >加入时间：</span
            >
            <t-date-picker
              style="width: 100%"
              :allow-input="true"
              placeholder="请选择"
              :value="EditUserDialogForm.join_time"
            ></t-date-picker>
          </div>
          <div style="display: flex; align-items: center">
            <span
              style="
                width: 25%;
                z-index: 2;
                height: 100%;
                text-align: center;
                display: flex;
                align-items: center;
                font-size: var(--td-font-size-body-medium);
                color: var(--td-text-color-primary);
              "
              >注册时间：</span
            >
            <t-date-picker
              style="width: 100%"
              :allow-input="true"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              :enable-time-picker="true"
              :value="EditUserDialogForm.reg_time"
            ></t-date-picker>
          </div>
        </t-space>
      </t-space>
    </div>
  </t-dialog>
  <!--Permissions Dialog-->
  <t-dialog
    v-model:visible="Dialog_Model.permissions"
    header="配置权限"
    width="40%"
    :close-btn="false"
    cancel-btn="取消"
    confirm-btn="保存"
    :close-on-esc-keydown="false"
    :destroy-on-close="true"
    :on-close="handlePermissionDialogClose"
    :on-confirm="handleSavePermissions"
  >
    <t-transfer
      v-model="permissionsTransfer.value"
      :data="permissionsTransfer.data"
      :operation="['移除', '添加']"
      class="transfer-horizontal"
      :on-change="handlePermissionsTransferChange"
    >
      <template #title="props">
        <div>{{ props.type === 'target' ? '目标' : '来源' }}</div>
      </template>
      <template #footer="props">
        <div
          v-if="activeGroupPermissions.length !== 0 && props.type === 'target'"
          class="transfer-footer--tagGroup narrow-scrollbar"
        >
          <span v-for="(item, index) in activeGroupPermissions" :key="index">
            <span class="group-permission--item">{{ permissionsTransfer.nameList[item?.val] }}</span>
          </span>
        </div>
      </template>
      <template #transferItem="{ data, index, type }">
        <div :data-transfer-checkbox-id="index" style="margin-left: 8px">
          <t-tag
            v-if="activeGroupPermissions.map((item) => item.val).includes(data.value) && type === 'target'"
            color="rgb(217, 0, 87)"
            variant="light-outline"
            size="small"
            style="margin-right: 4px"
          >
            <span>重复</span>
          </t-tag>
          {{ data.label }}
          <span
            v-if="type === 'target'"
            class="UserCanTSelect"
            @click.prevent="
              () => {
                togglePermissionStatus(data.value);
              }
            "
          >
            <t-tag
              :theme="
                permissionsTransfer.statusList[data.value]?.open === true
                  ? 'success'
                  : permissionsTransfer.statusList[data.value]?.open === false
                  ? 'danger'
                  : 'warning'
              "
              variant="light-outline"
              size="small"
              style="margin-left: 4px"
            >
              <span v-if="permissionsTransfer.statusList[data.value]?.open === true">开启</span>
              <span v-else-if="permissionsTransfer.statusList[data.value]?.open === false">关闭</span>
              <span v-else>⚠ 未知状态</span>
            </t-tag>
          </span>
        </div>
      </template>
    </t-transfer>
    <!-- <PermissionsTransfer :value="permissionsValue" :data="systemPermissionsList" :user="activeUserPermissions" :group="activeGroupPermissions"></PermissionsTransfer> -->
  </t-dialog>
</template>

<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from 'vue';
import dayjs from 'dayjs';
import { NotifyPlugin, TableProps } from 'tdesign-vue-next';
import sha256 from 'crypto-js/sha256';
import useRequest from '@hooks/useRequest';
import { loadSystemPermissions, loadUserPermissionsList } from '@hooks/usePermission.ts';
import { PermissionsArray, userListObject, UserSelectData } from '@type/type.ts';
import { TransferProps } from 'tdesign-vue-next';
import ExcelJS from 'exceljs';

defineProps({
  handleChangeComponent: Function,
});
const vipMaps = [
  { value: 'VIP_Normal', label: 'VIP', class: 'normal-vip' },
  { value: 'VIP_Super', label: 'SVIP', class: 'svip-vip' },
  { value: 'VIP_Admin', label: 'Admin', class: 'admin-vip' },
  { value: 'VIP_Owner', label: 'Owner', class: 'owner-vip' },
];
// 查找vip标签
const renderVip = (remark: string) => {
  var vipObj = vipMaps.find((item) => item.value === remark || remark?.split(',').includes(item.value));
  return vipObj ? vipObj : null;
};
const table_Columns: TableProps['columns'] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 45,
  },
  {
    colKey: 'id',
    title: 'id',
    sortType: 'all',
    sorter: true,
    width: 80,
  },
  {
    colKey: 'code',
    title: 'Code',
    sortType: 'all',
    sorter: true,
    width: 200,
  },
  {
    colKey: 'name',
    title: '姓名',
    cell: (h, { row }) => {
      const v = renderVip(row.remark);
      const commonClass = 'vip-tag';
      return (
        <div style="display: flex;flex-direction: row;align-items: center;">
          <span>{row.name}</span>
          {v ? (
            <div class={`${commonClass} ${v?.class}`}>
              <span>{v?.label}</span>
              <div class="scan-light"></div>
            </div>
          ) : null}
        </div>
      );
    },
  },
  { colKey: 'class', title: '班级', sortType: 'all', sorter: true },
  {
    colKey: 'grade',
    title: '年级',
    sortType: 'all',
    sorter: true,
    width: 120,
    cell: (h, { row }) => {
      return <t-tag>{row.grade + '级'}</t-tag>;
    },
  },
  {
    colKey: 'group',
    title: '组别',
    sortType: 'all',
    sorter: true,
    width: 110,
    cell: (_h, { row }) => {
      return <span>{groupOptions.value.find((item) => item.value === row.group)?.label ?? '-'}</span>;
    },
  },
  {
    colKey: 'reg_time',
    title: '注册日期',
    sortType: 'all',
    sorter: true,
    ellipsis: true,
    cell: (_h, { row }) => {
      return dayjs(row.reg_time).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'join_time',
    title: '加入时间',
    sortType: 'all',
    sorter: true,
    ellipsis: true,
    cell: (_h, { row }) => {
      return dayjs(row.join_time).format('YYYY-MM-DD');
    },
  },
  {
    colKey: 'login_time',
    title: '上次登录时间',
    sortType: 'all',
    sorter: true,
    ellipsis: true,
    cell: (_h, { row }) => {
      return row.login_time ? dayjs(row.login_time).format('YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
  {
    colKey: 'operation',
    title: '操作',
    cell: (h, { row }) => {
      return (
        <t-space>
          <t-link theme="primary" onClick={(e) => handleEdit(e, row)}>
            编辑
          </t-link>
          <t-link theme="danger">删除</t-link>
        </t-space>
      );
    },
  },
  // {
  //     colKey: "status",
  //     title: "账号状态",
  //     sortType: "all",
  //     sorter: true,
  // },
];
const tableData = ref([]);
const tableBackData = ref([]);
const tableSort = ref({
  sortBy: 'id',
  descending: false,
});
const tableLoading = ref(false);
const SelectData = ref<UserSelectData>([]);
const Dialog_Model = reactive({
  permissions: false,
  edit: false,
});
const actionMode = ref('add');
const defaultDialogData = {
  id: null,
  name: null,
  class: null,
  code: null,
  password: null,
  share_device: 2,
  group: null,
  grade: dayjs().year(),
  reg_time: new Date(),
  join_time: new Date(),
};
const EditUserDialogForm = ref<userListObject>({ ...defaultDialogData });
const ResetDialogForm = (use: userListObject = null) => {
  EditUserDialogForm.value = use ? { ...use } : { ...defaultDialogData };
};
// const upload_file_data = ref([]);
const groupOptions = ref([]); // 组列表
// const permissionsValue = ref([]);
const systemPermissionsList = ref([]); // 权限列表
// 权限管理 备份数据 用于 未保存后的还原操作
const backupPermissionsValue = reactive({
  value: [], // target
  data: [], // source
});
// 权限穿梭框数据
const permissionsTransfer = reactive({
  data: [],
  value: [],
  nameList: {},
  statusList: {},
  // 代理，最终提交的数据，按状态分类提交。
  proxyStatus: {},
});

const userPermissionsList = ref<{ users?: object; group?: object }>({});
const activeUserPermissions = ref([]);
const activeGroupPermissions = ref([]);
const tablePagination = computed(() => {
  return {
    current: 1,
    pageSize: 25,
    pageSizeOptions: [25, 75, 115, 150],
    total: tableData.value.length,
    showJumper: true,
  };
});

const loadSystemPermissionsList = () => {
  loadSystemPermissions()
    .then((res: PermissionsArray) => {
      systemPermissionsList.value = JSON.parse(JSON.stringify(res));
      backupPermissionsValue.data = JSON.parse(JSON.stringify(res));
      permissionsTransfer.data = res.map((item) => {
        return {
          label: item.object,
          value: item.val,
        };
      });
      permissionsTransfer.nameList = res.reduce((acc, cur) => {
        acc[cur.val] = cur.object;
        return acc;
      }, {});
    })
    .catch((err) => {
      console.error(err);
    });
};

const loadUserPermissions = () => {
  loadUserPermissionsList()
    .then((res) => {
      userPermissionsList.value = res;
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleAdd = () => {
  actionMode.value = 'add';
  initPermissionsTransfer();
  ResetDialogForm();
  setEditDialogVisible(true);
};

const handleEdit = (e: Event, row) => {
  e.stopPropagation();
  actionMode.value = 'edit';
  const { id, group } = row;
  activeUserPermissions.value = userPermissionsList.value?.users[id] ?? [];
  activeGroupPermissions.value = userPermissionsList.value?.group[group] ?? [];
  ResetDialogForm(row);
  initPermissionsTransfer();
  setEditDialogVisible(true);
};

const setEditDialogVisible = (visible: boolean) => {
  Dialog_Model.edit = visible;
};

// 初始权限穿梭框
const initPermissionsTransfer = () => {
  permissionsTransfer.value = [];
  permissionsTransfer.statusList = {};
  permissionsTransfer.proxyStatus = {};
  //
  handlePermissionDialogClose();
  if (actionMode.value === 'edit') {
    permissionsTransfer.value = activeUserPermissions.value.map((item) => {
      return item.val ?? '未知权限';
    });
  }
};

const showPermissionsDialog = () => {
  Dialog_Model.permissions = true;
  actionMode.value === 'add'
    ? (activeGroupPermissions.value = userPermissionsList.value?.group[EditUserDialogForm.value['group']] ?? [])
    : null;
  initPermissionsTransfer();
};

// 还原权限状态
const restorePermissionsStatus = () => {
  activeUserPermissions.value.forEach((item) => {
    permissionsTransfer.statusList[item.val] = {
      open: item?.open === 1 ? true : false,
    };
  });
  permissionsTransfer.proxyStatus = JSON.parse(JSON.stringify(permissionsTransfer.statusList));
};

// 设置权限状态，用于记录保存后的权限状态，必需，否则会导致二次打开时权限状态丢失
const setPermissionsStatus = (val: string, open: boolean) => {
  activeUserPermissions.value.forEach((item) => {
    if (item.val === val) {
      item.open = open ? 1 : 0;
    }
  });
};

const handlePermissionDialogClose = () => {
  // 因为没有开启 点击蒙层关闭、关闭按钮关闭、esc关闭，所以只要关闭了都要还原permissionTransfer组件的数据
  // T-Transfer组件不会改变data数据，所以下方的代码是不必要的，但下方代码有效，故仍然保留。
  // permissionsTransfer.data = systemPermissionsList.value.map(item => {
  //         return {
  //             label: item.object,
  //             value: item.val
  //         }
  //     })
  // 包括还原状态，不还原会影响提交数据
  restorePermissionsStatus();
};

// 穿梭框数据变化时
const handlePermissionsTransferChange: TransferProps['onChange'] = (_val, ctx) => {
  const { movedValue, type } = ctx;
  if (type === 'target') {
    // 需要设置权限状态，默认为true
    movedValue.forEach((item) => {
      permissionsTransfer.statusList[item] = {
        open: true,
      };
    });
  } else if (type === 'source') {
    // 权限状态删除
    movedValue.forEach((item) => {
      delete permissionsTransfer.statusList[item];
    });
  }
};

// 保存权限
const handleSavePermissions = () => {
  permissionsTransfer.proxyStatus = JSON.parse(JSON.stringify(permissionsTransfer.statusList));
  Object.keys(permissionsTransfer.statusList).forEach((item) => {
    setPermissionsStatus(item, permissionsTransfer.statusList[item]?.open);
  });
  Dialog_Model.permissions = false;
};

// 切换权限开关
const togglePermissionStatus = (val) => {
  const isOpen = permissionsTransfer.statusList[val]?.open === true ? true : false;
  permissionsTransfer.statusList[val] = {
    open: !isOpen,
  };
};

/**
 * @InitGroupData
 * @初始化用户组数据
 */
const loadGroupData = () => {
  try {
    useRequest({
      url: '/group/list',
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode == 0) {
          for (const key in RES.data) {
            const element = RES.data[key];
            groupOptions.value.push({ label: element.name, value: element.id, type: element.type });
          }
        }
      },
      error: function (err) {
        console.error(err);
        NotifyPlugin('error', {
          title: '获取组列表失败',
          content: err,
          duration: 5000,
        });
      },
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * @InitTableData
 * @初始化表格数据
 */
const loadTableData = () => {
  const { current: currentPage, pageSize } = tablePagination.value;
  tableLoading.value = true;
  try {
    useRequest({
      url: '/user/list',
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        tableData.value = RES.data;
        tableBackData.value = RES.data;
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
          title: '获取账号列表失败',
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

/**
 * @DeleteAccount
 * @删除账号
 */
const DeleteAccount = () => {
  var list = SelectData.value;
  for (const index in list) {
    if (Object.hasOwnProperty.call(list, index)) {
      const element = list[index];
      useRequest({
        url: '/user/del',
        methods: 'POST',
        data: {
          id: element.id,
        },
        success: function (res) {
          var RES = JSON.parse(res);
          if (RES.errcode === 0) {
            var U_id = RES.data.id;
            console.info(`删除了id为${U_id}的用户`);
          }
          NotifyPlugin('success', {
            title: '删除账号成功',
            content: `成功删除了id为${U_id}的用户`,
            duration: 5000,
          });
          // 刷新数据
          this.InitTableData();
        },
        error: function (err) {
          NotifyPlugin('error', {
            title: '删除账号失败',
            content: err,
            duration: 5000,
          });
          console.error(err);
        },
      });
      if (parseInt(index) == list.length - 1) {
        // 清空选择
        SelectData.value = [];
        loadTableData();
      }
    }
  }
};

const exportToXlsx = () => {
  async function createExcel() {
    const headerStyle = {
      font: {
        name: 'Arial',
        family: 4,
        size: 12,
        bold: true,
        // color: { argb: 'FF0000' }
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A0C2FA' },
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      },
      border: {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      },
    };

    const bodyStyle = {
      font: {
        name: '黑体',
        family: 4,
        size: 12,
        bold: true,
      },
      alignment: {
        vertical: 'middle' as const,
        horizontal: 'center' as const,
        wrapText: true,
      },
      border: {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      } as const,
    };

    const headerRow = [
      {
        key: 'id',
        label: 'id',
        width: 6.5,
      },
      {
        key: 'code',
        label: '用户Code',
        width: 20,
      },
      {
        key: 'name',
        label: '姓名',
        width: 14,
      },
      {
        key: 'class',
        label: '班级',
        width: 16,
      },
      {
        key: 'grade',
        label: '年级',
        width: 12,
      },
      {
        key: 'group',
        label: '组别',
        width: 14,
      },
      {
        key: 'reg_time',
        label: '注册时间',
        width: 27,
      },
      {
        key: 'join_time',
        label: '加入时间',
        width: 22,
      },
      {
        key: 'password',
        label: '密码',
        width: 17,
      },
      {
        key: 'share_device',
        label: '共享设备数',
        width: 6.5,
      },
      {
        key: 'openid',
        label: '微信openid',
        width: 18,
      },
      {
        key: 'remark',
        label: '备注',
        width: 26,
      },
    ];

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Sheet1');
    ws.addRow(headerRow.map((it) => it.label)).eachCell((cell) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      cell.style = headerStyle;
    });
    tableData.value.forEach((it) => {
      // 特殊组标记
      const unUsual = ['老师', '保留用户', '系统用户'];
      const isUnusual = unUsual.includes(groupOptions.value.find((item) => item.value === it.group)?.label ?? '');
      const w = ws.addRow(
        Object.values({
          id: it.id,
          code: it.code,
          name: it.name,
          class: it.class,
          grade: it.grade,
          group: groupOptions.value.find((item) => item.value === it.group)?.label ?? '',
          reg_time: dayjs(it.reg_time).format('YYYY-MM-DD HH:mm:ss'),
          join_time: dayjs(it.join_time).format('YYYY-MM-DD'),
          password: it.password,
          share_device: it.share_device,
          openid: it.openid,
          remark: it.remark,
        }),
      );
      w.height = 40;
      w.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber === 1) {
          cell.style = {
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'A0C2FA' },
            },
            ...bodyStyle,
          };
        } else if (isUnusual) {
          cell.style = {
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF5EE' },
            },
            ...bodyStyle,
          };
        } else {
          cell.style = bodyStyle;
        }
      });
    });

    const lastRow = ws.addRow([`本数据表由媒体部管理系统导出，导出时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}`]);
    lastRow.height = 55;
    lastRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F5DEB3' },
        },
        ...bodyStyle,
      };
    });
    // 合并最后一行
    const aToZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    ws.mergeCells(`A${ws.rowCount}:${aToZ[headerRow.length - 1]}${ws.rowCount}`);

    ws.columns = headerRow.map((header) => ({
      header: header.label,
      key: header.label,
      width: header.width,
    }));

    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        // 创建 Blob 对象
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `媒体部管理系统-人员名单.${dayjs().format('YYMMDD')}.xlsx`;
        a.click();

        // 清理 URL
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          a.remove();
        }, 100);
      })
      .catch((err) => console.error('Error creating file:', err));
  }
  createExcel();
};

/**
 * @submitForm
 * @提交 新增账号或编辑账号
 */
const submitForm = () => {
  const isEditMode = actionMode.value === 'edit';

  // 提交的数据->只有模式为编辑模式时才会有id
  const SUBDATA = {
    name: EditUserDialogForm.value.name,
    code: EditUserDialogForm.value.code,
    class: EditUserDialogForm.value.class,
    password: EditUserDialogForm.value.password ? sha256(EditUserDialogForm.value.password) : null,
    share_device: EditUserDialogForm.value.share_device,
    group: EditUserDialogForm.value.group,
    grade: EditUserDialogForm.value.grade,
    reg_time: dayjs(EditUserDialogForm.value.reg_time).format('YYYY-MM-DD HH:mm:ss'),
    join_time: dayjs(EditUserDialogForm.value.join_time).format('YYYY-MM-DD HH:mm:ss'),
    permissions_open: Object.keys(permissionsTransfer.proxyStatus).filter(
      (key) => permissionsTransfer.proxyStatus[key].open,
    ),
    permissions_close: Object.keys(permissionsTransfer.proxyStatus).filter(
      (key) => !permissionsTransfer.proxyStatus[key].open,
    ),
  };
  const FORMDATA = isEditMode
    ? {
        id: isEditMode ? EditUserDialogForm.value.id : null,
        ...SUBDATA,
      }
    : SUBDATA;
  const showError = (err) => {
    NotifyPlugin('error', {
      title: '设置账号信息失败',
      content: err,
      duration: 5000,
    });
    console.error(err);
  };
  const editFunction = () => {
    useRequest({
      url: '/user/edit',
      methods: 'POST',
      data: FORMDATA,
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode === 0) {
          var E_id = RES.data.id;
          NotifyPlugin('success', {
            title: '编辑账号信息成功',
            content: `成功编辑了id为${E_id}的账号信息`,
            duration: 5000,
          });
          console.info(`编辑了id为${E_id}的账号信息`);
          // 重置对话框数据
          ResetDialogForm();
          // 刷新数据
          loadTableData();
        } else {
          showError(RES?.data ?? RES?.errmsg);
        }
      },
      error: function (err) {
        NotifyPlugin('error', {
          title: '编辑账号信息失败',
          content: err,
          duration: 5000,
        });
        console.error(err);
      },
    });
  };
  const addFunction = () => {
    useRequest({
      url: '/user/add',
      methods: 'POST',
      data: FORMDATA,
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode === 0) {
          var E_id = RES.data.id;
          NotifyPlugin('success', {
            title: '添加账号成功',
            content: `成功添加了id为${E_id}的账号`,
            duration: 5000,
          });
          console.info(`添加了id为${E_id}的账号`);
          // 重置对话框数据
          ResetDialogForm();
          // 刷新数据
          loadTableData();
        } else {
          showError(RES?.data ?? RES?.errmsg);
        }
      },
      error: function (err) {
        NotifyPlugin('error', {
          title: '添加账号失败',
          content: err,
          duration: 5000,
        });
        console.error(err);
      },
    });
  };
  // 操作
  isEditMode ? editFunction() : addFunction();
  // 关闭对话框
  setEditDialogVisible(false);
};

const sortChange = (e) => {
  tableSort.value = e;
  TableSortData();
};

const TableSortData = () => {
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
    tableData.value = tableBackData.value;
  }
};

const handleTableSelectChange = (_value, { selectedRowData }) => {
  SelectData.value = selectedRowData;
};

const onPageChange = (pageInfo) => {
  tablePagination.value.current = pageInfo.current;
  tablePagination.value.pageSize = pageInfo.pageSize;
};

onMounted(() => {
  // 用户权限
  loadUserPermissions();
  // 系统权限
  loadSystemPermissionsList();
  // 用户列表
  loadTableData();
  // 组数据
  loadGroupData();
});
</script>

<script lang="tsx">
// import * as XLSX from "xlsx";
export default {
  name: 'UserManage',
};
</script>

<style lang="scss">
.t-dialog__body:has(mtb-tag[TAG]) {
  padding-bottom: 0px !important;
}

div[required]::before {
  content: '*';
  color: red;
  padding-right: 6px;
}

div[required] {
  display: flex;
  align-items: center;
}

div[unrequired]::before {
  content: ' ';
  width: 12.36px;
}

div[unrequired] {
  display: flex;
  align-items: center;
}

.t-transfer {
  &.transfer-horizontal {
    gap: 8px;
    flex-direction: column-reverse;
    * {
      user-select: none;
    }
    .t-transfer__list-header {
      width: calc(100% - var(--td-comp-margin-s) * 2) !important;
    }
    .t-transfer__list-content .t-checkbox-group {
      flex-direction: row !important;
      padding: 0 12px;
      .t-checkbox {
        margin-right: 0px !important;
        margin-left: 0px !important;
      }
      .UserCanTSelect {
        user-select: none;
      }
    }
    &.t-transfer__footer .t-transfer__list {
      &:has(.transfer-footer--tagGroup) {
        padding-bottom: 54.67px !important;
      }
      padding-bottom: 0px;
    }
    .t-transfer__list {
      height: 186px !important;
    }
    .t-transfer__list-source {
      padding-bottom: 0px !important;
    }
    .t-transfer__list-target {
      .transfer-footer--tagGroup {
        padding: 12px;
        border-top: 1px solid #e7e7e7;
        height: 30.67px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow: auto;
        .group-permission--item {
          transition: background-color 0.2s cubic-bezier(0.38, 0, 0.24, 1);
          display: flex;
          cursor: pointer;
          border-radius: var(--td-radius-default);
          padding: var(--td-comp-paddingLR-xs) var(--td-comp-paddingLR-s);
          &:hover {
            background: var(--td-bg-color-container-hover);
          }
        }
      }
    }
    .t-transfer__operations {
      justify-content: center;
      flex-direction: row !important;
      .t-icon {
        transform: rotate(-90deg);
      }
    }
  }
}

.vip-tag {
  margin-left: 8px;
  padding: 3px 5px;
  border: 1px solid var(--td-component-border);
  font: var(--td-font-body-small);
  border-radius: var(--td-radius-default);
  position: relative;
  transform: skewX(-5deg);
  line-height: 10px;
  font-size: 10px;
  user-select: none;
  overflow: hidden;
  span {
    transform: skewX(-5deg);
    display: inline-block;
    font-weight: bold;
  }
  &.normal-vip {
    background-color: #007bd3;
    span {
      background: linear-gradient(70deg, #33ffe8, #bcffd3);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
  }
  &.svip-vip {
    background-color: #353535;
    span {
      background: linear-gradient(70deg, #ffbb3f, #ffdea1);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
  }
  &.admin-vip {
    background-color: #ffffff;
    span {
      background: linear-gradient(70deg, #0097ff, #ff471e);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
  }
  &.owner-vip {
    background-color: #353535;
    span {
      background: linear-gradient(70deg, #ffbb3f, #ffdea1);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
  }
  /* 动态扫光效果 */
  .scan-light {
    position: absolute;
    top: -4px;
    left: 0;
    bottom: 0;
    width: 10px;
    height: 130%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3));
    filter: blur(2px);
    animation: scan 20s ease-in-out infinite;
    transform: skewX(-10deg);
  }

  @keyframes scan {
    0%,
    90% {
      left: -15px;
    }
    100% {
      left: calc(100% + 15px);
    }
  }
}
</style>
