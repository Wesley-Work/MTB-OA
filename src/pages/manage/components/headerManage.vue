<template>
  <div class="headerManage">
    <div style="font: var(--td-font-body-medium); padding-left: 4px; margin-bottom: -6px">
      <span>
        <strong>PREVIEW</strong>
        （1. 预览页面仅供参考，建议根菜单项小于10项 2. 配置状态下，路由跳转会被禁用）：
      </span>
    </div>
    <div class="headerPreview">
      <iframe
        v-if="headerPreviewIframeVisible"
        style="height: 305px; width: 100%"
        scrolling="no"
        :src="headerPreviewUrl"
      ></iframe>
    </div>
    <div class="htm">
      <div class="headerTree">
        <t-tree
          v-if="headerTreeVisible"
          :key="{ value: 'label', label: 'label', children: 'children' }"
          ref="headerTreeRef"
          v-memo="[headerTreeList]"
          activable
          draggable
          expand-all
          hover
          value-mode="all"
          :data="headerTreeList"
          :label="renderHeaderTreeLabel"
          :line="true"
          :allow-drop="handleHeaderTreeAllowDrop"
          @active="onHeaderTreeActive"
          @drop="onHanderTreeDrop"
        >
        </t-tree>
      </div>
      <div class="headerTree-Manage">
        <!---->
        <div class="rootNode-ManageButtonGroup">
          <t-button theme="primary" @click="onHandleAppendHeaderRootNode"> 添加根菜单 </t-button>
          <!-- 当前菜单level >= 2 时，不允许添加子菜单 当前菜单type为click时，不允许添加子菜单 -->
          <t-button
            :disabled="canApplySubMenu"
            variant="outline"
            :title="canApplySubMenu ? '当前状态不允许添加子菜单' : ''"
            @click="onHandleAppendHeaderSubNode"
          >
            添加子菜单
          </t-button>
          <t-button
            theme="primary"
            variant="outline"
            :disabled="!headerTreeHasSelect"
            @click="onHandleAppendHeaderBeforeNode"
          >
            在此项前添加菜单
          </t-button>
          <t-button
            theme="primary"
            variant="outline"
            :disabled="!headerTreeHasSelect"
            @click="onHandleAppendHeaderAfterNode"
          >
            在此项后添加菜单
          </t-button>
          <t-button theme="danger" variant="outline" :disabled="!headerTreeHasSelect" @click="onHandleDeleteHeaderNode">
            删除当前项
          </t-button>
        </div>
        <!---->
        <div style="font: var(--td-font-title-large); padding: 16px 12px">内容管理</div>
        <!---->
        <div class="NodeManage">
          <div v-if="!headerTreeHasSelect" class="headerTree-unChoose">
            <span>请选择一项内容</span>
          </div>
          <!---->
          <div v-else>
            <t-form ref="form" :rules="headerTreeFormRules" :data="headerTreeActiveList.data" :colon="true">
              <div class="NodeManage-view">
                <div>
                  <div>
                    <t-form-item label="ID" name="id">
                      <t-input v-model:value="headerTreeActiveList.data.id" :disabled="true"></t-input>
                    </t-form-item>
                    <t-form-item label="BindParent" name="bindParent">
                      <t-input v-model:value="headerTreeActiveList.data.bindParent" :disabled="true"></t-input>
                    </t-form-item>
                    <!--1级菜单且父菜单为label时有效-->
                    <t-form-item
                      v-if="headerTreeActiveList.source.level === 1 && headerTreeActiveList.data.parentIsLabel"
                      label="项目名称"
                      name="title"
                    >
                      <t-input v-model:value="headerTreeActiveList.data.title" placeholder="请输入内容"></t-input>
                    </t-form-item>
                    <!--其他菜单项的名称-->
                    <t-form-item v-else label="菜单名称" name="label">
                      <t-input v-model:value="headerTreeActiveList.data.label" placeholder="请输入内容"></t-input>
                    </t-form-item>
                    <!--非根菜单时只允许选择click模式，若父级根菜单为label则不显示-->
                    <t-form-item v-if="!headerTreeActiveList.data.parentIsLabel" label="菜单类型" name="type">
                      <t-select
                        v-model:value="headerTreeActiveList.data.type"
                        default-value="click"
                        placeholder="请选择"
                      >
                        <t-option
                          v-for="item in headerTreeTypeOptions"
                          :key="item.value"
                          :value="item.value ?? 'click'"
                          :label="item.label"
                          :disabled="headerTypeSelectDisabled(headerTreeActiveList.data, item)"
                          :title="
                            headerTypeSelectDisabled(headerTreeActiveList.data, item)
                              ? '当前菜单位置不支持选择该类型'
                              : ''
                          "
                        />
                      </t-select>
                    </t-form-item>
                  </div>
                </div>
                <div>
                  <div>
                    <t-form-item label="是否为页面路由" name="isRouter">
                      <t-switch
                        v-model:value="headerTreeActiveList.data.isRouter"
                        :custom-value="[1, 0]"
                        style="margin-left: 30px"
                      />
                    </t-form-item>
                    <t-form-item
                      v-if="!headerTreeActiveList.data.parentIsLabel"
                      :label="headerTreeActiveList.data.isRouter ? '路由地址' : '目标地址'"
                      name="href"
                    >
                      <t-input v-model:value="headerTreeActiveList.data.href" placeholder="请输入内容"></t-input>
                    </t-form-item>
                    <!--如果为路由地址，该项无效-->
                    <t-form-item
                      v-if="!headerTreeActiveList.data.isRouter && !headerTreeActiveList.data.parentIsLabel"
                      label="跳转方式"
                      name="target"
                    >
                      <t-select
                        v-model:value="headerTreeActiveList.data.target"
                        default-value="_self"
                        :options="headerTreeTargetOptions"
                        placeholder="请选择"
                      ></t-select>
                    </t-form-item>
                    <t-form-item label="仅pc端可见" name="onlyPC">
                      <t-switch v-model:value="headerTreeActiveList.data.onlyPC" :custom-value="[1, 0]" />
                    </t-form-item>
                    <t-form-item label="仅移动端可见" name="onlyMobile">
                      <t-switch
                        v-model:value="headerTreeActiveList.data.onlyMobile"
                        :custom-value="[1, 0]"
                        style="margin-left: 12px"
                      />
                    </t-form-item>
                  </div>
                </div>
              </div>
            </t-form>
            <!---->
          </div>
          <!---->
          <div style="font: var(--td-font-title-large); padding: 16px 12px">推送管理</div>
          <t-space direction="vertical" style="width: 100%">
            <t-button block theme="primary" variant="dashed" size="large" @click="refreshHeaderPreview">
              刷新预览窗口
            </t-button>
            <t-button block theme="primary" variant="dashed" size="large" @click="onOpenPreviewUrl">
              打开预览地址
            </t-button>
            <t-button block theme="primary" size="large" @click="onHandlerTreeSubmit"> 校验 -> 推送 </t-button>
          </t-space>
          <!---->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from 'vue';
import useRequest from '@hooks/useRequest';
import {
  DialogPlugin,
  MessagePlugin,
  NotifyPlugin,
  TreeInstanceFunctions,
  TreeProps,
  TypeTreeNode,
} from 'tdesign-vue-next';
import dayjs from 'dayjs';
import { isNumber } from 'lodash-es';
import { getInternetAPI } from '@utils/index';

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

const headerPreviewUrl = computed(() => {
  return 'http://localhost:14560/#/config/header?testData=' + JSON.stringify(headerTreeList.value);
});
const headerPreviewIframeVisible = ref(true);
const headerTreeRef = ref<TreeInstanceFunctions>();
const headerTreeFormRules = {
  label: [{ required: true, message: '名称必填' }],
  type: [{ required: true, message: '菜单类型必填' }],
  href: [{ required: true, message: '目标地址必填' }],
};
const headerTreeVisible = ref(true);
const headerTreeList = ref<HeaderData>([]);
const headerTreeActiveList = reactive<HeaderTreeActiveList>({
  active: [],
  data: {},
  source: null,
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

// 是否为禁用状态
const headerTypeSelectDisabled = (node: HeaderItem, option: HeaderTreeTypeOption) => {
  const { source } = headerTreeActiveList;
  if ((node?.mode === 'add' || !node?.children) && source.level === 0) return false;
  return (
    (['label', 'list'].includes(option.value) && node?.type !== option.value) ||
    (option.value === 'click' && ['list', 'label'].includes(node?.type))
  );
};

// 父级节点type是否为label
const isLabelParent = (sourceNode) => {
  const parent = headerTreeList.value.find((item) => item?.id === sourceNode.data?.bindParent);
  return (parent?.type === 'label' && sourceNode?.level === 1) || sourceNode >= 2;
};

// 只允许拖拽到非click菜单，即禁止自行创建新子菜单
const renderHeaderTreeLabel: TreeProps['label'] = (_h, node) => {
  const isEmpty = !!node.data?.label || !!node.data?.title;
  return isEmpty ? node.data?.label ?? node.data?.title : `菜单_${node.data?.id}`;
};

const cleanHeaderActive = () => {
  headerTreeActiveList.active = [];
  headerTreeActiveList.data = {};
  headerTreeActiveList.source = null;
};

const onHeaderTreeActive = (value, context) => {
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

// 禁止拖拽到click菜单，禁止有子项的节点拖到其他有子项的节点下
const handleHeaderTreeAllowDrop: TreeProps['allowDrop'] = (ctx) => {
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

const refreshHeaderTree = () => {
  headerTreeRef.value.refresh();
  setTimeout(() => {
    headerTreeList.value = headerTreeRef.value.getTreeData() as HeaderData;
  }, 0);
};

const onHanderTreeDrop: TreeProps['onDrop'] = () => {
  // 更新当前headerList列表
  refreshHeaderTree();
};

// 插入一个根节点
const onHandleAppendHeaderRootNode = () => {
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
  if (item) {
    headerTreeRef.value.appendTo('', item);
  }
  refreshHeaderTree();
};

// 插入子节点
const onHandleAppendHeaderSubNode = () => {
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
  if (item) {
    headerTreeRef.value.appendTo(headerTreeActiveList.active[0], item);
  }
  refreshHeaderTree();
};

// 在选中节点前添加节点
const onHandleAppendHeaderBeforeNode = () => {
  const brother = headerTreeActiveList.data;
  var bindParent;
  var type;
  // 如果parentIsLabel为1，则type需要清空（不清空也行，因为最终提交时会校验tree内容）
  type = brother.parentIsLabel === 1 ? '' : 'click';
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
  if (item) {
    headerTreeRef.value.insertBefore(headerTreeActiveList.active[0], item);
  }
  refreshHeaderTree();
};

// 在选中节点前添加节点
const onHandleAppendHeaderAfterNode = () => {
  const brother = headerTreeActiveList.data;
  var bindParent;
  var type;
  // 如果parentIsLabel为1，则type需要清空（不清空也行，因为最终提交时会校验tree内容）
  type = brother.parentIsLabel === 1 ? '' : 'click';
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
  if (item) {
    headerTreeRef.value.insertAfter(headerTreeActiveList.active[0], item);
  }
  refreshHeaderTree();
};

// 删除选中节点
const onHandleDeleteHeaderNode = () => {
  // headerTreeRef.value.remove(headerTreeActiveList.source.value);
  // 因为TD TREE的刷新bug，需要用另一个办法删除。。

  const executeDelete = () => {
    const targetId = headerTreeActiveList.data.id;

    // 广度优先搜索查找节点及其父级
    const findNode = (nodes: HeaderItem[]) => {
      const queue: { node: HeaderItem; parentArr?: HeaderItem[]; index?: number }[] = nodes.map((n, index) => ({
        node: n,
        parentArr: nodes,
        index,
      }));

      while (queue.length > 0) {
        const shifted = queue.shift();
        if (!shifted) {
          return null;
        }
        const { node, parentArr, index } = shifted;

        // 找到目标节点
        if (node.id === targetId) {
          return { parentArr, index };
        }

        // 继续搜索子节点
        if (node.children) {
          node.children.forEach((child, childIndex) => {
            queue.push({
              node: child as HeaderItem,
              parentArr: node.children as HeaderItem[],
              index: childIndex,
            });
          });
        }
      }
      return null;
    };

    // 执行删除
    const result = findNode(headerTreeList.value);
    if (result?.parentArr && result.index !== undefined) {
      result.parentArr.splice(result.index, 1);
      cleanHeaderActive();
      refreshHeaderTree();
    } else {
      MessagePlugin.warning('未找到要删除的节点');
    }
  };

  const targetNode = headerTreeActiveList.data;
  const hasChildren = targetNode.children?.length > 0;
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

// 刷新预览
const refreshHeaderPreview = () => {
  headerPreviewIframeVisible.value = false;
  setTimeout(() => {
    headerPreviewIframeVisible.value = true;
  }, 10);
  MessagePlugin.success('刷新成功');
};

// 打开预览地址
const onOpenPreviewUrl = () => {
  setTimeout(() => {
    window.open(headerPreviewUrl.value);
  }, 500);
};

// 菜单树结构验证
type HeaderTree = HeaderItem | HeaderItemChildren;
const headerTreeVerify = (treeData: HeaderData): Promise<boolean> => {
  NotifyPlugin.closeAll();
  // 错误合集
  const errorList: Array<{ title: string; content: string }> = [];
  // level 0 的内容限制： label必须有值 bindParent必须为0或任意空值 type为click则href必须有值 type为label或list必须有children
  // level 1 的内容限制： 如果type不为click，则bindParent不能为0或任意空值，如果type不为click 则title必须有值 label不能有值
  // level 2 的内容限制： 根节点type必须为label，label必须有值 bindParent不能为0或任意空值 href必须有值 type必须为click
  const subVerify = (node: HeaderTree, level = 0, root?: HeaderItem): void => {
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
      node.children.forEach((child) => subVerify(child as HeaderTree, level + 1, level === 0 ? node : root));
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
      success: function (res) {
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
      error: function (err) {
        console.error(err);
        NotifyPlugin.error({
          title: '设置Header内容失败[Error]',
          content: err,
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
    success: function (res) {
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
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取Header列表失败[Error]',
        content: err,
      });
    },
  });
};

onMounted(() => {
  getheaderList();
});
</script>

<script lang="tsx">
export default {
  name: 'HeaderManage',
};
</script>

<style lang="scss">
.headerManage {
  margin: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: var(--td-bg-color-component);
  .headerPreview {
    width: 100%;
    height: 305px;
    iframe {
      width: 100%;
      height: 305px;
      border: none;
    }
  }
  .htm {
    display: flex;
    flex-direction: row;
    gap: 6px;
    .headerTree,
    .headerTree-Manage {
      background-color: var(--td-bg-color-container);
    }
    .headerTree {
      width: 18%;
      min-width: 15%;
      padding: 12px 12px 12px 0;
    }
    .headerTree-Manage {
      width: 100%;
      padding: 12px;
      .rootNode-ManageButtonGroup {
        display: flex;
        flex-direction: row;
        gap: 12px;
      }
      .NodeManage {
        .headerTree-unChoose {
          font: var(--td-font-title-medium);
          color: var(--td-text-color-secondary);
          text-align: center;
          line-height: 180px;
          letter-spacing: 0.5px;
          background-color: var(--td-bg-color-container-hover);
        }
        .NodeManage-view {
          display: flex;
          flex-direction: row;
          gap: 12px;
          > div {
            width: 50%;
          }
        }
      }
    }
  }
}
</style>
