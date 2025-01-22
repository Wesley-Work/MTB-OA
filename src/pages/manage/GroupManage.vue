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
                  <t-button variant="text" shape="square">
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
    <t-drawer v-model:visible="drawerVisible" :onClose="() => { drawerVisible = false }" size="30%">
      <template #header>{{ drawerData.mode === "add" ? '添加' : '编辑' }}组</template>
        <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true" @reset="onReset" @submit="onSubmit">
            <t-form-item label="姓名" name="name">
              <t-input v-model="formData.name" placeholder="请输入内容" @enter="onEnter"></t-input>
            </t-form-item>
          
            <t-form-item label="手机号码" name="tel">
              <t-input v-model="formData.tel" placeholder="请输入内容" @enter="onEnter"></t-input>
            </t-form-item>
          
            <t-form-item label="接收短信" name="status">
              <t-switch v-model="formData.status"></t-switch>
            </t-form-item>
          
            <t-form-item label="性别" name="gender">
              <t-radio-group v-model="formData.gender">
                <t-radio value="1">男</t-radio>
                <t-radio value="2">女</t-radio>
              </t-radio-group>
            </t-form-item>
          
            <t-form-item label="课程" name="course">
              <t-checkbox-group v-model="formData.course" :options="courseOptions"></t-checkbox-group>
            </t-form-item>
          
            <t-form-item>
              <t-space size="small">
                <t-button theme="primary" type="submit">提交</t-button>
                <t-button theme="default" variant="base" type="reset">重置</t-button>
                <!-- 下方示例代码，有效，勿删 -->
                <!--<t-button theme="default" @click="submitForm">实例方法提交</t-button>-->
                <!--<t-button theme="default" variant="base" @click="resetForm">实例方法重置</t-button>-->
                <!--<t-button theme="default" variant="base" @click="validateOnly">仅校验</t-button>-->
              </t-space>
            </t-form-item>
        </t-form>
    </t-drawer>
</template>

<script setup lang="ts">
import { Edit2Icon, ListIcon, DeleteIcon, AddRectangleIcon } from 'tdesign-icons-vue-next';
import useRequest from '../../hooks/useRequest';
import { onMounted, reactive, ref } from 'vue';
import { NotifyPlugin } from 'tdesign-vue-next';

const groupList = ref([]);
const userGroupList = ref([]);
const userList = ref([]);
const dialogVisible = ref(false);
const dialogData = reactive({
    title: "",
    content: [],
});
const drawerVisible = ref(false);
const drawerData = reactive({
    mode: "",
    type: "",
    user: [],
    desc: "",
    name: "",
    id: "",
    permission: [],
});
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
    drawerData.mode = "add"
}

onMounted(() => {
    // 组列表
    getGroupList()
    // 组内用户列表
    getUserGroupList()
    // 用户列表
    getUserList()
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

</style>