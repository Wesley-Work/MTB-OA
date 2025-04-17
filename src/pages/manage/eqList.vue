<template>
  <!-- <div style="margin-bottom: 16px">
    <t-alert theme="info" message="当前页面只完成部分功能，请耐心等待迭代！" />
  </div> -->
  <div>
    <div style="display: flex; flex-direction: row">
      <t-space size="small">
        <t-button variant="outline" theme="primary" ghost style="--ripple-color: #fff" @click="showAddEquipmentDialog">
          <template #icon>
            <t-icon name="add" />
          </template>
          添加设备
        </t-button>
        <t-button :disabled="SelectData.length > 1 || SelectData.length === 0" @click="showEditEquipmentDialog">
          <template #icon>
            <t-icon name="edit-1" />
          </template>
          编辑
        </t-button>
        <t-popconfirm
          theme="danger"
          content="确认删除？删除后不可恢复！"
          placement="bottom"
          :on-confirm="DeleteEquipment"
        >
          <t-button :disabled="SelectData.length === 0" theme="danger">
            <template #icon>
              <t-icon name="delete" />
            </template>
            {{ SelectData.length == 0 ? '删除' : '删除 ' + SelectData.length + ' 个' }}
          </t-button>
        </t-popconfirm>
      </t-space>
    </div>
    <div style="padding-top: 16px">
      <t-table
        row-key="id"
        :columns="table_Columns"
        :data="table_Data"
        select-on-row-click
        :reserve-selected-row-on-paginate="false"
        :sort="table_Sort"
        :pagination="tablePagination"
        :loading="table_Loading"
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
  <!---->
  <!--Dialog-->
  <t-dialog
    v-model:visible="dialogModel"
    :header="dialogHeader"
    width="42%"
    :close-btn="false"
    cancel-btn="取消"
    :confirm-btn="'提交' + dialogModeText"
    :on-confirm="EditForm"
    :close-on-esc-keydown="false"
  >
    <div style="width: 100%; margin-top: 8px">
      <t-space direction="horizontal" size="16px" style="width: 100%">
        <t-space direction="vertical" size="12px" style="width: 100%">
          <div v-if="dialogMode === 'edit'">
            <t-input v-model="dialogForm.id" label="数据库ID：" type="text" />
          </div>
          <div>
            <t-input v-model="dialogForm.eq_name" label="设备名称：" type="text" required />
          </div>
          <div>
            <t-input v-model="dialogForm.eq_code" label="设备Code：" type="text" required />
          </div>
          <div>
            <t-input v-model="dialogForm.ascription" label="设备归属：" placeholder="" type="text" />
          </div>
          <div>
            <t-input v-model="dialogForm.model" label="设备型号：" placeholder="" type="text" />
          </div>
          <div>
            <t-input v-model="dialogForm.sn" label="设备SN：" placeholder="" type="text" />
          </div>
        </t-space>
        <t-space direction="vertical" size="12px" style="width: 100%">
          <div>
            <t-select v-model="dialogForm.type" label="设备种类：" :value-display="TYPEvalueDisplay" required>
              <t-option v-for="item in equipmentType" :key="item.id" :value="item.id" :label="item.label">
                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
              </t-option>
            </t-select>
          </div>
          <div>
            <t-select v-model="dialogForm.status" label="设备状态：" :value-display="STATUSvalueDisplay" required>
              <t-option
                v-for="item in equipmentStatus"
                :key="item.id"
                :value="item.id"
                :label="item.label"
                :disabled="item.disableStatus.indexOf(dialogForm.status) === -1 ? false : true"
                :title="item.disableStatus.indexOf(dialogForm.status) === -1 ? false : '当前状态不能变更为该状态'"
              >
                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
              </t-option>
            </t-select>
          </div>
        </t-space>
      </t-space>
    </div>
  </t-dialog>
</template>

<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from 'vue';
import { NotifyPlugin } from 'tdesign-vue-next';
import type { equipmentStatus } from '@type/type';
import useRequest from '../../hooks/useRequest';

const equipmentType = [
  {
    id: 0,
    label: '媒体部设备',
    theme: 'primary',
  },
  {
    id: 1,
    label: '其他-非媒体部',
    theme: 'warning',
  },
];

const equipmentStatus: equipmentStatus[] = [
  {
    id: 0,
    label: '正常',
    theme: 'success',
    disableStatus: [2],
  },
  {
    id: 1,
    label: '作为固定设备',
    theme: 'primary',
    disableStatus: [2, 4],
  },
  {
    id: 2,
    label: '已借出',
    theme: 'warning',
    disableStatus: ['start', 0, 1, 4],
  },
  {
    id: 3,
    label: '丢失',
    theme: 'danger',
    disableStatus: [4],
    // TODO: 若从借出状态改为该状态 后端需要操作借出记录为丢失（归还）！！！
  },
  {
    id: 4,
    label: '清点中',
    theme: 'primary',
    disableStatus: ['start', 2],
  },
];

const table_Columns = [
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
    width: '80',
  },
  {
    colKey: 'eq_code',
    title: '设备Code',
    sortType: 'all',
    sorter: true,
    width: '200',
  },
  {
    colKey: 'eq_name',
    title: '设备名',
    sortType: 'all',
    sorter: true,
    ellipsis: true,
  },
  { colKey: 'model', title: '型号', sortType: 'all', sorter: true },
  { colKey: 'sn', title: '设备sn码' },
  { colKey: 'ascription', title: '归属', sortType: 'all', sorter: true },
  {
    colKey: 'type',
    title: '设备种类',
    sortType: 'all',
    sorter: true,
    cell: (h, { row }) => {
      return (
        <t-tag
          shape="round"
          theme={equipmentType.find((item) => item.id === row.type)?.theme ?? 'danger'}
          variant="light-outline"
        >
          {equipmentType.find((item) => item.id === row.type)?.label ?? '未知'}
        </t-tag>
      );
    },
  },
  {
    colKey: 'status',
    title: '状态',
    sortType: 'all',
    sorter: true,
    cell: (h, { row }) => {
      const el = equipmentStatus.find((item) => item.id === row.status);
      return (
        <t-tag shape="square" theme={el.theme ?? 'default'} variant="light-outline">
          {el.label ?? '未知状态'}
        </t-tag>
      );
    },
  },
];
const table_Data = ref([]);
const table_BackData = ref([]);
const table_Sort = ref({
  sortBy: 'id',
  descending: false,
});
const table_Loading = ref(false);
const SelectData = ref([]);
const dialogModel = ref(false);
const dialogMode = ref(undefined);
const dialogModeText = computed(() =>
  dialogMode.value === 'add' ? '添加' : dialogMode.value === 'edit' ? '编辑' : '错误的操作：',
);
const dialogHeader = computed(() => `${dialogModeText.value}设备`);
const dialogForm = reactive({
  id: '', // 编辑才有id
  eq_name: '',
  eq_code: '',
  ascription: '',
  model: '',
  sn: '',
  type: 0,
  status: 0,
});
const tablePagination = computed(() => {
  return {
    current: 1,
    pageSize: 25,
    pageSizeOptions: [25, 75, 115, 150],
    total: table_Data.value.length,
    showJumper: true,
  };
});

const TYPEvalueDisplay = (_h, { value }) => {
  return (
    <t-tag theme={equipmentType[value]?.theme} variant="light-outline">
      {equipmentType[value]?.label}
    </t-tag>
  );
};

const STATUSvalueDisplay = (_h, { value }) => {
  return (
    <t-tag theme={equipmentStatus[value]?.theme} variant="light-outline">
      {equipmentStatus[value]?.label}
    </t-tag>
  );
};

const cleanDialogForm = () => {
  Object.keys(dialogForm).forEach((key) => {
    dialogForm[key] = '';
  });
  SelectData.value = [];
};

const showAddEquipmentDialog = () => {
  cleanDialogForm();
  const defaultValue = {
    type: 0,
    status: 0,
  };
  Object.assign(dialogForm, defaultValue);
  dialogModel.value = true;
  dialogMode.value = 'add';
};

const showEditEquipmentDialog = () => {
  cleanDialogForm();
  const select = SelectData.value[0];
  Object.assign(dialogForm, select);
  dialogModel.value = true;
  dialogMode.value = 'edit';
};

const hideDialog = () => {
  dialogModel.value = false;
  dialogMode.value = undefined;
  cleanDialogForm();
};

onMounted(() => {
  // 页面加载时初始化表格数据
  loadEquipmentTableData();
});

/**
 * @loadEquipmentTableData
 * @初始化表格数据
 */
const loadEquipmentTableData = () => {
  table_Loading.value = true;
  try {
    useRequest({
      url: '/equipment/list',
      methods: 'POST',
      success: function (res) {
        var RES = JSON.parse(res);
        table_Data.value = RES.data;
        table_BackData.value = RES.data;
      },
      error: function (err) {
        console.error(err);
        NotifyPlugin('error', {
          title: '获取设备列表失败',
          content: err,
          duration: 5000,
        });
      },
      complete: function () {
        table_Loading.value = false;
      },
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * @VerifyAddForm
 * @提交添加设备验证表单
 */
const VerifyAddForm = () => {
  if (!dialogForm.eq_name || !dialogForm.eq_code) {
    NotifyPlugin('error', {
      title: '添加设备失败',
      content: '请填写设备必填信息',
      duration: 5000,
    });
    return false;
  }
  // PASS
  useRequest({
    url: '/equipment/add',
    methods: 'POST',
    data: {
      eqname: dialogForm.eq_name,
      eqcode: dialogForm.eq_code,
      ascription: dialogForm.ascription,
      sn: dialogForm.sn,
      model: dialogForm.model,
      type: dialogForm.type,
      status: dialogForm.status,
    },
    success: function (res) {
      var RES = JSON.parse(res);
      if (RES.errcode === 0) {
        var E_id = RES.data.id;
        NotifyPlugin('success', {
          title: '添加设备成功',
          content: `成功添加了id为${E_id}的设备`,
          duration: 5000,
        });
        console.info(`添加了id为${E_id}的设备`);
      }
    },
    error: function (err) {
      NotifyPlugin('error', {
        title: '添加设备失败',
        content: err,
        duration: 5000,
      });
      console.error(err);
    },
    complete: function () {
      // 关闭dialog
      hideDialog();
      // 还原表单
      cleanDialogForm();
      // 刷新
      loadEquipmentTableData();
    },
  });
};

/**
 * @DeleteEquipment
 * @删除设备
 */
const DeleteEquipment = () => {
  var list = SelectData.value;
  for (const index in list) {
    const element = list[index];
    useRequest({
      url: '/equipment/del',
      methods: 'POST',
      data: {
        id: element.id,
      },
      success: function (res) {
        var RES = JSON.parse(res);
        if (RES.errcode === 0) {
          var E_id = RES.data.id;
          console.info(`删除了id为${E_id}的设备`);
        }
        NotifyPlugin('success', {
          title: '删除设备成功',
          content: `成功删除了id为${E_id}的设备`,
          duration: 5000,
        });
      },
      error: function (err) {
        NotifyPlugin('error', {
          title: '删除设备失败',
          content: err,
          duration: 5000,
        });
        console.error(err);
      },
    });
  }
  // 清空选择
  SelectData.value = [];
  // 刷新数据
  loadEquipmentTableData();
};

/**
 * @EditForm
 * @编辑设备
 */
const EditForm = () => {
  useRequest({
    url: '/equipment/edit',
    methods: 'POST',
    data: {
      id: dialogForm.id,
      eqname: dialogForm.eq_name,
      eqcode: dialogForm.eq_code,
      ascription: dialogForm.ascription,
      sn: dialogForm.sn,
      model: dialogForm.model,
      type: dialogForm.type,
      status: dialogForm.status,
    },
    success: function (res) {
      var RES = JSON.parse(res);
      if (RES.errcode === 0) {
        var E_id = RES.data.id;
        NotifyPlugin('success', {
          title: '编辑设备信息成功',
          content: `成功编辑了id为${E_id}的设备`,
          duration: 5000,
        });
        console.info(`编辑了id为${E_id}的设备信息`);
      }
    },
    error: function (err) {
      NotifyPlugin('error', {
        title: '编辑设备信息失败',
        content: err,
        duration: 5000,
      });
      console.error(err);
    },
    complete: function () {
      // 关闭dialog
      hideDialog();
      // 还原表单
      cleanDialogForm();
      // 刷新
      loadEquipmentTableData();
    },
  });
};

// 表格排序
const sortChange = (e) => {
  table_Sort.value = e;
  tableSortData();
};

// 表格排序子函数
const tableSortData = () => {
  var data = table_Data.value;
  var sort = table_Sort.value;
  if (sort) {
    table_Data.value = data
      .concat()
      .sort((a, b) =>
        sort.descending
          ? Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' }).compare(a[sort.sortBy], b[sort.sortBy])
          : Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' }).compare(b[sort.sortBy], a[sort.sortBy]),
      );
  } else {
    table_Data.value = table_BackData.value;
  }
};

// 表格选择
const handleTableSelectChange = (_value, { selectedRowData }) => {
  SelectData.value = selectedRowData;
};

// 表格分页变更
const onPageChange = (pageInfo, context) => {
  tablePagination.value.current = pageInfo.current;
  tablePagination.value.pageSize = pageInfo.pageSize;
};
</script>

<script lang="tsx">
export default {
  name: 'EqList',
};
</script>

<style>
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
</style>
