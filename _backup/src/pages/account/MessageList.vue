<template>
    <div class="mainbox__">
        <t-tabs :value="value" :onChange="tabs_change">
            <t-tab-panel :value="1" label="全部通知" :destroy-on-hide="false" class="all_msg">
                <template #label>
                    <t-badge dot :count="all_message_is_read ? 0 : 1" :offset="[-7, 0]">
                        <span>全部通知</span>
                    </t-badge>
                </template>
                <template #panel>
                    <div>
                        <t-list :split="true" v-for="item in all_message" :key="item.mid">
                            <t-list-item @click="nav_message_details(item.mid,item.tag_type)">
                                <p>
                                    <t-badge dot :count="item.read ? 0 : 1" :offset="[81.5, 0]">
                                        <t-tag :theme="item.tag_type" variant="outline">{{ item.tag }}</t-tag>
                                    </t-badge>
                                    <span class>{{ item.msg }}</span>
                                </p>
                                <template #action>
                                    <span class="msg-date">{{ item.time }}</span>
                                </template>
                            </t-list-item>
                        </t-list>
                    </div>
                </template>
            </t-tab-panel>
            <t-tab-panel :value="2" label="申请通知" :destroy-on-hide="false">
                <template #panel>
                    <p style="padding: 25px">选项卡2的内容，使用 t-tab-panel 渲染</p>
                </template>
            </t-tab-panel>
            <t-tab-panel :value="3" label="未读通知" :destroy-on-hide="false">
                <template #panel>
                    <p style="padding: 25px">选项卡2的内容，使用 t-tab-panel 渲染</p>
                </template>
            </t-tab-panel>
        </t-tabs>
    </div>
</template>


<script>
import * as api from "../../components/config/api.js";
import * as config from "@/components/config.js"; // for testing, replace with "./config.js" for production server. 描述自身数据库信息以";
export default {
    name: 'MessageList',
    data() {
        return {
            value: 1,
            all_message_is_read: false,
            all_message: [
                {
                    mid: 1,
                    tag: "申请请求",
                    tag_type: "warning",
                    msg: "李四 发出 借出公有资产 申请，需要您前往审批",
                    time: "1999-01-01 00:00",
                    read: false,
                },
                {
                    mid: 2,
                    tag: "申请请求",
                    tag_type: "warning",
                    msg: "王五 发出 添加任务 申请，需要您前往审批",
                    time: "1999-01-02 00:00",
                    read: true,
                },
                {
                    mid: 3,
                    tag: "账号审批",
                    tag_type: "success",
                    msg: "赵六 发出 修改账户密码 申请，需要您前往审批",
                    time: "1999-01-02 00:00",
                    read: false,
                },
                {
                    mid: 4,
                    tag: "系统通知",
                    tag_type: "primary",
                    msg: "【系统】发出一则公告，请速速阅读！",
                    time: "1999-03-01 00:00",
                    read: false,
                },
            ],
        }
    },
    // setup() {
    //     const isDark = useDark({
    //         selector: 'html',
    //         attribute: 'theme-mode',
    //         valueDark: 'dark',
    //         valueLight: 'light',
    //     })

    //     const toggleDark = useToggle(isDark)
    //     return {
    //         isDark,
    //         toggleDark,
    //     }
    // },
    mounted() {
        this.$emit("mounted")
    },

    methods: {
        tabs_change(e) {
            this.$data.value = e
        },
        nav_message_details(e,e1){
            this.$emit("Change-Page-Url",e1 == "primary"?"MessageDetails":"Audit",true)
            this.$emit("Apply-Url-Param","mid",e)
        }
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