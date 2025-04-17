<template>
  <div style="margin-bottom: 16px">
    <t-alert theme="info" message="当前页面只完成部分功能，请耐心等待迭代！" />
  </div>
  <div>
    <div style="display: flex; flex-direction: row">
      <t-space size="small">
        <t-button
          variant="outline"
          theme="primary"
          ghost
          style="--ripple-color: #fff"
          @click="Dialog_Model.AddEq = true"
        >
          <template #icon>
            <t-icon name="add" />
          </template>
          添加设备
        </t-button>
        <t-button
          :disabled="SelectData.length > 1 || SelectData.length === 0"
          @click="
            (EditEqDialogFrom.id = SelectData[0].id),
              (EditEqDialogFrom.eq_name = SelectData[0].eq_name),
              (EditEqDialogFrom.eq_code = SelectData[0].eq_code),
              (EditEqDialogFrom.model = SelectData[0].model),
              (EditEqDialogFrom.sn = SelectData[0].sn),
              (EditEqDialogFrom.status = SelectData[0].status),
              (EditEqDialogFrom.type = SelectData[0].type),
              (Dialog_Model.EditEq = true)
          "
        >
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
  <!--添加设备Dialog-->
  <t-dialog
    v-model:visible="Dialog_Model.AddEq"
    header="添加设备"
    width="42%"
    :close-btn="false"
    cancel-btn="取消"
    confirm-btn="确认添加"
    :on-confirm="VerifyAddForm"
    :close-on-esc-keydown="false"
  >
    <mtb-tag t-a-g />
    <div style="width: 100%; margin-top: 8px">
      <t-space direction="horizontal" size="16px" style="width: 100%">
        <t-space direction="vertical" size="12px" style="width: 100%">
          <!--设备名称-->
          <div>
            <t-input v-model="AddEqDialogFrom.eq_name" label="设备名称：" type="text" required />
          </div>
          <div>
            <t-input v-model="AddEqDialogFrom.eq_code" label="设备Code：" type="text" required />
          </div>
          <div>
            <t-input v-model="AddEqDialogFrom.ascription" label="设备归属：" placeholder="" type="text" />
          </div>
          <div>
            <t-input v-model="AddEqDialogFrom.model" label="设备型号：" placeholder="" type="text" />
          </div>
          <div>
            <t-input v-model="AddEqDialogFrom.sn" label="设备sn码：" placeholder="" type="text" />
          </div>
        </t-space>
        <t-space direction="vertical" size="12px" style="width: 100%">
          <div>
            <t-select v-model="AddEqDialogFrom.type" label="设备种类：" :value-display="TYPEvalueDisplay" required>
              <t-option v-for="item in equipmentType" :key="item.id" :value="item.id" :label="item.label">
                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
              </t-option>
            </t-select>
          </div>
          <div>
            <t-select v-model="AddEqDialogFrom.status" label="设备状态：" :value-display="STATUSvalueDisplay" required>
              <t-option
                v-for="item in equipmentStatus"
                :key="item.id"
                :value="item.id"
                :label="item.label"
                :disabled="item.n.includes('start')"
                :title="item.n.includes('start') ? '不能将初始状态设为该值' : null"
              >
                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
              </t-option>
            </t-select>
          </div>
        </t-space>
      </t-space>
    </div>
  </t-dialog>
  <!---->
  <t-dialog
    v-model:visible="Dialog_Model.EditEq"
    header="编辑设备"
    width="42%"
    :close-btn="false"
    cancel-btn="取消"
    confirm-btn="提交编辑"
    :on-confirm="EditForm"
    :close-on-esc-keydown="false"
  >
    <mtb-tag t-a-g />
    <div style="width: 100%; margin-top: 8px">
      <t-space direction="horizontal" size="16px" style="width: 100%">
        <t-space direction="vertical" size="12px" style="width: 100%">
          <!--设备名称-->
          <div>
            <t-input v-model="EditEqDialogFrom.eq_name" label="设备名称：" type="text" required />
          </div>
          <div>
            <t-input v-model="EditEqDialogFrom.eq_code" label="设备Code：" type="text" required />
          </div>
          <div>
            <t-input v-model="EditEqDialogFrom.ascription" label="设备归属：" placeholder="" type="text" />
          </div>
          <div>
            <t-input v-model="EditEqDialogFrom.model" label="设备型号：" placeholder="" type="text" />
          </div>
          <div>
            <t-input v-model="EditEqDialogFrom.sn" label="设备sn码：" placeholder="" type="text" />
          </div>
        </t-space>
        <t-space direction="vertical" size="12px" style="width: 100%">
          <div>
            <t-select v-model="EditEqDialogFrom.type" label="设备种类：" :value-display="TYPEvalueDisplay" required>
              <t-option v-for="item in equipmentType" :key="item.id" :value="item.id" :label="item.label">
                <t-tag :theme="item.theme" variant="light-outline">{{ item.label }}</t-tag>
              </t-option>
            </t-select>
          </div>
          <div>
            <t-select v-model="EditEqDialogFrom.status" label="设备状态：" :value-display="STATUSvalueDisplay" required>
              <t-option
                v-for="item in equipmentStatus"
                :key="item.id"
                :value="item.id"
                :label="item.label"
                :disabled="item.n.indexOf(EditEqDialogFrom.status) === -1 ? false : true"
                :title="item.n.indexOf(EditEqDialogFrom.status) === -1 ? false : '当前状态不能变更为该状态'"
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
import { computed, reactive, ref } from 'vue';
import { getCurrentInstance } from 'vue';
import { NotifyPlugin } from 'tdesign-vue-next';
import { equipmentStatus, equipmentStatusTips } from '@types/type';
import useRequest from '../../hooks/useRequest';

const that = getCurrentInstance();

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
const Dialog_Model = reactive({
  AddEq: false,
  EditEq: false,
});
const AddEqDialogFrom = reactive({
  eq_name: '',
  eq_code: '',
  ascription: '',
  model: '',
  sn: '',
  type: 0,
  status: 0,
});
const EditEqDialogFrom = reactive({
  id: '',
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

const TYPEvalueDisplay = (h, { value }) => {
  return (
    <t-tag theme={equipmentType[value].theme} variant="light-outline">
      {equipmentType[value].label}
    </t-tag>
  );
};

const STATUSvalueDisplay = (h, { value }) => {
  return (
    <t-tag theme={equipmentStatus[value].theme} variant="light-outline">
      {equipmentStatus[value].label}
    </t-tag>
  );
};

/**
 * @InitTableData
 * @初始化表格数据
 */
const InitTableData = () => {
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
  var FORMDATA = this.$data.AddEqDialogFrom;
  if (!FORMDATA.eq_name || !FORMDATA.eq_code) {
    NotifyPlugin('error', {
      title: '添加设备失败',
      content: '请填写设备必填信息',
      duration: 5000,
    });
    return false;
  }
  // PASS
  var that = this;
  var TOKEN = localStorage.getItem('token');
  HTTPRequest({
    url: config.API_URL.MAIN_URL + '/equipment/add',
    methods: 'POST',
    data: {
      eqname: FORMDATA.eq_name,
      eqcode: FORMDATA.eq_code,
      ascription: FORMDATA.ascription,
      sn: FORMDATA.sn,
      model: FORMDATA.model,
      type: FORMDATA.type,
      status: FORMDATA.status,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: TOKEN,
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
        // 刷新数据
        that.InitTableData();
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
  });
  // 关闭dialog
  this.$data.Dialog_Model.AddEq = false;
  // 还原表单
  FORMDATA = {
    eq_name: '',
    eq_code: '',
    ascription: '',
    model: '',
    sn: '',
    type: 0,
    status: 0,
  };
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
          console.log(`删除了id为${E_id}的设备`);
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
  InitTableData();
};

/**
 * @EditForm
 * @编辑设备
 */
const EditForm = () => {
  var that = this;
  var FORMDATA = this.$data.EditEqDialogFrom;
  var TOKEN = localStorage.getItem('token');
  HTTPRequest({
    url: config.API_URL.MAIN_URL + '/equipment/edit',
    methods: 'POST',
    data: {
      id: FORMDATA.id,
      eqname: FORMDATA.eq_name,
      eqcode: FORMDATA.eq_code,
      ascription: FORMDATA.ascription,
      sn: FORMDATA.sn,
      model: FORMDATA.model,
      type: FORMDATA.type,
      status: FORMDATA.status,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: TOKEN,
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
        console.log(`编辑了id为${E_id}的设备信息`);
        // 刷新数据
        that.InitTableData();
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
  });
  // 关闭dialog
  this.$data.Dialog_Model.EditEq = false;
  this.$data.SelectData = [];
  // 还原表单
  FORMDATA = {
    id: '',
    eq_name: '',
    eq_code: '',
    ascription: '',
    model: '',
    sn: '',
    type: 0,
    status: 0,
  };
};

const sortChange = (e) => {
  table_Sort.value = e;
  TableSortData();
};

const TableSortData = () => {
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

const handleTableSelectChange = (value, { selectedRowData }) => {
  SelectData.value = selectedRowData;
};
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
