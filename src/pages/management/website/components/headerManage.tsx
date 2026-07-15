import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import {
  Button as TButton,
  DialogPlugin,
  Form as TForm,
  FormItem as TFormItem,
  Input as TInput,
  MessagePlugin,
  NotifyPlugin,
  Option as TOption,
  Select as TSelect,
  Space as TSpace,
  Switch as TSwitch,
  Tree as TTree,
  TreeInstanceFunctions,
  TreeProps,
  TypeTreeNode,
} from 'tdesign-vue-next';
import dayjs from 'dayjs';
import { isNumber } from 'lodash-es';
import useRequest from '@hooks/useRequest';
import { getInternetAPI, getInternetWeb } from '@utils/index';

import './headerManage.less';

interface HeaderItemChildren {
  id?: number;
  title?: string; // only type=label
  label?: string;
  target?: string; // only type=list or is child
  href?: string; // only type=list or is child
  isRouter?: boolean; // only type=list or is child
  type?: 'click';
  onlyPC?: boolean;
  onlyMobile?: boolean;
  bindParent?: number;
  children?: Omit<HeaderItemChildren, 'children'>[];
  /**当CallBack存在时，无论是否为路由都只执行CallBack */
  callBack?: () => void;
}

interface HeaderItem {
  id?: number;
  title?: string;
  label?: string;
  extraClass?: string;
  target?: string;
  href?: string;
  isRouter?: boolean | 0 | 1;
  type?: 'list' | 'label' | 'click';
  onlyPC?: boolean | 0 | 1;
  onlyMobile?: boolean | 0 | 1;
  bindParent?: number;
  children?: HeaderItemChildren[];
  parentIsLabel?: boolean | 0 | 1;
  mode?: string;
  orders?: number;
  callBack?: () => void;
}

type HeaderData = HeaderItem[];

interface HeaderTreeActiveList {
  active: number[] | string[];
  data: HeaderItem;
  source: TypeTreeNode;
}

type HeaderTreeTypeOption = { label: string; value: string };

export default defineComponent({
  name: 'HeaderManage',
  setup() {
    const headerPreviewIframeVisible = ref(true);
    const headerTreeRef = ref<TreeInstanceFunctions>();
    const headerTreeVisible = ref(true);
    const headerTreeList = ref<HeaderData>([]);
    const headerTreeActiveList = reactive<HeaderTreeActiveList>({
      active: [],
      data: {},
      source: null,
    });

    const headerPreviewUrl = computed(() => {
      return `${getInternetWeb()}/#/config/header?testData=${JSON.stringify(headerTreeList.value)}`;
    });

    const headerTreeFormRules = computed(() => {
      return {
        label: [{ required: true, message: '名称必填' }],
        type: [{ required: true, message: '菜单类型必填' }],
        href: headerTreeActiveList.data.type === 'click' ? [{ required: true, message: '目标地址必填' }] : [],
      };
    });

    const headerTreeTargetOptions: HeaderTreeTypeOption[] = [
      { label: '新建窗口打开[_blank]', value: '_blank' },
      { label: '同窗口跳转[_self]', value: '_self' },
      { label: '父级窗口打开[_parent]', value: '_parent' },
      { label: '整个窗口打开[_top]', value: '_top' },
    ];

    const headerTreeTypeOptions: HeaderTreeTypeOption[] = [
      { label: '点击菜单[click]', value: 'click' },
      { label: '列表[list]', value: 'list' },
      { label: '标签卡[label]', value: 'label' },
    ];

    // 当前状态是否可以添加子菜单
    const canApplySubMenu = computed(() => {
      const source = headerTreeActiveList.source;
      const isRootNode = source?.level === 0;
      const selectIsRootIsLabel = headerTreeActiveList.data.parentIsLabel;
      const typeIsClick = source?.data?.title ? false : headerTreeActiveList.source?.data?.type === 'click';
      if (selectIsRootIsLabel || (isRootNode && !typeIsClick)) {
        return false;
      }
      return true;
    });

    // 当前是否有选择
    const headerTreeHasSelect = computed(() => {
      return headerTreeActiveList.active.length > 0;
    });

    const refreshHeaderTree = () => {
      // 强制刷新组件视图
      headerTreeRef.value.refresh();
      // 在下个 tick 同步组件内部数据到本地 state
      setTimeout(() => {
        headerTreeList.value = headerTreeRef.value.getTreeData() as HeaderData;
      }, 0);
    };

    const onHeaderTypeChange = (val: string) => {
      const oldType = headerTreeActiveList.data.type;
      if (oldType === val) return;

      const confirmDia = DialogPlugin.confirm({
        header: '切换菜单类型确认',
        body: `即将由 [${oldType}] 切换为 [${val}]。切换后将清空该菜单设置${
          oldType !== 'click' ? '，且该菜单下的子菜单将被删除' : ''
        }，是否继续？`,
        onConfirm: () => {
          // 1. 显式从树组件中移除子节点（这是解决“结构还在”的关键）
          if (oldType !== 'click' && headerTreeActiveList.data.children?.length > 0) {
            const childIds = headerTreeActiveList.data.children.map((child: any) => child.id);
            childIds.forEach((id) => {
              headerTreeRef.value.remove(id);
            });
          }

          // 2. 直接更新当前选中的数据对象（它已经是 headerTreeList 中的引用）
          headerTreeActiveList.data.type = val as any;
          headerTreeActiveList.data.href = '';
          headerTreeActiveList.data.target = '_self';
          headerTreeActiveList.data.isRouter = 0;

          // 3. 彻底清空数据层的子菜单数组
          if (oldType !== 'click' && headerTreeActiveList.data.children) {
            headerTreeActiveList.data.children = [];
          }

          // 4. 关键：仅调用 refresh() 同步数据到视图
          headerTreeRef.value.refresh();
          confirmDia.destroy();
        },
        onClose: () => {
          confirmDia.destroy();
        },
      });
    };

    const isLabelParent = (sourceNode: TypeTreeNode) => {
      // 父级节点type是否为label
      const parent = headerTreeList.value.find((item) => item?.id === (sourceNode.data as any)?.bindParent);
      return (parent?.type === 'label' && sourceNode?.level === 1) || sourceNode?.level >= 2;
    };

    const renderHeaderTreeLabel: TreeProps['label'] = (_h, node) => {
      // 只允许拖拽到非click菜单，即禁止自行创建新子菜单
      const isEmpty = !!node.data?.label || !!node.data?.title;
      return isEmpty ? node.data?.label ?? node.data?.title : `菜单_${node.data?.id}`;
    };

    const cleanHeaderActive = () => {
      headerTreeActiveList.active = [];
      headerTreeActiveList.data = {};
      headerTreeActiveList.source = null;
    };

    const onHeaderTreeActive = (value: any, context: any) => {
      const treeNode = context.node['__tdesign_tree-node__'] as TypeTreeNode;
      const { data } = context.node;
      headerTreeActiveList.active = value;
      headerTreeActiveList.data = data;
      headerTreeActiveList.data['parentIsLabel'] = isLabelParent(treeNode);
      headerTreeActiveList.source = treeNode;
      if (value.length === 0) {
        cleanHeaderActive();
      }
    };

    const handleHeaderTreeAllowDrop: TreeProps['allowDrop'] = (ctx) => {
      // 禁止拖拽到click菜单，禁止有子项的节点拖到其他有子项的节点下
      const { dragNode, dropNode, dropPosition } = ctx;
      if (dropNode.data?.type === 'click' && dropPosition === 0) {
        return false;
      }
      if (
        ((dragNode.data?.children as Array<HeaderItemChildren>)?.length > 0 &&
          (dropNode.data?.children as Array<HeaderItemChildren>)?.length > 0 &&
          dropPosition === -1) ||
        dropNode.data.bindParent !== 0
      ) {
        if (!dragNode.data.bindParent && !dropNode.data.bindParent && dropPosition === -1) {
          return true;
        }
        return false;
      }
    };

    const onHandlerTreeDrop = () => {
      refreshHeaderTree();
    };

    const onHandleAppendHeaderRootNode = () => {
      // 插入一个根节点
      const item: HeaderItem = {
        id: Number((dayjs().toDate().getTime() / 1000).toFixed(0)),
        title: '',
        label: '',
        target: '_self',
        href: '',
        isRouter: 0,
        type: 'click',
        onlyPC: 0,
        onlyMobile: 0,
        mode: 'new',
      };
      headerTreeRef.value.appendTo('', item);
      refreshHeaderTree();
    };

    const onHandleAppendHeaderSubNode = () => {
      // 插入子节点
      const parent = headerTreeActiveList.data;
      const item: HeaderItem = {
        id: Number((dayjs().toDate().getTime() / 1000).toFixed(0)),
        bindParent: parent?.id ?? ('_获取父项id错误_' as unknown as number),
        title: '',
        label: '',
        target: '_self',
        href: '',
        isRouter: 0,
        type: 'click',
        onlyPC: 0,
        onlyMobile: 0,
        mode: 'new',
      };
      headerTreeRef.value.appendTo(headerTreeActiveList.active[0], item);
      refreshHeaderTree();
    };

    const onHandleAppendHeaderBeforeNode = () => {
      // 在选中节点前添加节点
      const brother = headerTreeActiveList.data;
      let bindParent = null;
      // 如果parentIsLabel为1，则type需要清空（不清空也行，因为最终提交时会校验tree内容）
      const type = brother.parentIsLabel === 1 ? null : 'click';
      // 判断选中节点是否为某个子节点
      if (!!brother?.bindParent && brother?.bindParent !== 0) {
        bindParent = brother.bindParent;
      }
      const item: HeaderItem = {
        id: Number((dayjs().toDate().getTime() / 1000).toFixed(0)),
        bindParent: bindParent,
        title: '',
        label: '',
        target: '_self',
        href: '',
        isRouter: 0,
        type: type,
        onlyPC: 0,
        onlyMobile: 0,
        mode: 'new',
      };
      headerTreeRef.value.insertBefore(headerTreeActiveList.active[0], item);
      refreshHeaderTree();
    };

    const onHandleAppendHeaderAfterNode = () => {
      // 在选中节点前添加节点
      const brother = headerTreeActiveList.data;
      let bindParent = null;
      // 如果parentIsLabel为1，则type需要清空（不清空也行，因为最终提交时会校验tree内容）
      const type = brother.parentIsLabel === 1 ? null : 'click';
      // 判断选中节点是否为某个子节点
      if (!!brother?.bindParent && brother?.bindParent !== 0) {
        bindParent = brother.bindParent;
      }
      const item: HeaderItem = {
        id: Number((dayjs().toDate().getTime() / 1000).toFixed(0)),
        bindParent: bindParent,
        title: '',
        label: '',
        target: '_self',
        href: '',
        isRouter: 0,
        type: type,
        onlyPC: 0,
        onlyMobile: 0,
        mode: 'new',
      };
      headerTreeRef.value.insertAfter(headerTreeActiveList.active[0], item);
      refreshHeaderTree();
    };

    const onHandleDeleteHeaderNode = () => {
      // 删除选中节点
      const executeDelete = () => {
        const targetId = headerTreeActiveList.data.id;
        if (targetId !== undefined && targetId !== null) {
          headerTreeRef.value.remove(targetId);
          cleanHeaderActive();
          refreshHeaderTree();
        } else {
          MessagePlugin.warning('未找到要删除的节点或节点无效');
        }
      };

      const targetNode = headerTreeActiveList.data;
      const hasChildren = (targetNode.children as any)?.length > 0;
      if (hasChildren) {
        const confirmDia = DialogPlugin.confirm({
          header: '删除确认',
          body: '检测到该节点包含子菜单，删除后将同时删除所有子项，是否继续？',
          confirmBtn: '确认删除',
          cancelBtn: '取消',
          onConfirm: () => {
            confirmDia.destroy();
            executeDelete();
          },
          onClose: () => {
            confirmDia.destroy();
          },
        });
      } else {
        executeDelete();
      }
    };

    const refreshHeaderPreview = () => {
      // 刷新预览
      headerPreviewIframeVisible.value = false;
      setTimeout(() => {
        headerPreviewIframeVisible.value = true;
      }, 10);
      MessagePlugin.success('刷新成功');
    };

    const onOpenPreviewUrl = () => {
      // 打开预览地址
      setTimeout(() => {
        window.open(headerPreviewUrl.value);
      }, 500);
    };

    const headerTreeVerify = (treeData: HeaderData): Promise<boolean> => {
      // 菜单树结构验证
      NotifyPlugin.closeAll();
      // 错误合集
      const errorList: Array<{ title: string; content: string }> = [];
      // level 0 的内容限制： label必须有值 bindParent必须为0或任意空值 type为click则href必须有值 type为label或list必须有children
      // level 1 的内容限制： 如果type不为click，则bindParent不能为0或任意空值，如果type不为click 则title必须 have值 label不能有值
      // level 2 的内容限制： 根节点type必须为label，label必须有值 bindParent不能为0或任意空值 href必须有值 type必须为click
      const subVerify = (node: HeaderItem | HeaderItemChildren, level = 0, root?: HeaderItem): void => {
        // Level 0验证
        if (level === 0) {
          if (!node.label || (node.bindParent !== undefined && node.bindParent !== 0 && !node.bindParent)) {
            errorList.push({
              title: `根菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
              content: '必须设置菜单名称且不能有父级绑定',
            });
          }
          if (node?.type === 'click' && !node.href) {
            errorList.push({
              title: `根菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
              content: '必须设置目标地址',
            });
          }
          if ((node?.type === 'label' || node?.type === 'list') && !node?.children) {
            errorList.push({
              title: `根菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
              content: 'type为label或list时，必须设置菜单',
            });
          }
        }

        // Level 1验证
        if (level === 1) {
          if (node.type !== 'click') {
            if (!node.bindParent || node.bindParent === 0) {
              errorList.push({
                title: `二级菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
                content: '非点击类型必须绑定有效父级',
              });
            }
            if (!node.title || node.label) {
              errorList.push({
                title: `二级菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
                content: '非点击类型必须设置标题且不能有标签',
              });
            }
          }
        }

        // Level 2验证
        if (level >= 2) {
          if (root?.type !== 'label') {
            errorList.push({
              title: `三级菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
              content: '必须存在于类型为label的根菜单下',
            });
          }
          if (!node.label || !node.href || node.type !== 'click') {
            errorList.push({
              title: `三级菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
              content: '必须设置标签和目标地址且菜单类型为click',
            });
          }
          if (node.bindParent === undefined || node.bindParent === 0) {
            errorList.push({
              title: `三级菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
              content: '必须绑定有效父级',
            });
          }
        }

        // 通用验证
        if (!node.id || !isNumber(node.id)) {
          errorList.push({
            title: `菜单${node.id}[${node?.label ?? node?.title}]验证失败`,
            content: 'id有误，必须为数字',
          });
        }

        // 递归验证子节点
        if (node.children) {
          node.children.forEach((child) => subVerify(child, level + 1, level === 0 ? (node as HeaderItem) : root));
        }
      };

      return new Promise((resolve) => {
        treeData.forEach((rootNode) => subVerify(rootNode));
        if (errorList.length > 0) {
          // 批量显示错误通知
          errorList.forEach((error, index) => {
            setTimeout(() => {
              NotifyPlugin.error({
                title: error.title,
                content: error.content,
                duration: 5000 + index * 800, // 错开显示时间
              });
            }, index * 300);
          });
          resolve(false);
        } else {
          resolve(true);
        }
      });
    };

    const onHandlerTreeSubmit = async () => {
      const TREEDATA = headerTreeList.value;
      const isValid = await headerTreeVerify(TREEDATA);
      if (isValid) {
        // 校验通过 设置根节点顺序
        TREEDATA.forEach((rootNode, index) => {
          rootNode.orders = index + 1;
        });
        // 请求-覆盖配置接口
        useRequest({
          url: `${getInternetAPI()}/setHeader/coverAdd`,
          useCustomURL: true,
          methods: 'POST',
          data: {
            data: JSON.stringify(TREEDATA),
          },
          success: (res: any) => {
            const json = JSON.parse(res);
            if (json.errcode !== 0) {
              NotifyPlugin.error({
                title: '设置Header内容失败[Main]',
                content: `因为：${json.errmsg}`,
              });
              return;
            }
            NotifyPlugin.success({
              title: '设置Header内容成功[Main]',
              content: `设置共计${json.data?.all}项菜单，${json.data?.rootNode}个根节点，${json.data?.rootBranch}个分支节点`,
            });
          },
          error: (err: any) => {
            console.error(err);
            NotifyPlugin.error({
              title: '设置Header内容失败[Error]',
              content: err as string,
            });
          },
        });
      } else {
        MessagePlugin.error('菜单结构验证未通过，请根据错误提示修改！');
      }
    };

    const getheaderList = () => {
      useRequest({
        url: `${getInternetAPI()}/getHeaderList`,
        useCustomURL: true,
        methods: 'GET',
        success: (res: any) => {
          const json = JSON.parse(res);
          if (json.errcode !== 0) {
            NotifyPlugin.error({
              title: '获取Header列表失败[Main]',
              content: `因为：${json.errmsg}`,
            });
            return;
          }
          headerTreeList.value = json.data;
        },
        error: (err: any) => {
          console.error(err);
          NotifyPlugin.error({
            title: '获取Header列表失败[Error]',
            content: err as string,
          });
        },
      });
    };

    onMounted(() => {
      getheaderList();
    });

    // --- Render Functions ---

    const renderPreview = () => (
      <div class="headerPreview">
        {headerPreviewIframeVisible.value && (
          <iframe style="height: 305px; width: 100%" scrolling="no" src={headerPreviewUrl.value}></iframe>
        )}
      </div>
    );

    const renderTree = () => (
      <div class="headerTree">
        {headerTreeVisible.value && (
          <TTree
            ref={headerTreeRef}
            keys={{ value: 'id', label: 'label', children: 'children' }}
            activable
            draggable
            expandAll
            hover
            valueMode="all"
            data={headerTreeList.value}
            label={renderHeaderTreeLabel}
            line={true}
            allowDrop={handleHeaderTreeAllowDrop}
            onActive={onHeaderTreeActive}
            onDrop={onHandlerTreeDrop}
          />
        )}
      </div>
    );

    const renderButtonActions = () => (
      <div class="rootNode-ManageButtonGroup">
        <TButton theme="primary" onClick={onHandleAppendHeaderRootNode}>
          添加根菜单
        </TButton>
        {/* 当前菜单level >= 2 时，不允许添加子菜单 当前菜单type为click时，不允许添加子菜单 */}
        <TButton
          disabled={canApplySubMenu.value}
          variant="outline"
          title={canApplySubMenu.value ? '当前状态不允许添加子菜单' : ''}
          onClick={onHandleAppendHeaderSubNode}
        >
          添加子菜单
        </TButton>
        <TButton
          theme="primary"
          variant="outline"
          disabled={!headerTreeHasSelect.value}
          onClick={onHandleAppendHeaderBeforeNode}
        >
          在此项前添加菜单
        </TButton>
        <TButton
          theme="primary"
          variant="outline"
          disabled={!headerTreeHasSelect.value}
          onClick={onHandleAppendHeaderAfterNode}
        >
          在此项后添加菜单
        </TButton>
        <TButton
          theme="danger"
          variant="outline"
          disabled={!headerTreeHasSelect.value}
          onClick={onHandleDeleteHeaderNode}
        >
          删除当前项
        </TButton>
      </div>
    );

    const renderForm = () => {
      if (!headerTreeHasSelect.value) {
        return (
          <div class="headerTree-unChoose">
            <span>请选择一项内容</span>
          </div>
        );
      }

      const { data, source } = headerTreeActiveList;

      return (
        <TForm rules={headerTreeFormRules.value} data={data} colon={true}>
          <div class="NodeManage-view">
            <div>
              <div>
                <TFormItem label="ID" name="id">
                  <TInput v-model:value={data.id} disabled={true}></TInput>
                </TFormItem>
                <TFormItem label="BindParent" name="bindParent">
                  <TInput v-model:value={data.bindParent} disabled={true}></TInput>
                </TFormItem>
                {/* 1级菜单且父菜单为label时有效 */}
                {source.level === 1 && data.parentIsLabel ? (
                  <TFormItem label="项目名称" name="title">
                    <TInput v-model:value={data.title} placeholder="请输入内容"></TInput>
                  </TFormItem>
                ) : (
                  /* 其他菜单项的名称 */
                  <TFormItem label="菜单名称" name="label">
                    <TInput v-model:value={data.label} placeholder="请输入内容"></TInput>
                  </TFormItem>
                )}
                {/* 非根菜单时只允许选择click模式，若父级根菜单为label则不显示 */}
                {!data.parentIsLabel && (
                  <TFormItem label="菜单类型" name="type">
                    <TSelect value={data.type} placeholder="请选择" onChange={onHeaderTypeChange}>
                      {headerTreeTypeOptions.map((item) => (
                        <TOption key={item.value} value={item.value ?? 'click'} label={item.label} />
                      ))}
                    </TSelect>
                  </TFormItem>
                )}
              </div>
            </div>
            <div>
              <div>
                <TFormItem label="是否为页面路由" name="isRouter">
                  <TSwitch v-model:value={data.isRouter} customValue={[1, 0]} style={{ marginLeft: '30px' }} />
                </TFormItem>
                {!data.parentIsLabel && (
                  <TFormItem label={data.isRouter ? '路由地址' : '目标地址'} name="href">
                    <TInput v-model:value={data.href} placeholder="请输入内容"></TInput>
                  </TFormItem>
                )}
                {/* 如果为路由地址，该项无效 */}
                {!data.isRouter && !data.parentIsLabel && (
                  <TFormItem label="跳转方式" name="target">
                    <TSelect
                      v-model:value={data.target}
                      defaultValue="_self"
                      options={headerTreeTargetOptions}
                      placeholder="请选择"
                    ></TSelect>
                  </TFormItem>
                )}
                <TFormItem label="仅pc端可见" name="onlyPC">
                  <TSwitch v-model:value={data.onlyPC} customValue={[1, 0]} />
                </TFormItem>
                <TFormItem label="仅移动端可见" name="onlyMobile">
                  <TSwitch v-model:value={data.onlyMobile} customValue={[1, 0]} style={{ marginLeft: '12px' }} />
                </TFormItem>
              </div>
            </div>
          </div>
        </TForm>
      );
    };

    const renderPushManagement = () => (
      <TSpace direction="vertical" style={{ width: '100%' }}>
        <TButton block theme="primary" variant="dashed" size="large" onClick={refreshHeaderPreview}>
          刷新预览窗口
        </TButton>
        <TButton block theme="primary" variant="dashed" size="large" onClick={onOpenPreviewUrl}>
          打开预览地址
        </TButton>
        <TButton block theme="primary" size="large" onClick={onHandlerTreeSubmit}>
          校验 -&gt; 推送
        </TButton>
      </TSpace>
    );

    return () => (
      <div class="headerManage">
        <div style={{ font: 'var(--td-font-body-medium)', paddingLeft: '4px', marginBottom: '-6px' }}>
          <span>
            <strong>PREVIEW</strong>
            （1. 预览页面仅供参考，建议根菜单项小于10项 2. 配置状态下，路由跳转会被禁用）：
          </span>
        </div>
        {renderPreview()}
        <div class="htm">
          {renderTree()}
          <div class="headerTree-Manage">
            {renderButtonActions()}
            <div class="card__title">内容管理</div>
            <div class="NodeManage">
              {renderForm()}
              <div class="card__title">推送管理</div>
              {renderPushManagement()}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
