<template>
    <div class="mainbox__">
        <t-tabs :value="tabsValue" :onChange="tabs_change">
            <t-tab-panel :value="1" label="全部通知" :destroy-on-hide="false" class="all_msg">
                <template #label>
                    <t-badge dot :count="allIsRead ? 0 : 1" :offset="[-7, 0]">
                        <span>全部通知</span>
                    </t-badge>
                </template>
                <template #panel>
                    <div>
                        <t-list :split="true" v-for="item in messageList" :key="item.mid">
                            <t-list-item @click="ToDetail(item.tid)">
                                <p>
                                    <t-badge dot :count="item.onread ? 0 : 1" :offset="[91.5, 0]">
                                        <t-tag :theme="item.type === 0 ? 'primary' : 'danger'" variant="outline">{{ item.title }}</t-tag>
                                    </t-badge>
                                    <span class>{{ item.d }} [{{ item.tid }}#]  {{ item.content }}</span>
                                </p>
                                <template #action>
                                    <span class="msg-date">{{ item.post_time }}</span>
                                </template>
                            </t-list-item>
                        </t-list>
                    </div>
                </template>
            </t-tab-panel>
            <!-- <t-tab-panel :value="2" label="申请通知" :destroy-on-hide="false">
                <template #panel>
                    <p style="padding: 25px">选项卡2的内容，使用 t-tab-panel 渲染</p>
                </template>
            </t-tab-panel>
            <t-tab-panel :value="3" label="未读通知" :destroy-on-hide="false">
                <template #panel>
                    <p style="padding: 25px">选项卡2的内容，使用 t-tab-panel 渲染</p>
                </template>
            </t-tab-panel> -->
        </t-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import useRequest from "../../hooks/useRequest.js";
import { NotifyPlugin } from "tdesign-vue-next";
import { useRouter } from 'vue-router'
import { routerPrefix } from "../../components/config";

const props = defineProps({
    handleChangeComponent: Function,
})
const router = useRouter()
const tabsValue = ref(1);
const messageList = ref([]);
const allIsRead = computed(() => {
    return messageList.value.filter(item => item.onread === 0).length == 0
})

const getMessage = () => {
    useRequest({
        url: `/message/MyMessage`,
        methods: "POST",
        success: function (res) {
            const result = JSON.parse(res)
            if (result.errcode != 0) {
                NotifyPlugin.error({
                    title: "获取内容失败",
                    content: result.errmsg,
                })
                return;
            }
            messageList.value = result.data
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "获取内容失败",
                content: err,
            })
        }
    })
}

const tabs_change = (e) => {
    tabsValue.value = e
}

const ToDetail = (tid) => {
    console.log(tid)
    props.handleChangeComponent('MyTask', true, false, { tid: tid })
    // router.push({
    //     path: `${routerPrefix}/MyTask`,
    //     query: { tid: tid }
    // })
}

onMounted(() => {
    getMessage()
});
</script>

<script lang="ts">
export default {
    name: 'MessageList',
    mounted() {
        // this.$emit("mounted")
    },
}
</script>
  
<style>
.mainbox__ {
    background-color: var(--td-bg-color-container);
    border-radius: 6px;
    padding: 32px;
}

.all_msg .t-list-item p {
    margin: 0 !important;
}

.all_msg .t-list-item .t-tag {
    margin-right: 16px;
}

.all_msg .t-list-item:hover {
    background-color: var(--td-bg-color-container-hover);
}

.all_msg .t-list-item {
    cursor: pointer;
    padding: var(--td-comp-paddingTB-l) 6px !important;
    transition: all 0.2s linear 0s;
}
</style>