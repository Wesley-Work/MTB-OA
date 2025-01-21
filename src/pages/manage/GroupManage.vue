<template>
    <div style="display: flex;flex-direction: row;gap: 12px;flex-wrap: wrap;">
        <t-card bordered :style="{ width: '340px' }" v-for="(item) in groupList" v-key="item.id">
            <template #header>
                <div style="font: var(--td-font-title-medium);">[{{ item.id }}] {{ item.name }}</div>
            </template>
            <template #content>
                <div>{{ item }}</div>
            </template>
            <template #footer>
              <t-row :align="'middle'" justify="center" style="gap: 24px">
                <t-col flex="auto" style="display: inline-flex; justify-content: center">
                  <t-button variant="text" shape="square">
                    <thumb-up-icon />
                  </t-button>
                </t-col>
            
                <t-col flex="auto" style="display: inline-flex; justify-content: center">
                  <t-button variant="text" shape="square">
                    <chat-icon />
                  </t-button>
                </t-col>
            
                <t-col flex="auto" style="display: inline-flex; justify-content: center">
                  <t-button variant="text" shape="square">
                    <share-icon />
                  </t-button>
                </t-col>
              </t-row>
            </template>
        </t-card>
    </div>
</template>

<script setup lang="ts">
import { ThumbUpIcon, ChatIcon, ShareIcon } from 'tdesign-icons-vue-next';
import useRequest from '../../hooks/useRequest';
import { onMounted, ref } from 'vue';
import { NotifyPlugin } from 'tdesign-vue-next';

const groupList = ref([])
const props = defineProps({
    handleChangeComponent: Function,
})
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

onMounted(() => {
    getGroupList()
});
</script>

<script lang="ts">
export default {
  name: 'GroupManage'
}
</script>