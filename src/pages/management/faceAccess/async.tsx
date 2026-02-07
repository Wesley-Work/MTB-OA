import { defineComponent, ref, onMounted, reactive, watch, computed } from 'vue';
import { Table, Tag, Switch, Space, MessagePlugin, PrimaryTableCol, Button, Form, FormItem } from 'tdesign-vue-next';
import { useRequest } from '@/hooks/useRequest';
import { VerifyPermissions, loadUserPermissions } from '@/hooks/usePermission';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'FaceAccessAsync',
  props: {
    handleChangeComponent: Function,
    fullScreenToggle: Function,
  },
  setup() {
    const data = ref([]);
    const loading = ref(false);
    const total = ref(0);
    const userPermissionsRef = ref<string[]>([]);

    const pagination = reactive({
      current: 1,
      pageSize: 20,
    });

    const filters = reactive({
      include_system: false,
      show_all: false,
    });

    const hasAdminPermission = computed(() => {
      return VerifyPermissions(userPermissionsRef.value, 'hikvision.operation.admin');
    });

    const fetchData = async () => {
      loading.value = true;
      try {
        const resStr = await useRequest({
          url: '/hikvision/operation/get-async-list',
          methods: 'GET',
          data: {
            page: pagination.current,
            page_size: pagination.pageSize,
            include_system: filters.include_system,
            show_all: filters.show_all,
          },
        });

        if (typeof resStr === 'string') {
          const res = JSON.parse(resStr);
          if (res.errcode === 0) {
            data.value = res.data.data;
            total.value = res.data.total;
          } else {
            MessagePlugin.error(`获取数据失败: ${res.errmsg}`);
          }
        }
      } catch (err) {
        console.error(err);
        MessagePlugin.error('网络请求失败');
      } finally {
        loading.value = false;
      }
    };

    const loadPermissions = async () => {
      try {
        const perms = await loadUserPermissions();
        if (Array.isArray(perms)) {
          userPermissionsRef.value = perms;
        }
      } catch (e) {
        console.error('Failed to load permissions', e);
      }
    };

    onMounted(async () => {
      await loadPermissions();
      fetchData();
    });

    const onPageChange = (pageInfo: any) => {
      pagination.current = pageInfo.current;
      pagination.pageSize = pageInfo.pageSize;
      fetchData();
    };

    const handleSearch = () => {
      pagination.current = 1;
      fetchData();
    };

    const handleReset = () => {
      filters.include_system = false;
      filters.show_all = false;
      pagination.current = 1;
      fetchData();
    };

    const columns: PrimaryTableCol[] = [
      { colKey: 'id', title: 'ID', width: 100 },
      { colKey: 'request_id', title: '请求 ID', ellipsis: true },
      {
        colKey: 'type',
        title: '任务类型',
      },
      {
        colKey: 'status',
        title: '状态',
        cell: (_h, { row }) => {
          if (row.status === 0)
            return (
              <Tag theme="success" variant="light">
                成功
              </Tag>
            );
          if (row.status === -1)
            return (
              <Tag theme="warning" variant="light">
                处理中
              </Tag>
            );
          return (
            <Tag theme="danger" variant="light">
              失败
            </Tag>
          );
        },
      },
      { colKey: 'operator', title: '操作人' },
      {
        colKey: 'server_time',
        title: '提交时间',
        cell: (_h, { row }) => (row.server_time ? dayjs.unix(row.server_time).format('YYYY-MM-DD HH:mm:ss') : '-'),
      },
      {
        colKey: 'callback_time',
        title: '回调时间',
        cell: (_h, { row }) => (row.callback_time ? dayjs.unix(row.callback_time).format('YYYY-MM-DD HH:mm:ss') : '-'),
      },
    ];

    return () => (
      <div class="face-access-async-container" style="background: var(--td-bg-color-container); padding: 24px;">
        <div class="filter-container" style="margin-bottom: 24px;">
          <Form layout="inline" labelWidth="0">
            <FormItem>
              <Space align="center">
                <span>显示系统回调</span>
                <Switch v-model={filters.include_system} onChange={handleSearch} />
              </Space>
            </FormItem>
            {hasAdminPermission.value && (
              <FormItem>
                <Space align="center">
                  <span>查看所有人请求</span>
                  <Switch v-model={filters.show_all} onChange={handleSearch} />
                </Space>
              </FormItem>
            )}
            <FormItem>
              <Space>
                <Button theme="primary" onClick={handleSearch}>
                  查询
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </FormItem>
          </Form>
        </div>

        <Table
          data={data.value}
          columns={columns}
          rowKey="id"
          loading={loading.value}
          hover
          stripe
          maxHeight="calc( 100vh - 382px )"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: total.value,
            showJumper: true,
            onChange: onPageChange,
          }}
        />
      </div>
    );
  },
});
