import { defineComponent, ref, toRefs, watch, onMounted, nextTick, VNode } from 'vue';
import Sortable from 'sortablejs';
import { taskStatus, taskTimeConvert, taskType, taskTypeDesc } from '../../hooks/common';
import { Empty, Loading, Table, Tag } from 'tdesign-vue-next';
import { isArray } from 'lodash-es';

import './styles/taskList.less';
import useVModel from '@hooks/useVModel';
import { taskEdit, taskGet } from './utils';

export default defineComponent({
  name: 'TaskListRender',
  props: {
    data: {
      type: Object,
      required: true,
    },
    tabs: {
      type: Array,
      required: true,
    },
    currentTab: {
      type: String,
      required: true,
    },
    showCompleted: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { data, tabs, currentTab, showCompleted: showCompletedProp, loading } = toRefs(props);

    const modelValue = ref(false);
    const [loadingVal, setLoading] = useVModel(loading, modelValue, false, () => {});

    const renderData = ref({});
    const showCompleted = ref(showCompletedProp.value);
    const completeStatusValue = 6;

    // 控制是否启用动画
    const enableAnimation = ref(true);

    // 使用一个唯一标识来触发动画
    const animationKey = ref(Date.now());

    watch(currentTab, (newVal) => {
      updateRenderData();
      if (newVal === 'dashboard') {
        nextTick(() => {
          initSortable();
        });
      }
    });

    watch(data, (newVal) => {
      updateRenderData();
      data.value = newVal;

      // 数据更新时，生成新的key来触发动画
      animationKey.value = Date.now();

      if (currentTab.value === 'dashboard') {
        nextTick(() => {
          initSortable();
        });
      }
    });

    watch(showCompletedProp, (newVal) => {
      showCompleted.value = newVal;
      updateRenderData();
      if (newVal && currentTab.value === 'dashboard') {
        nextTick(() => {
          initSortable();
        });
      }
    });

    const updateRenderData = () => {
      renderData.value = {};
      renderData.value = data.value[currentTab.value] || data.value['all'] || {};
    };

    const Options = {
      type: taskType,
      status: taskStatus,
    };

    const TableColumns = {
      type: [
        { colKey: 'id', title: 'Tid', width: 55 },
        { colKey: 'name', title: '任务名称', minWidth: 80 },
        {
          colKey: 'work_time',
          title: '工作时间',
          width: 200,
          cell: (h, { row }) => {
            return taskTimeConvert((row.work_time as string).split(','))?.join(' 至 ');
          },
        },
        {
          colKey: 'finally_time',
          title: '预期完成时间',
          width: 200,
          cell: (h, { row }) => {
            return taskTimeConvert(row.finally_time);
          },
        },
        { colKey: 'place', title: '工作地点', minWidth: 80 },
        { colKey: 'content', title: '工作内容', minWidth: 80 },
        {
          colKey: 'status',
          title: '任务状态',
          width: 92,
          align: 'center',
          cell: (h, { row }) => {
            const tag = findVal(row.status, 'status');
            return (
              <t-tag theme={tag?.theme} color={tag?.color} variant="light-outline">
                {tag?.label ?? row.status}
              </t-tag>
            );
          },
        },
        {
          colKey: 'user',
          title: '分配人员',
          width: 210,
          cell: (h, { row }) => {
            return stringToTagList(row.user);
          },
        },
        {
          colKey: 'equipment',
          title: '所需设备',
          minWidth: 80,
          cell: (h, { row }) => {
            return stringToTagList(row.equipment);
          },
        },
        {
          colKey: 'weight',
          title: '权重',
          width: 100,
          align: 'center',
          cell: (h, { row }) => {
            return <div>Level {row.weight}</div>;
          },
        },
        { colKey: 'create_user', title: '发布人', width: 75 },
        { colKey: 'remark', title: '备注', width: 100 },
      ],
      status: [
        { colKey: 'id', title: 'Tid', width: 55 },
        { colKey: 'name', title: '任务名称', minWidth: 80 },
        {
          colKey: 'work_time',
          title: '工作时间',
          width: 200,
          cell: (h, { row }) => {
            return taskTimeConvert((row.work_time as string).split(','))?.join(' 至 ');
          },
        },
        {
          colKey: 'finally_time',
          title: '预期完成时间',
          width: 200,
          cell: (h, { row }) => {
            return taskTimeConvert(row.finally_time);
          },
        },
        { colKey: 'place', title: '工作地点', minWidth: 80 },
        { colKey: 'content', title: '工作内容', minWidth: 80 },
        {
          colKey: 'type',
          title: '任务类型',
          width: 92,
          align: 'center',
          cell: (h, { row }) => {
            const tag = findVal(row.type, 'type');
            return (
              <t-tag theme={tag?.theme} color={tag?.color} variant="light-outline">
                {tag?.label}
              </t-tag>
            );
          },
        },
        {
          colKey: 'user',
          title: '分配人员',
          width: 210,
          cell: (h, { row }) => {
            return stringToTagList(row.user);
          },
        },
        {
          colKey: 'equipment',
          title: '所需设备',
          minWidth: 80,
          cell: (h, { row }) => {
            return stringToTagList(row.equipment);
          },
        },
        {
          colKey: 'weight',
          title: '权重',
          width: 100,
          align: 'center',
          cell: (h, { row }) => {
            return <div>Level {row.weight}</div>;
          },
        },
        { colKey: 'create_user', title: '发布人', width: 75 },
        { colKey: 'remark', title: '备注', width: 100 },
      ],
      all: [
        { colKey: 'id', title: 'Tid', width: 55 },
        { colKey: 'name', title: '任务名称', minWidth: 80 },
        {
          colKey: 'work_time',
          title: '工作时间',
          width: 200,
          cell: (h, { row }) => {
            return taskTimeConvert((row.work_time as string).split(','))?.join(' 至 ');
          },
        },
        {
          colKey: 'finally_time',
          title: '预期完成时间',
          width: 200,
          cell: (h, { row }) => {
            return taskTimeConvert(row.finally_time);
          },
        },
        { colKey: 'place', title: '工作地点', minWidth: 80 },
        { colKey: 'content', title: '工作内容', minWidth: 80 },
        {
          colKey: 'type',
          title: '任务类型',
          width: 92,
          align: 'center',
          cell: (h, { row }) => {
            const tag = findVal(row.type, 'type');
            return (
              <t-tag theme={tag?.theme} color={tag?.color} variant="light-outline">
                {tag?.label}
              </t-tag>
            );
          },
        },
        {
          colKey: 'status',
          title: '任务状态',
          width: 92,
          align: 'center',
          cell: (h, { row }) => {
            const tag = findVal(row.status, 'status');
            return (
              <t-tag theme={tag?.theme} color={tag?.color} variant="light-outline">
                {tag?.label ?? row.status}
              </t-tag>
            );
          },
        },
        {
          colKey: 'user',
          title: '分配人员',
          width: 210,
          cell: (h, { row }) => {
            return stringToTagList(row.user);
          },
        },
        {
          colKey: 'equipment',
          title: '所需设备',
          minWidth: 80,
          cell: (h, { row }) => {
            return stringToTagList(row.equipment);
          },
        },
        {
          colKey: 'weight',
          title: '权重',
          width: 100,
          align: 'center',
          cell: (h, { row }) => {
            return <div>Level {row.weight}</div>;
          },
        },
        { colKey: 'create_user', title: '发布人', width: 75 },
        { colKey: 'remark', title: '备注', width: 100 },
      ],
    };

    const stringToTagList = (str: string, options: any = {}) => {
      if (str === '') {
        return '';
      }
      const { variant = 'outline', size = 'medium' } = options;
      const list = str?.split(',') ?? [];
      const div = list.map((item) => {
        return (
          <Tag variant={variant} size={size}>
            {item}
          </Tag>
        );
      });
      return <div style="display: flex; flex-wrap: wrap; gap: 4px;">{div}</div>;
    };

    const findVal = (val: string | number, mode) => {
      for (const key in Options[mode]) {
        const item = Options[mode][key];
        if (item.value == val || Number(item.value) == val) {
          return item;
        }
      }
      return null;
    };

    const renderTagAndTable = (item) => {
      if (isArray(renderData.value)) {
        const tableData = renderData.value.filter((row) => {
          if (!showCompleted.value && row.status === completeStatusValue) {
            return false;
          }
          return true;
        });

        if (tableData.length === 0) {
          return null;
        }

        return <Table class="hidden--head" columns={TableColumns[item]} data={tableData} bordered rowKey="id" />;
      } else {
        const keys = Object.keys(renderData.value);
        return keys
          .map((key) => {
            const tag = findVal(key, item);
            const tableData = renderData.value[key].filter((row) => {
              if (!showCompleted.value && row.status === completeStatusValue) {
                return false;
              }
              return true;
            });

            if (tableData.length === 0) {
              return null;
            }

            return (
              <div class="tag_items" style={`order: ${tag.value}`}>
                <div class="title_tag">
                  <Tag theme={tag?.theme} color={tag?.color} variant="light-outline">
                    {item === 'type' && (
                      <span>
                        {tag.label}（{taskTypeDesc[tag.label]}）
                      </span>
                    )}
                    {item === 'status' && <span>{tag.label}</span>}
                  </Tag>
                </div>
                <Table class="hidden--head" columns={TableColumns[item]} data={tableData} bordered rowKey="id"></Table>
              </div>
            );
          })
          .filter(Boolean);
      }
    };

    // 存储所有任务列表的引用
    const taskListRefs = ref<Record<number, HTMLElement>>({});

    // 初始化拖拽功能
    const initSortable = () => {
      // 获取所有任务列表容器
      const taskLists = document.querySelectorAll('.task-dashboard_item__list');

      // 为每个列表初始化Sortable
      taskLists.forEach((el) => {
        new Sortable(el as HTMLElement, {
          group: 'taskCards', // 设置相同的组名，使卡片可以在不同列表间拖动
          animation: 150, // 拖动时的动画效果
          ghostClass: 'task-card-ghost', // 拖动时的占位符类名
          chosenClass: 'task-card-chosen', // 被选中时的类名
          dragClass: 'task-card-drag', // 拖动时的类名
          sort: false, // 禁止在同一列表内排序，因为这里不分顺序
          filter: '.t-empty', // 过滤掉Empty组件，使其不能被拖拽
          onStart: function (evt) {
            // 拖动开始时移除动画类
            const { item } = evt;
            item.classList.remove('card-animation');
          },
          onAdd: function (evt) {
            // 当一个元素从另一个列表添加到当前列表时触发
            const { to, item } = evt;

            // 将元素追加到列表最底部
            to.appendChild(item);
          },
          onEnd: function (evt) {
            // 拖动结束后的处理
            const { from, to, item } = evt;

            // 确保拖动结束后也不会有动画
            item.classList.remove('card-animation');

            // 获取任务ID
            const taskId = Number(item.getAttribute('data-task-id'));

            // 获取源状态和目标状态
            const fromStatus = Number(from.parentElement?.getAttribute('data-status'));
            const toStatus = Number(to.parentElement?.getAttribute('data-status'));

            // 如果状态发生变化，可以在这里处理状态更新逻辑
            if (fromStatus !== toStatus && taskId) {
              const taskItem = data.value?.['all'].find((i) => i.id === taskId);
              setLoading(true);
              taskEdit(taskItem, { status: toStatus }).finally(() => {
                taskGet().finally(() => {
                  setLoading(false);
                });
              });
            }
          },
        });
      });
    };

    // 在组件挂载后初始化拖拽功能
    onMounted(() => {
      nextTick(() => {
        if (currentTab.value === 'dashboard') {
          initSortable();
        }
      });
    });

    // dashboard模式只会根据status tag渲染列
    const renderDashboard = () => {
      const emptyNode = <Empty title="该分类当前还没有任务噢～" />;
      const taskItem = (statusValue: number) => {
        const tableData = (renderData.value as Array<any>)
          ?.filter((row) => {
            if (!showCompleted.value && row.status === completeStatusValue) {
              return false;
            }

            if (row.status === statusValue) {
              return true;
            }

            return false;
          })
          .map((row) => {
            const tagItem = taskType.find((i) => i.value === row.type);
            return (
              <div
                class={['task-dashboard_item__list_card', enableAnimation.value ? 'card-animation' : '']}
                data-task-id={row.id}
                key={`${animationKey.value}-${row.id}`}
              >
                <div class="task-dashboard_item__list_card__item" style="padding: 0px 0px 6px; align-items:flex-start;">
                  <div>
                    <Tag theme={tagItem?.theme} color={tagItem?.color} variant="light-outline" size="small">
                      {tagItem?.label} ({taskTypeDesc[tagItem?.label]})
                    </Tag>
                  </div>
                  <div class="title">{row.name}</div>
                </div>
                <div>{row.content}</div>
                <div class="split-line"></div>
                <div class="task-dashboard_item__list_card__item">
                  <div class="task-dashboard_item__list_card__item-header">工作时间</div>
                  <div>{taskTimeConvert((row.work_time as string).split(','))?.join(' 至 ')}</div>
                </div>
                <div class="task-dashboard_item__list_card__item">
                  <div class="task-dashboard_item__list_card__item-header">预计完成时间</div>
                  <div>{taskTimeConvert(row.finally_time)}</div>
                </div>
                <div class="split-line"></div>
                <div class="task-dashboard_item__list_card__item">
                  <div class="task-dashboard_item__list_card__item-header">分配人员</div>
                  <div>{stringToTagList(row.user, { variant: 'outline', size: 'small' })}</div>
                </div>
                <div class="task-dashboard_item__list_card__item">
                  <div class="task-dashboard_item__list_card__item-header">使用设备</div>
                  <div>{stringToTagList(row.equipment, { variant: 'outline', size: 'small' })}</div>
                </div>
                <div class="task-dashboard_item__list_card__item">
                  <div class="task-dashboard_item__list_card__item-header"></div>
                  <div></div>
                </div>
              </div>
            );
          });

        tableData.unshift(emptyNode);

        return tableData;
      };
      const node: VNode[] = taskStatus
        .map((status) => {
          return (
            (showCompleted.value || status.value !== completeStatusValue) && (
              <div
                class={['task-dashboard_item', `task-dashboard--${status.value}`]}
                key={status.value}
                data-status={status.value}
              >
                <div class="task-dashboard_item__tag">
                  <Tag
                    key={status.value}
                    size="large"
                    theme={status.theme}
                    color={status.color}
                    variant="light-outline"
                  >
                    {status.label}
                  </Tag>
                </div>
                <div
                  class="task-dashboard_item__list narrow-scrollbar"
                  ref={(el) => {
                    if (el) taskListRefs.value[status.value] = el as HTMLElement;
                  }}
                >
                  {taskItem(status.value)}
                </div>
              </div>
            )
          );
        })
        .filter(Boolean)
        .sort((a, b) => {
          // 获取每个列表中的任务数量
          const aTaskCount = a?.children?.[1]?.children?.[0]?.length || 0;
          const bTaskCount = b?.children?.[1]?.children?.[0]?.length || 0;

          // 按任务数量从多到少排序
          return bTaskCount - aTaskCount;
        });
      return <div class="task-dashboard narrow-scrollbar">{node}</div>;
    };

    const renderInner = (item) => {
      if (item === 'dashboard') {
        return renderDashboard();
      }

      const renderTable = renderTagAndTable(item);

      return (
        <div class="Table--view">
          <Table
            class={[{ 'hidden--body': renderTable.length !== 0 }]}
            columns={TableColumns[item]}
            bordered={true}
            rowKey="id"
          />
          <div class="tag--body">{renderTable}</div>
        </div>
      );
    };

    const renderView = () => {
      updateRenderData();
      return (
        <div>
          <Loading loading={loadingVal.value} text="加载中...">
            {tabs.value.map((item) => (currentTab.value === item ? <div id={item}>{renderInner(item)}</div> : null))}
          </Loading>
        </div>
      );
    };

    return () => <div>{renderView()}</div>;
  },
});
