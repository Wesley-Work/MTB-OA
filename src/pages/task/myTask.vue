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
                    {{ item.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NotifyPlugin } from 'tdesign-vue-next';
import useRequest from '../../hooks/useRequest';
import { computed, onMounted, ref } from 'vue';
import { taskStatus, taskType } from "../../hooks/common";


// {
//     "change_time": "Sat, 23 Nov 2024 21:25:06 GMT",
//     "content": "\u65b0\u751f\u6821\u5361\u7167\u540e\u671f\u5904\u7406",
//     "create_user": "\u90ed\u6587\u6770",
//     "equipment": "",
//     "finally_time": "2024-09-30 00:00",
//     "id": 21,
//     "name": "\u65b0\u751f\u6821\u5361\u7167\u540e\u671f\u5904\u7406",
//     "place": "\u5a92\u4f53\u90e8",
//     "remark": "",
//     "status": 6,
//     "type": 1,
//     "user": "\u9648\u90c5\u821c,\u66fe\u6d69\u5cf0,\u6587\u4fca\u4eae",
//     "weight": 4,
//     "work_time": "2024-09-04 18:00,2024-09-30 23:59"
// },
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