<template>
  <div style="margin: 24px; display: flex; flex-direction: column; gap: 16px">
    <div style="font: var(--td-font-title-large); padding: 16px 12px">Banner文件上传</div>
    <div>
      <div>
        <t-upload
          v-model="files"
          :action="`${getInternetAPI()}/setBanner/justUpload`"
          placeholder="上传文件，文件格式只支持图片和视频，最多只能上传 5 份文件，单文件最大1GB"
          theme="file-flow"
          multiple
          accept="video/*,image/*"
          :abridge-name="[50, 10]"
          :auto-upload="true"
          :max="5"
          :show-thumbnail="true"
          :format-response="formatResponse"
          @success="getBannerFileList"
        ></t-upload>
      </div>
      <!---->
      <div></div>
    </div>
    <div style="font: var(--td-font-title-large); padding: 16px 12px">Banner内容设置</div>
    <div>
      <t-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :data="bannerList"
        :editable-row-keys="editableRowKeys"
        drag-sort="row-handler"
        lazy-load
        hover
        bordered
        @drag-sort="onDragSort"
        @row-edit="onRowEdit"
      ></t-table>
    </div>
    <div>
      <t-button theme="primary" variant="outline" size="large" block @click="onSubmit">推 送</t-button>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import { MoveIcon } from 'tdesign-icons-vue-next';
import useRequest from '@hooks/useRequest';
import { Input, MessagePlugin, NotifyPlugin, Select, TableInstanceFunctions, TableProps } from 'tdesign-vue-next';
import { getInternetAPI, getInternetWeb, guessFileTypeByFileName } from '@utils/index';

const files = ref([]);
const formatResponse = (res) => {
  if (res?.errcode !== 0) {
    return { status: 'fail', error: `上传失败，原因：${res?.errmsg}` };
  }
  if (!res) {
    return { status: 'fail', error: '上传失败，原因：文件过大或网络不通' };
  }
  return res;
};

const tableRef = ref<TableInstanceFunctions>();
const editableRowKeys = ref([]);
const currentSaveId = ref('');
const editMap = {};
const onRowEdit: TableProps['onRowEdit'] = (params) => {
  const { row, col, value } = params;
  const oldRowData = editMap[row.id]?.editedRow || row;
  const editedRow = {
    ...oldRowData,
    [col.colKey]: value,
  };
  editMap[row.id] = {
    ...params,
    editedRow,
  };
};
const columns = [
  {
    colKey: 'drag',
    title: '排序',
    cell: () => (
      <span>
        <MoveIcon />
      </span>
    ),
    width: 50,
  },
  { colKey: 'orders', title: '顺序', align: 'center', width: 60 },
  {
    colKey: 'title',
    title: '标题',
    align: 'center',
    width: 200,
    edit: {
      component: Input,
      showEditIcon: false,
    },
  },
  {
    colKey: 'desc',
    title: '描述',
    align: 'center',
    width: 180,

    edit: {
      component: Input,
      showEditIcon: false,
    },
  },
  {
    colKey: 'url',
    title: '资源地址',
    align: 'center',
    edit: {
      component: Select,
      props: () => {
        return {
          creatable: true,
          filterable: true,
          options: editTableSelectOption.value,
        };
      },
      rules: [
        {
          required: true,
          message: '不能为空',
        },
      ],
      showEditIcon: false,
    },
  },
  {
    colKey: 'Review',
    title: 'Review',
    align: 'center',
    cell: (_h, { row }) => {
      var src = row.url;
      var dl = <div>Unknown Source</div>;
      if (src?.startsWith('/static')) {
        src = `${getInternetWeb()}${row.url}`;
      }
      const st = src.split('/');
      var type = ['image', 'video'].includes(row.type) ? row.type : guessFileTypeByFileName(st[st.length - 1]);
      if (type === 'video') {
        dl = <video src={src} controls="controls" width="320" height="180" style="object-fit: contain;"></video>;
      }
      if (type === 'image') {
        dl = <img src={src} width="320" height="180" style="object-fit: contain;"></img>;
      }
      return <div>{dl}</div>;
    },
  },
  {
    title: '操作',
    colKey: 'operate',
    align: 'center',
    width: 150,
    cell: (h, { row }) => {
      const editable = editableRowKeys.value.includes(row.id.toString());
      return (
        <div style="display: flex; justify-content: center; gap: 8px;">
          {!editable && (
            <t-link theme="primary" hover="color" data-id={row.id} onClick={onEdit}>
              编辑
            </t-link>
          )}
          {editable && (
            <t-link theme="primary" hover="color" data-id={row.id} onClick={onSave}>
              保存
            </t-link>
          )}
          {editable && (
            <t-link theme="primary" hover="color" data-id={row.id} onClick={onCancel}>
              取消
            </t-link>
          )}
        </div>
      );
    },
  },
];
const bannerList = ref([]);
const fileList = ref([]);
const editTableSelectOption = ref([]);

const onEdit = (e: MouseEvent) => {
  const { id } = (e.currentTarget as HTMLElement).dataset;
  if (!editableRowKeys.value.includes(id)) {
    editableRowKeys.value.push(id);
  }
};

const updateEditState = (id: string) => {
  const index = editableRowKeys.value.findIndex((t) => t === id);
  editableRowKeys.value.splice(index, 1);
};

const onCancel = (e: MouseEvent) => {
  const { id } = (e.currentTarget as HTMLElement).dataset;
  updateEditState(id);
  tableRef.value?.clearValidateData();
};

const onSave = (e: MouseEvent) => {
  const { id } = (e.currentTarget as HTMLElement).dataset;
  currentSaveId.value = id;
  // 触发内部校验，而后也可在 onRowValidate 中接收异步校验结果
  tableRef.value.validateRowData(id).then((params) => {
    if (params.result.length) {
      const r = params.result[0];
      MessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`);
      return;
    }
    // 如果是 table 的父组件主动触发校验
    if (params.trigger === 'parent' && !params.result.length) {
      const current = editMap[currentSaveId.value];
      // 设置Review的type
      const selectValue = current.editedRow?.url;
      // fileList中查找
      current.editedRow.type = undefined;
      for (const i in fileList.value) {
        const element = fileList.value[i];
        if (element?.url === selectValue) {
          current.editedRow.type = element?.file_type;
        }
      }
      if (current) {
        bannerList.value.splice(current.rowIndex, 1, current.editedRow);
      }
      // 清空编辑态
      updateEditState(currentSaveId.value);
    }
  });
};

const onDragSort = (params) => {
  bannerList.value = params.newData;
};

const onSubmit = () => {
  // 遍历bannerList，按照排序顺序设置orders
  const data = bannerList.value.map((item, index) => {
    return {
      ...item,
      orders: index + 1,
    };
  });
  useRequest({
    url: `${getInternetAPI()}/setBanner/coverAdd`,
    useCustomURL: true,
    methods: 'POST',
    data: {
      data: JSON.stringify(data),
    },
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '设置Banner列表失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      NotifyPlugin.success({
        title: '设置Banner列表成功',
      });
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '设置Banner列表失败[Error]',
        content: err,
      });
    },
  });
};

const getBannerList = () => {
  useRequest({
    url: `${getInternetAPI()}/getBanner`,
    useCustomURL: true,
    methods: 'GET',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '获取Banner列表失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      bannerList.value = json.data.map((item) => ({
        ...item,
        id: item?.id.toString(),
      }));
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取Banner列表失败[Error]',
        content: err,
      });
    },
  });
};

const getBannerFileList = () => {
  useRequest({
    url: `${getInternetAPI()}/getBanner/fileList`,
    useCustomURL: true,
    methods: 'GET',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '获取Banner列表失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      fileList.value = json.data;
      editTableSelectOption.value = json.data.map((item) => {
        return {
          label: item.url,
          value: item.url,
          type: item.file_type,
        };
      });
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取Banner列表失败[Error]',
        content: err,
      });
    },
  });
};

onMounted(() => {
  getBannerList();
  getBannerFileList();
});
</script>

<script lang="tsx">
export default {
  name: 'BannerManage',
};
</script>
