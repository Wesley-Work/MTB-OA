<template>
    <div class="grouplist">
        <t-card bordered :style="{ width: '340px' }" @click="showAddDrawer">
            <template #content>
                <div style="display: flex;flex-direction: column; justify-content: center; align-items: center;min-height: 143px;">
                    <AddRectangleIcon style="font-size: 48px;" />
                    <div style="font: var(--td-font-body-medium);margin-top: 8px;">添加新组</div>
                </div>
            </template>
        </t-card>
        <t-card bordered :style="{ width: '340px' }" v-for="(item,index) in groupList" v-key="item.id">
            <template #header>
                <div style="font: var(--td-font-title-medium);">『{{ item.id }}』 {{ item.name }} [{{ item.desc }}]</div>
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
    <t-dialog v-model:visible="dialogVisible" width="35%" :cancelBtn="null" confirmBtn="关闭" :onConfirm="() => { dialogVisible = false }">
        <template #header>
            <div style="font: var(--td-font-title-medium);">{{ dialogData.title }}</div>
        </template>
        <template #body>
            <div class="groupUserList-dialog-content">
                <div class="groupUserList-dialog-content--item" v-for="(item) in dialogData.content">{{ item }}</div>
            </div>
        </template>
    </t-dialog>
    <!---->
    <t-drawer v-model:visible="drawerVisible" :onClose="() => { drawerVisible = false }" size="36%">
      <template #header>{{ drawerData.mode === "add" ? '添加' : '编辑' }}组</template>
        <t-form ref="form" :rules="drawerRule" :data="drawerData" :colon="true" @reset="onReset" @submit="onSubmit">
            <t-form-item label="id" name="id" v-if="drawerData.mode === 'edit'">
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
          
            <t-form-item label="更新到用户" name="updateToUser" v-if="drawerData.mode === 'add'">
                <t-transfer
                    :data="transferUserSource"
                    :value="drawerData.updateToUser"
                    :search="true"
                >
                    <template #title="props">
                        <div>{{ props.type === 'target' ? '目标' : '来源' }}</div>
                    </template>
                </t-transfer>
            </t-form-item>

            <t-form-item label="组权限" name="permission">
                <t-transfer
                    class="transfer-horizontal transfer-item--width-fit-content"
                    :data="transferPermissionSource"
                    :value="drawerData.permission"
                >
                    <template #title="props">
                        <div>{{ props.type === 'target' ? '目标' : '来源' }}</div>
                    </template>
                </t-transfer>
            </t-form-item>
            
        </t-form>
    </t-drawer>
</template>

<script setup lang="ts">
import { Edit2Icon, ListIcon, DeleteIcon, AddRectangleIcon } from 'tdesign-icons-vue-next';
import useRequest from '../../hooks/useRequest';
import { computed, onMounted, reactive, ref } from 'vue';
import { MessagePlugin, NotifyPlugin } from 'tdesign-vue-next';
import { GroupItem, GroupList, GroupPermissionList, GroupUserList, UserList } from '../../types/type';

const groupList = ref(<GroupList>[]);
const userGroupList = ref(<GroupUserList>[]);
const userList = ref(<UserList>[]);
const transferUserSource = computed(() => {
    return userList.value.map((item) => {
        return {
            label: item.name,
            value: item.id,
        };
    });
});
const permissionList = ref([]);
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
        label: "正常",
        value: "normal",
    },
    {
        label: "特殊（不可参与一些功能）",
        value: "display",
    },
    {
        label: "注销",
        value: "close",
    },
];
const groupPermission = ref(<GroupPermissionList>[]);
const dialogVisible = ref(false);
const dialogData = reactive({
    title: "",
    content: [],
});
const drawerVisible = ref(false);
const drawerData = ref({
    id: -1,
    mode: "",
    name: "",
    type: "",
    desc: "",
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
}
const props = defineProps({
    handleChangeComponent: Function,
});

const getGroupList = () => {
    useRequest({
        url: "/group/list",
        methods: "POST",
        success: function (res) {
            const result = JSON.parse(res)
            if (result.errcode != 0) {
                NotifyPlugin.error({
                    title: "获取组列表失败",
                    content: result.errmsg,
                })
                return;
            }
            groupList.value = result.data
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "获取组列表失败",
                content: err
            })
        }
    })
};

const getUserGroupList = () => {
    useRequest({
        url: "/group/user",
        methods: "POST",
        success: function (res) {
            const result = JSON.parse(res)
            if (result.errcode != 0) {
                NotifyPlugin.error({
                    title: "获取组内用户列表失败",
                    content: result.errmsg,
                })
                return;
            }
            userGroupList.value = result.data
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "获取组内用户列表失败",
                content: err
            })
        }
    })
};

const getUserList = () => {
    useRequest({
        url: "/user/list",
        methods: "POST",
        success: function (res) {
            const result = JSON.parse(res)
            if (result.errcode != 0) {
                NotifyPlugin.error({
                    title: "获取组内用户列表失败",
                    content: result.errmsg,
                })
                return;
            }
            userList.value = result.data
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "获取组内用户列表失败",
                content: err
            })
        }
    })
};

const getSystemPermission = () => {
    useRequest({
        url: "/permissions/systemlist",
        methods: "POST",
        success: function (res) {
            const result = JSON.parse(res)
            if (result.errcode != 0) {
                NotifyPlugin.error({
                    title: "获取系统权限失败",
                    content: result.errmsg,
                })
                return;
            }
            permissionList.value = result.data
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "获取系统权限失败",
                content: err
            })
        }
    })

}

const getGroupPermission = () => {
    useRequest({
        url: "/permissions/Allgrouplist",
        methods: "POST",
        success: function (res) {
            const result = JSON.parse(res)
            if (result.errcode != 0) {
                NotifyPlugin.error({
                    title: "获取组权限失败",
                    content: result.errmsg,
                })
                return;
            }
            groupPermission.value = result.data
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "获取组权限失败",
                content: err
            })
        }
    })
}

const showWhoInGroup = (groupItem) => {
    const { id } = groupItem
    const userList = userGroupList.value[id]
    dialogData.title = `『${id}』 ${groupItem.name} 组内成员`
    dialogData.content = userList.map((user) => {
        return user?.name
    })
    dialogVisible.value = true
}

const showAddDrawer = () => {
    drawerVisible.value = true
    drawerData.value.mode = "add"
}

const showEditDrawer = (groupItem: GroupItem) => {
    const { id, type, name, desc } = groupItem
    const permission = groupPermission.value.filter(item => {
        return item?.id === id
    })[0]?.permissionsList
    console.log(permission)
    drawerData.value = {
        mode: "edit",
        id,
        type,
        name,
        desc,
        updateToUser: [],
        permission: [],
    }
    drawerVisible.value = true
}

const onReset = () => {
  MessagePlugin.success('重置成功');
};

const onSubmit = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    MessagePlugin.success('提交成功');
  } else {
    console.log('Validate Errors: ', firstError, validateResult);
    MessagePlugin.warning(firstError);
  }
};

onMounted(() => {
    // 用户列表
    getUserList()
    // 权限列表
    getSystemPermission()
    // 组权限
    getGroupPermission()
    // 组列表
    getGroupList()
    // 组内用户列表
    getUserGroupList()
});
</script>

<script lang="ts">
export default {
  name: 'GroupManage'
}
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
    .groupUserList-dialog-content--item {
        padding: 14px;
        border: 1px solid var(--td-text-color-primary);
        font: var(--td-font-body-large);
        color: var(--td-text-color-primary);
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
            gap: 0px !important;
        }
        .t-transfer__list-item {
            width: fit-content !important;
            margin-left: 0px !important;
        }
    }
}

</style>