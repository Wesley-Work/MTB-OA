import { defineComponent, ref, reactive, onMounted, h } from 'vue';
import { Card, EnhancedTable, Button, Empty, Skeleton, MessagePlugin } from 'tdesign-vue-next';
import { useRequest } from '@/hooks/useRequest';

// 部门负责人类型
interface DepartmentLeader {
  [key: string]: any;
}

// 部门数据类型
interface Department {
  id: number;
  name: string;
  parentid: number;
  order: number;
  department_leader: string[] | DepartmentLeader[];
  children?: Department[];
}

// 组织架构响应数据类型
interface OrgStructureResponse {
  errcode: number;
  errmsg: string;
  data?: {
    department_tree: Department[];
    total_departments: number;
  };
}

export default defineComponent({
  name: 'OrgStructure',
  setup() {
    // 状态管理
    const loading = ref(false);
    const tableRef = ref(null);
    const departmentTree = ref<Department[]>([]);
    const expandedTreeNodes = ref<(string | number)[]>([]);
    const totalDepartments = ref(0);

    // 获取组织架构数据
    const fetchOrgStructure = async () => {
      loading.value = true;
      try {
        const result = await useRequest({
          url: '/wecom/organization',
          methods: 'GET',
        });

        if (typeof result === 'string') {
          const response: OrgStructureResponse = JSON.parse(result);

          if (response.errcode === 0 && response.data) {
            departmentTree.value = response.data.department_tree;
            totalDepartments.value = response.data.total_departments;

            // 默认展开第一级
            if (departmentTree.value.length > 0) {
              expandedTreeNodes.value = departmentTree.value.map((dept) => dept.id);
            }

            MessagePlugin.success('组织架构加载成功');
          } else {
            MessagePlugin.error(response.errmsg || '加载组织架构失败');
          }
        }
      } catch (error) {
        console.error('获取组织架构失败:', error);
        MessagePlugin.error('获取组织架构失败，请稍后重试');
      } finally {
        loading.value = false;
      }
    };

    // 格式化部门负责人显示
    const formatDepartmentLeaders = (leaders: string[] | DepartmentLeader[]): string => {
      if (!leaders || leaders.length === 0) {
        return '无';
      }

      if (typeof leaders[0] === 'string') {
        return (leaders as string[]).join('、');
      }

      return '管理员';
    };

    // 树形表格配置
    const treeConfig = reactive({
      childrenKey: 'children',
      treeNodeColumnIndex: 0,
      indent: 24,
      expandTreeNodeOnClick: true,
    });

    // 树形表格列定义
    const columns = [
      {
        colKey: 'name',
        title: '部门名称',
        minWidth: 250,
        cell: (h, { row }) => {
          return (
            <div>
              <div style="font-weight: 500; font-size: 14px;">{row.name}</div>
              <div style="font-size: 12px; color: #999; margin-top: 4px;">
                负责人：{formatDepartmentLeaders(row.department_leader)}
              </div>
            </div>
          );
        },
      },
      {
        colKey: 'order',
        title: 'Order值',
        width: 120,
        align: 'center',
        cell: (h, { row }) => row.order,
      },
      {
        colKey: 'id',
        title: '部门ID',
        width: 100,
        align: 'center',
        cell: (h, { row }) => row.id,
      },
    ];

    // 展开/收起树节点变化
    const onExpandedTreeNodesChange = (expandedTreeNodes_) => {
      expandedTreeNodes.value = expandedTreeNodes_;
    };

    // 同步年级
    const onSyncGrade = async () => {
      try {
        loading.value = true;
        MessagePlugin.loading('正在同步年级...');

        const result = await useRequest({
          url: '/wecom/sync-grade',
          methods: 'POST',
        });

        if (typeof result !== 'string') {
          throw new Error('同步年级失败');
        }

        const response = JSON.parse(result);
        if (response.errcode === 0) {
          const createdCount = response.data?.created_count || 0;
          MessagePlugin.success(`年级同步完成，新建${createdCount}个部门`);
          await fetchOrgStructure();
        } else {
          throw new Error(response.errmsg || '同步年级失败');
        }
      } catch (error) {
        console.error('同步年级失败:', error);
        MessagePlugin.error(error instanceof Error ? error.message : '同步年级失败，请稍后重试');
      } finally {
        loading.value = false;
      }
    };

    // 同步业务组
    const onSyncBusinessGroup = async () => {
      try {
        loading.value = true;
        MessagePlugin.loading('正在同步业务组...');

        const result = await useRequest({
          url: '/wecom/sync-business-group',
          methods: 'POST',
        });

        if (typeof result !== 'string') {
          throw new Error('同步业务组失败');
        }

        const response = JSON.parse(result);
        if (response.errcode === 0) {
          const createdCount = response.data?.created_count || 0;
          MessagePlugin.success(`业务组同步完成，新建${createdCount}个部门`);
          await fetchOrgStructure();
        } else {
          throw new Error(response.errmsg || '同步业务组失败');
        }
      } catch (error) {
        console.error('同步业务组失败:', error);
        MessagePlugin.error(error instanceof Error ? error.message : '同步业务组失败，请稍后重试');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchOrgStructure();
    });

    return () => (
      <div style="padding: 16px;">
        <Card
          title="组织架构"
          bordered={false}
          style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"
          v-slots={{
            actions: () => (
              <div style="display: flex; gap: 8px;">
                <Button size="small" onClick={() => onSyncGrade()} loading={loading.value}>
                  同步年级
                </Button>
                <Button size="small" onClick={() => onSyncBusinessGroup()} loading={loading.value}>
                  同步业务组
                </Button>
                <Button theme="primary" size="small" onClick={() => fetchOrgStructure()} loading={loading.value}>
                  刷新
                </Button>
              </div>
            ),
          }}
        >
          {loading.value ? (
            <Skeleton theme="text" rowCol={[1, 1, 1]} />
          ) : departmentTree.value.length === 0 ? (
            <Empty />
          ) : (
            <div>
              <div style="margin-bottom: 16px; color: #666; font-size: 12px;">共 {totalDepartments.value} 个部门</div>

              <EnhancedTable
                ref={tableRef}
                v-model:expandedTreeNodes={expandedTreeNodes.value}
                rowKey="id"
                data={departmentTree.value}
                columns={columns}
                tree={treeConfig}
                hover
                onExpandedTreeNodesChange={onExpandedTreeNodesChange}
              />
            </div>
          )}
        </Card>
      </div>
    );
  },
});
