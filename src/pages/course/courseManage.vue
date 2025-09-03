<template>
  <div class="course-container">
    <t-tabs v-model="tabValue">
      <t-tab-panel :value="1">
        <template #label> <BookOpenIcon class="tabs-icon-margin" /> 课程管理 </template>
        <div class="course-container-manage">
          <div class="course-container-manage_filter"></div>
          <!---->
          <div class="course-container-manage_table">
            <t-table :columns="tableColumns" :data="tableData" row-key="id"></t-table>
          </div>
        </div>
      </t-tab-panel>
      <t-tab-panel :value="2">
        <template #label> <File1Icon class="tabs-icon-margin" /> 文件管理 </template>
        <div class="course-container-file">
          <div class="course-container-file_filter"></div>
          <!---->
          <div class="course-container-file_table"></div>
        </div>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script setup lang="tsx">
import { defineComponent, onMounted, ref } from 'vue';
import { Link, NotifyPlugin, Space, Tag } from 'tdesign-vue-next';
import { File1Icon, BookOpenIcon } from 'tdesign-icons-vue-next';
import useRequest from '@hooks/useRequest';
import dayjs from 'dayjs';

defineProps({
  handleChangeComponent: {
    type: Function,
    default: null,
  },
});
const tabValue = ref(1);
const tableColumns = [
  {
    colKey: 'id',
    title: 'ID',
    width: '25',
  },
  {
    colKey: 'title',
    title: '课程标题',
    width: '100',
  },
  {
    colKey: 'content',
    title: '课程描述',
    width: '100',
  },
  {
    colKey: 'details',
    title: '课程步骤',
    width: '50',
    cell: (h, { row }) => {
      return row.details.length + ' 项';
    },
  },
  {
    colKey: 'startTime',
    title: '开始时间',
    width: '100',
    cell: (h, { row }) => {
      return dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'limitTime',
    title: '截止时间',
    width: '100',
    cell: (h, { row }) => {
      return dayjs(row.limit_time).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'exam_id',
    title: '完成课程是否需要考试',
    width: '35',
    align: 'center',
    cell: (h, { row }) => {
      if (row.exam_id) {
        return (
          <Tag theme="success" variant="outline">
            是
          </Tag>
        );
      }
      return (
        <Tag theme="primary" variant="outline">
          否
        </Tag>
      );
    },
  },
  {
    colKey: 'create_user',
    title: '创建人',
    width: '100',
  },
  {
    colKey: 'timestamp',
    title: '创建时间',
    width: '100',
    cell: (h, { row }) => {
      return dayjs(row.timestamp).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    colKey: 'operation',
    title: 'Action',
    width: '100',
    cell: () => {
      return (
        <Space>
          <Link>查看详情</Link>
          <Link theme="primary">编辑</Link>
          <Link theme="danger">删除</Link>
        </Space>
      );
    },
  },
];
const tableData = ref([]);

const loadCourseList = () => {
  useRequest({
    url: '/course/list',
    methods: 'POST',
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode === 0) {
        tableData.value = result.data;
      } else {
        NotifyPlugin.error({
          title: '获取课程列表数据失败[Main]',
          content: result.errmsg,
        });
      }
    },
    error: function (err) {
      NotifyPlugin.error({
        title: '获取课程列表数据失败[Error]',
        content: err,
      });
    },
  });
};

onMounted(() => {
  loadCourseList();
});
</script>

<script lang="tsx">
export default defineComponent({
  name: 'CourseManage',
});
</script>

<style lang="less">
.tabs-icon-margin {
  margin-right: 4px;
}

.course-container {
  &-manage {
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: var(--td-bg-color-page);

    &_filter {
      margin-top: 24px;
    }

    &_table {
    }

    &_table,
    &_filter {
      padding: 24px;
      background-color: var(--td-bg-color-container);
      border-radius: 4px;
    }
  }
}
</style>
