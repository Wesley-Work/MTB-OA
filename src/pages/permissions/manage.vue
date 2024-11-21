<template>
    <t-tabs v-model="Tabs_Value">
      <t-tab-panel :value="1" :destroy-on-hide="false">
        <template #label> <t-icon name="system-2" style="margin-right: 4px;"/> 权限设置管理 </template>
        <template #panel>
          <div style="display: flex;justify-content: flex-end;margin-bottom: 16px;">
            <t-space size="small">
                <t-button variant="outline" theme="primary" ghost style="--ripple-color: #fff" size="large" @click="AddNewPermissionsItem">
                    <template #icon>
                        <t-icon name="add-rectangle" />
                    </template>
                    添加新的数据项
                </t-button>
                <!-- <t-button :disabled="SelectData.length > 1 || SelectData.length === 0">
                    <template #icon>
                        <t-icon name="edit-1" />
                    </template>
                    编辑
                </t-button> -->
            </t-space>
          </div>
          <!---->
          <div>
            <t-table
              ref="System_Permissions"
              row-key="id"
              :data="System_Permissions_List_Data"
              :columns="System_Permissions_List_Columns"
              :stripe="true"
              :bordered="true"
              :hover="true"
              cell-empty-content="-"
              resizable
              :editable-row-keys="editableRowKeys"
              @row-edit="onRowEdit"
              @row-validate="onRowValidate"
              @validate="onValidate"
            >
            </t-table>
          </div>
        </template>
      </t-tab-panel>
      <t-tab-panel :value="2" :destroy-on-hide="false">
        <template #label> <t-icon name="user" style="margin-right: 4px;"/> 页面权限管理 </template>
        <template #panel>
          <t-table
          id="Page_Permissions"
          row-key="index"
          :data="data"
          :columns="columns"
          :stripe="true"
          :bordered="true"
          :hover="true"
          :pagination="pagination"
          cell-empty-content="-"
          resizable
        >
        </t-table>
        </template>
      </t-tab-panel>
    </t-tabs>
</template>


<script setup lang="jsx">
import { ref, computed, getCurrentInstance } from 'vue';
import { Input, Select, DatePicker, MessagePlugin } from 'tdesign-vue-next';

const System_Permissions = ref();
const align = ref('left');

const editableRowKeys = ref([]);
const currentSaveId = ref('');

// 保存变化过的行信息
const editMap = {};

// 是否处于添加模式
const AlAdd = ref(false);

const TData = getCurrentInstance();

const AddNewPermissionsItem = (e) => {
  if (!AlAdd.value) {
    AlAdd.value = true;
    let NewAddData = {
      id: "NewItem",
      object: "",
      remark: "",
      type: "system",
      val: "",
    }
    TData.data.System_Permissions_List_Data.unshift(NewAddData);
    editableRowKeys.value = ["NewItem"]
  }
}

const onEdit = (e) => {
  const { id } = e.currentTarget.dataset;
  const ids = Number(id) ? Number(id) : id
  console.log(ids)
  if (!editableRowKeys.value.includes(ids)) {
    editableRowKeys.value.push(ids);
  }
};

// 更新 editableRowKeys
const updateEditState = (id) => {
  const index = editableRowKeys.value.findIndex((t) => t === id);
  editableRowKeys.value.splice(index, 1);
};

const onCancel = (e) => {
  const { id } = e.currentTarget.dataset;
  updateEditState(id);
  if (AlAdd.value) {
    AlAdd.value = false;
    TData.data.System_Permissions_List_Data.shift();
  }
  System_Permissions.value.clearValidateData();
};

var OnSaveNeedEvent = ''

const onSaveFather = (e) => {
  OnSaveNeedEvent = e.currentTarget.dataset
}

const onSave = (e) => {
  // const { ids } = e.currentTarget.dataset;
  // const id = Number(ids)
  let { id } = OnSaveNeedEvent;
  id = Number(id)


  currentSaveId.value = id;
  // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
  System_Permissions.value.validateRowData(id).then((params) => {
    console.log('Event Table Promise Validate:', params);
    if (params.result.length) {
      const r = params.result[0];
      MessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`);
      return;
    }
    // 如果是 table 的父组件主动触发校验
    if (params.trigger === 'parent' && !params.result.length) {
      const current = editMap[currentSaveId.value];
      if (current) {
        console.log(current.rowIndex, current.editedRow)
        data.value.splice(current.rowIndex, 1, current.editedRow);
        MessagePlugin.success('保存成功');
      }
      updateEditState(currentSaveId.value);
    }
  });
};

// 行校验反馈事件，System_Permissions.value.validateRowData 执行结束后触发
const onRowValidate = (params) => {
  console.log('Event Table Row Validate:', params);
};

function onValidateTableData() {
  // 执行结束后触发事件 validate
  System_Permissions.value.validateTableData().then((params) => {
    console.log('Promise Table Data Validate:', params);
    const cellKeys = Object.keys(params.result);
    const firstError = params.result[cellKeys[0]];
    if (firstError) {
      MessagePlugin.warning(firstError[0].message);
    }
  });
}

// 表格全量数据校验反馈事件，System_Permissions.value.validateTableData() 执行结束后触发
function onValidate(params) {
  console.log('Event Table Data Validate:', params);
}

const onRowEdit = (params) => {
  const { row, col, value } = params;
  const oldRowData = editMap[row.key]?.editedRow || row;
  const editedRow = { ...oldRowData, [col.colKey]: value };
  editMap[row.key] = {
    ...params,
    editedRow,
  };

  // ⚠️ 重要：以下内容应用于全量数据校验（单独的行校验不需要）
  // const newData = [...data.value];
  // newData[rowIndex] = editedRow;
  // data.value = newData;
};

const System_Permissions_List_Columns = computed(() => [
  {
    title: '数据项id',
    colKey: 'id',
    align: 'right',
    width: 100,
  },
  {
    title: '值',
    colKey: 'val',
    edit: {
      component: Input,
      props: {
        clearable: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        { required: true, message: '不能为空' },
      ],
      showEditIcon: false,
    },
  },
  {
    title: '类型',
    colKey: 'type',
    width: '100',
    align: 'center',
    cell: (h, { row }) => {
    return (
      <t-tag theme="success" variant="outline">
        {row.type}
      </t-tag>
    );
    }
  },
  {
    colKey: 'object',
    title: '权限说明',
    edit: {
      component: Input,
      props: {
        clearable: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        { required: true, message: '不能为空' },
      ],
      showEditIcon: false,
    },
  },
  {
    colKey: 'remark',
    title: '组',
    edit: {
      component: Input,
      props: {
        clearable: true,
      },
      // 校验规则，此处同 Form 表单
      rules: [
        { required: true, message: '不能为空' },
      ],
      showEditIcon: false,
    },
  },
  {
    title: '操作',
    colKey: 'operation',
    width: 250,
    align: 'center',
    cell: (h, { row }) => {
      const editable = editableRowKeys.value.includes(row.id);
      return (
        <div class="table-operations">
          <t-space>
            {!editable && (
              <t-link theme="primary" hover="color" data-id={row.id} onClick={onEdit}>
                编辑
              </t-link>
            )}
            {!editable && (
              <t-popconfirm theme="danger" content="确认删除？删除后不可恢复！" placement="left" onConfirm={onSave}>
                <t-link theme="primary" hover="color" data-id={row.id}>
                  删除
                </t-link>
              </t-popconfirm>
            )}
            {editable && (
              <t-popconfirm theme="warning" content="确认编辑该条数据？" placement="left" onConfirm={onSave}>
                <t-link theme="primary" hover="color" data-id={row.id} onClick={onSaveFather}>
                  保存
                </t-link>
              </t-popconfirm>
            )}
            {editable && (
              <t-link theme="primary" hover="color" data-id={row.id} onClick={onCancel}>
                取消
              </t-link>
            )}
          </t-space>
        </div>
      );
    },
  },
]);

</script>

<script lang="jsx">

import { NotifyPlugin } from "tdesign-vue-next";
import { config } from "../../components/config";
import { HTTPRequest } from "../../components/function/hooks";

export default {
    name: "pErmissiosSmanaGe",
    data() {
      return {
        Tabs_Value: 1,
        System_Permissions_List_Data: [],
      }
    },
    mounted() {
      this.GetStsyemPermissionsList()
    },
    methods: {
      GetStsyemPermissionsList() {
        const that = this;
        try {
          HTTPRequest({
              url: config.API_URL.MAIN_URL + "/permissions/systemlist",
              methods: "POST",
              header: {
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              },
              success: function (res) {
                  var RES = JSON.parse(res);
                  if (RES.errcode == 0){
                      that.$data.System_Permissions_List_Data = RES.data
                  }
              },
              error: function (err) {
                  console.error(err);
                  NotifyPlugin("error", {
                      title: "获取权限列表失败",
                      content: err,
                      duration: 5000,
                  });
              },
          });
        } catch (e) {
            console.log(e);
        }
      },






      /**
       * 编辑
       */
      System_Edit_Permissions(e,e2){
        console.log(e,e2)
      },
    },
};
</script>

<style></style>
