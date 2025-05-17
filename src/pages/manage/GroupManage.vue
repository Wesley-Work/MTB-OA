<template>
  <div class="grouplist">
    <t-card bordered :style="{ width: '340px' }" @click="showAddDrawer">
      <template #content>
        <div
          style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 143px"
        >
          <AddRectangleIcon style="font-size: 48px" />
          <div style="font: var(--td-font-body-medium); margin-top: 8px">添加新组</div>
        </div>
      </template>
    </t-card>
    <t-card v-for="item in groupList" :key="item.id" bordered :style="{ width: '340px' }">
      <template #header>
        <div style="font: var(--td-font-title-medium)">『{{ item.id }}』 {{ item.name }} [{{ item.desc }}]</div>
      </template>
      <template #content>
        <div class="group-length">共 {{ userGroupList[item.id]?.length ?? 0 }} 人</div>
      </template>
      <template #footer>
        <t-row :align="'middle'" justify="center" style="gap: 24px">
          <t-col flex="auto" style="display: inline-flex; justify-content: center">
            <t-button variant="text" shape="square" @click="showEditDrawer(item)">
              <Edit2Icon />
            </t-button>
          </t-col>

          <t-col flex="auto" style="display: inline-flex; justify-content: center">
            <t-button variant="text" shape="square" @click="showWhoInGroup(item)">
              <ListIcon />
            </t-button>
          </t-col>

          <t-col flex="auto" style="display: inline-flex; justify-content: center">
            <t-button variant="text" shape="square">
              <DeleteIcon />
            </t-button>
          </t-col>
        </t-row>
      </template>
    </t-card>
  </div>
  <!---->
  <t-dialog
    v-model:visible="dialogVisible"
    width="35%"
    :cancel-btn="null"
    confirm-btn="关闭"
    :on-confirm="
      () => {
        dialogVisible = false;
      }
    "
  >
    <template #header>
      <div style="font: var(--td-font-title-medium)">{{ dialogData.title }}</div>
    </template>
    <template #body>
      <div class="groupUserList-dialog-content">
        <t-button v-for="item in dialogData.content" :key="item" variant="dashed" theme="primary">{{ item }}</t-button>
      </div>
    </template>
  </t-dialog>
  <!---->
  <t-drawer
    v-model:visible="drawerVisible"
    :on-close="
      () => {
        drawerVisible = false;
      }
    "
    size="36%"
    :on-confirm="handleSubmit"
  >
    <template #header>{{ drawerData.mode === 'add' ? '添加' : '编辑' }}组</template>
    <t-form ref="drawerFormEl" :rules="drawerRule" :data="drawerData" :colon="true">
      <t-form-item v-if="drawerData.mode === 'edit'" label="id" name="id">
        <t-input v-model="drawerData.id" placeholder="请输入内容"></t-input>
      </t-form-item>

      <t-form-item label="组名" name="name">
        <t-input v-model="drawerData.name" placeholder="请输入内容"></t-input>
      </t-form-item>

      <t-form-item label="组类型" name="type">
        <t-select v-model="drawerData.type" :options="groupType" placeholder="请选择"></t-select>
      </t-form-item>

      <t-form-item label="描述（备注）" name="desc">
        <t-input v-model="drawerData.desc" placeholder="请输入内容"></t-input>
      </t-form-item>

      <t-form-item v-if="drawerData.mode === 'add'" label="更新到用户" name="updateToUser">
        <t-transfer
          :data="transferUserSource"
          :value="drawerData.updateToUser"
          :search="true"
          :operation="['移除', '添加']"
          :on-change="userTransferChange"
          class="transfer-custom"
        >
          <template #title="props">
            <div>{{ props.type === 'target' ? '目标' : '来源' }}</div>
          </template>
        </t-transfer>
      </t-form-item>

      <t-form-item label="组权限" name="permission">
        <t-transfer
          class="transfer-horizontal transfer-item--width-fit-content transfer-custom"
          :data="transferPermissionSource"
          :value="drawerData.permission"
          :operation="['移除', '添加']"
          :on-change="permissionTransferChange"
        >
          <template #title="props">
            <div>{{ props.type === 'target' ? '目标' : '来源' }}</div>
          </template>
        </t-transfer>
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script setup lang="tsx">
import { Edit2Icon, ListIcon, DeleteIcon, AddRectangleIcon } from 'tdesign-icons-vue-next';
import useRequest from '../../hooks/useRequest';
import { computed, onMounted, reactive, ref } from 'vue';
import { NotifyPlugin } from 'tdesign-vue-next';
import { GroupItem, GroupList, GroupPermissionList, GroupUserList, UserList } from '../../types/type';

defineProps({
  handleChangeComponent: Function,
});
const drawerFormEl = ref(null);
const groupList = ref<GroupList>([]);
const userGroupList = ref<GroupUserList>([]);
const userList = ref<UserList>([]);
const permissionList = ref([]);
const transferUserSource = computed(() => {
  return userList.value.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
});
const transferPermissionSource = computed(() => {
  return permissionList.value.map((item) => {
    return {
      label: item.object,
      value: item.val,
    };
  });
});
const groupType = [
  {
    label: '正常',
    value: 'normal',
  },
  {
    label: '特殊（不可参与一些功能）',
    value: 'display',
  },
  {
    label: '注销',
    value: 'close',
  },
];
const groupPermission = ref<GroupPermissionList>([]);
const dialogVisible = ref(false);
const dialogData = reactive({
  title: '',
  content: [],
});
const drawerVisible = ref(false);
const drawerData = ref({
  id: -1,
  mode: '',
  name: '',
  type: '',
  desc: '',
  updateToUser: [],
  permission: [],
});
const drawerRule = {
  name: [
    {
      required: true,
      message: '组名必填',
    },
  ],
  type: [
    {
      required: true,
      message: '组类型必填',
    },
  ],
};

const getGroupList = () => {
  useRequest({
    url: '/group/list',
    methods: 'POST',
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode != 0) {
        NotifyPlugin.error({
          title: '获取组列表失败',
          content: result.errmsg,
        });
        return;
      }
      groupList.value = result.data;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取组列表失败',
        content: err,
      });
    },
  });
};

const getUserGroupList = () => {
  useRequest({
    url: '/group/user',
    methods: 'POST',
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode != 0) {
        NotifyPlugin.error({
          title: '获取组内用户列表失败',
          content: result.errmsg,
        });
        return;
      }
      userGroupList.value = result.data;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取组内用户列表失败',
        content: err,
      });
    },
  });
};

const getUserList = () => {
  useRequest({
    url: '/user/list',
    methods: 'POST',
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode != 0) {
        NotifyPlugin.error({
          title: '获取组内用户列表失败',
          content: result.errmsg,
        });
        return;
      }
      userList.value = result.data;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取组内用户列表失败',
        content: err,
      });
    },
  });
};

const getSystemPermission = () => {
  useRequest({
    url: '/permissions/systemlist',
    methods: 'POST',
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode != 0) {
        NotifyPlugin.error({
          title: '获取系统权限失败',
          content: result.errmsg,
        });
        return;
      }
      permissionList.value = result.data;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取系统权限失败',
        content: err,
      });
    },
  });
};

const getGroupPermission = () => {
  useRequest({
    url: '/permissions/Allgrouplist',
    methods: 'POST',
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode != 0) {
        NotifyPlugin.error({
          title: '获取组权限失败',
          content: result.errmsg,
        });
        return;
      }
      groupPermission.value = result.data;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取组权限失败',
        content: err,
      });
    },
  });
};

const showWhoInGroup = (groupItem) => {
  const { id } = groupItem;
  const userList = userGroupList.value[id];
  dialogData.title = `『${id}』 ${groupItem.name} 组内成员`;
  dialogData.content = userList.map((user) => {
    return user?.name;
  });
  dialogVisible.value = true;
};

const showAddDrawer = () => {
  drawerVisible.value = true;
  drawerData.value.mode = 'add';
  drawerFormEl.value.reset();
};

const showEditDrawer = (groupItem: GroupItem) => {
  const { id, type, name, desc } = groupItem;
  const permission = groupPermission.value
    .filter((item) => {
      return item?.id === id;
    })[0]
    ?.permissionsList.map((item) => item.val);
  drawerData.value = {
    mode: 'edit',
    id,
    type,
    name,
    desc,
    permission,
    updateToUser: [],
  };
  drawerVisible.value = true;
};

const hideDrawer = () => {
  drawerVisible.value = false;
  drawerFormEl.value.reset();
};

// 抽屉提交
const handleSubmit = () => {
  drawerFormEl.value.validate().then((validateResult) => {
    if (validateResult && Object.keys(validateResult).length) {
      // 有错误
      console.error('表单校验失败', validateResult);
      return;
    }
    // 提交数据
    drawerData.value.mode === 'add' ? addGroupSubmit() : editGroupSubmit();
  });
};

// 添加提交
const addGroupSubmit = () => {
  const { name, desc, type, updateToUser, permission } = drawerData.value;
  useRequest({
    url: '/group/add',
    methods: 'POST',
    data: {
      name,
      desc,
      type,
      push: updateToUser,
      permission,
    },
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode != 0) {
        NotifyPlugin.error({
          title: '添加组失败',
          content: result.errmsg,
        });
        return;
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '添加组失败',
        content: err,
      });
    },
    complete: () => {
      hideDrawer();
      getGroupList();
    },
  });
};

// 编辑提交
const editGroupSubmit = () => {
  const { id, name, desc, type, permission } = drawerData.value;
  useRequest({
    url: '/group/edit',
    methods: 'POST',
    data: {
      id,
      name,
      type,
      desc,
      permission,
    },
    success: function (res) {
      const result = JSON.parse(res);
      if (result.errcode != 0) {
        NotifyPlugin.error({
          title: '编辑组失败',
          content: result.errmsg,
        });
        return;
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '编辑组失败',
        content: err,
      });
    },
    complete: () => {
      hideDrawer();
      getGroupList();
    },
  });
};

const permissionTransferChange = (targetValue) => {
  drawerData.value.permission = targetValue;
};

const userTransferChange = (targetValue) => {
  drawerData.value.updateToUser = targetValue;
};

onMounted(() => {
  // 用户列表
  getUserList();
  // 权限列表
  getSystemPermission();
  // 组权限
  getGroupPermission();
  // 组列表
  getGroupList();
  // 组内用户列表
  getUserGroupList();
});
</script>

<script lang="tsx">
export default {
  name: 'GroupManage',
};
</script>

<style lang="scss">
.grouplist {
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex-wrap: wrap;
}

.groupUserList-dialog-content {
  display: flex;
  flex-direction: row;
  gap: 4px;
  flex-wrap: wrap;
}

.transfer-custom .t-button .t-icon {
  display: none;
  & + .t-button__text:not(:empty) {
    margin-left: 0;
  }
}

.transfer-horizontal {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  width: 100%;
  gap: 16px;
  .t-transfer__list {
    width: 100%;
    .t-transfer__list-header {
      width: calc(100% - var(--td-comp-margin-s) * 2) !important;
    }
  }
  .t-transfer__operations {
    flex-direction: row !important;
  }
  &.transfer-item--width-fit-content {
    .t-checkbox-group {
      flex-direction: row !important;
      gap: 8px 0px !important;
      padding: 0px 8px;
    }
    .t-transfer__list-item {
      width: fit-content !important;
      margin-left: 0px !important;
    }
  }
}
</style>
