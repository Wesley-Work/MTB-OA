<template>
    <div class="view">
        <div class="calendar">
            <t-calendar />
        </div>
        <!---->
        <div class="taskList">
            <div class="taskList--item" v-for="(item, index) in filteredTaskList" :key="item" :style="{ order: getTagPriority(item.type) }">
                <div class="task-title">
                    <div class="task-tag">
                        <t-tag variant="light-outline" :theme="getTypeOrStatus(taskType,item.type)?.theme" :color="getTypeOrStatus(taskType,item.type)?.color">{{ getTypeOrStatus(taskType,item.type)?.label }}</t-tag>
                        <t-tag variant="light-outline" :theme="getTypeOrStatus(taskStatus,item.status)?.theme" :color="getTypeOrStatus(taskStatus,item.status)?.color">{{ getTypeOrStatus(taskStatus,item.status)?.label }}</t-tag>
                    </div>
                    {{ item.id }}# {{ item.name }}
                </div>
                <div class="task-content">
                    <div>工作内容：{{ item.content }}</div>
                    <div>工作地点：{{ item.place }}</div>
                    <div>使用设备：{{ item.equipment }}</div>
                    <div>工作时间：{{ taskTimeConvert((item.work_time as string)?.split(','))?.join(' 至 ') }}</div>
                    <div>完成时间：{{ taskTimeConvert(item.finally_time) }}</div>
                    <div>安排人员：{{ item.user }}</div>
                    <div>权重：{{ item.weight }}</div>
                    <div>发布人：{{ item.create_user }}</div>
                    <div>备注：{{ item.remark }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NotifyPlugin } from 'tdesign-vue-next';
import useRequest from '../../hooks/useRequest';
import { computed, onMounted, ref } from 'vue';
import { taskStatus, taskTimeConvert, taskType } from "../../hooks/common";

const props = defineProps({
    handleChangeComponent: Function,
})
const getTypeOrStatus = computed(() => (Obj: any,val: number | string) => {
    for (const key in Obj) {
        const item = Obj[key];
        if (item.value == val || Number(item.value) == val) {
            return item;
        }
    }
    return null;
})
const taskList = ref([])
const filteredTaskList = computed(() => taskList.value.filter(item => item.status !== 6));

const getTagPriority = (item) => {
    // 优先级：2 > 1 > 0 > 3
    return item == 2 ? 0 : item == 1 ? 1 : item == 3 ? 3 : 2;
};

const getMyTask = () => {
    useRequest({
        url: "/task/myTask",
        success: function (res) {
            const result = JSON.parse(res)
            if (result.errcode != 0) {
                NotifyPlugin.error({
                    title: "获取任务列表失败",
                    content: result.errmsg,
                })
                return;
            }
            taskList.value = result.data;
        },
        error: function (err) {
            console.error(err)
            NotifyPlugin.error({
                title: "获取任务列表失败",
                content: "错误：" + err,
            })
        }
    })
}

onMounted(() => {
    getMyTask()
});
</script>

<script lang="ts">
export default {
    name: "MyTask",
    data() {
        return {};
    },
};
</script>

<style lang="scss">
.view {
    display: flex;
    flex-direction: row;
    gap: 12px;
    .calendar {
        width: 80%;
    }
    .taskList {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        .taskList--item {
            padding: 24px;
            background-color: var(--td-bg-color-container);
            border-radius: var(--td-radius-medium);
            .task-title {
                display: flex;
                flex-direction: row;
                gap: 12px;
                font: var(--td-font-title-medium);
                .task-tag {
                    display: flex;
                    flex-direction: row;
                    gap: 6px;
                }
            }
        }
    }
}
</style>