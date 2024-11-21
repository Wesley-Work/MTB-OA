<template>
    <!---->
    <div id="app">
        <div style="position: relative;">
            <div class="main_box_tabs_big" style="margin-right: -1px;">
                <div class="main_box_tabs_view" ref="tabs_view">
                    <div class="main_box_tabs_view_tab" ref="label" name="label"
                        :class="{ tabs_active: Tabs.active == 'label' }"
                        :style="{ '--CornerBackgroundColor': Tabs.active == 'label' ? 'var(--dai1)' : 'var(--dai2)', '--CornerBackgroundColorF': Tabs.active == 'label' ? 'var(--dai2)' : 'var(--dai1)' }"
                        @click="handleTabsClick($event.target.attributes.name.value, 1)">
                        <span ran-tag-z2 :tagz2="Tabs.active"></span>按标签排行
                    </div>
                    <div class="main_box_tabs_view_tab" ref="weight" name="weight"
                        :class="{ tabs_active: Tabs.active == 'weight' }"
                        @click="handleTabsClick($event.target.attributes.name.value, 2)">
                        按权重排行
                    </div>
                </div>
                <div class="main_box_tabs_bg--line" :style="{ width: Tabs.BackgroundWidth }" style="
                        background: var(--ran-color-fff);
                        height: 41px;
                        position: absolute;
                        top: 0px;
                        left: -1px;
                        z-index: 2;
                        border-top-left-radius: 12px;
                        border-top-right-radius: 12px;
                    "></div>
                <div class="main_box_tabs_active--line" style="
                        background: var(--td-bg-color-container);
                        height: 40px;
                        position: absolute;
                        top: 1px;
                        width: 120px;
                        z-index: 4;
                        transition: all 0.28s var(--transition-default);
                    " :style="{
                        right: tabs_active_left_data + 'px',
                        'border-top-left-radius': tabs_active_top_left_radius_data + 'px',
                        'border-top-right-radius': tabs_active_top_right_radius_data + 'px',
                    }"></div>
                <div class="main_box_tabs_active--line" style="
                        background: var(--td-bg-color-page);
                        height: 40px;
                        position: absolute;
                        top: 1px;
                        width: 255px;
                        z-index: 3;
                        right: 0px;
                        transition: all 0.28s var(--transition-default);
                        border-top-left-radius: 12px;
                        border-top-right-radius: 15px;
                    "></div>
            </div>
            <div class="main_box_content_big" ref="content_view">
                <div class="main_box_content_view" v-if="Tabs.active == 'label'">
                    <!--表头-->
                    <t-table row-key="index" :data="xndata" :columns="xncolumns" :bordered="true" :hover="false"
                        :table-layout="'auto'" cell-empty-content="" rowClassName="ran-empty-table--body-notshow">
                    </t-table>
                    <!--分类标志-->
                    <div model="normal" v-if="main_table_data.normal != ''">
                        <div>
                            <div class="ran-tree__item" :class="{ 'ran-tree--open': ran_tree_tap_data.normal_task }">
                                <span class="ran-tree--transition" @click="handletagclick('normal')">
                                    <t-icon name="caret-right-small" class="ran-tree__icon" size="1.5em"></t-icon>
                                </span>
                                <t-tag :theme="ran_tree_tap_data.normal_theme" variant="light-outline"
                                    style="margin-left: 4px">一般任务</t-tag>
                            </div>
                        </div>
                        <!--表内容-->
                        <t-table row-key="index" :data="main_table_data.normal" :columns="columns" :bordered="true"
                            :hover="true" class="ran-table-content-disshow--head ran-table-view--main"
                            :table-layout="'auto'" cell-empty-content="-"
                            :class="{ 'ran-table-view--show': ran_tree_tap_data.normal_task }"
                            :onCellClick="handleCellClick">
                        </t-table>
                    </div>
                    <div model="urgent" v-if="main_table_data.urgent != ''">
                        <div>
                            <div class="ran-tree__item" :class="{ 'ran-tree--open': ran_tree_tap_data.urgent_task }">
                                <span class="ran-tree--transition" @click="handletagclick('urgent')">
                                    <t-icon name="caret-right-small" class="ran-tree__icon" size="1.5em"></t-icon>
                                </span>
                                <t-tag :theme="ran_tree_tap_data.urgent_theme" variant="light-outline"
                                    style="margin-left: 4px">紧急任务</t-tag>
                            </div>
                        </div>
                        <!--表内容-->
                        <t-table row-key="index" :data="main_table_data.urgent" :columns="columns" :bordered="true"
                            :hover="true" class="ran-table-content-disshow--head ran-table-view--main"
                            :table-layout="'auto'" cell-empty-content="-"
                            :class="{ 'ran-table-view--show': ran_tree_tap_data.urgent_task }"
                            :onCellClick="handleCellClick">
                        </t-table>
                    </div>
                    <div model="plan" v-if="main_table_data.plan != ''">
                        <div>
                            <div class="ran-tree__item" :class="{ 'ran-tree--open': ran_tree_tap_data.plan_task }">
                                <span class="ran-tree--transition" @click="handletagclick('plan')">
                                    <t-icon name="caret-right-small" class="ran-tree__icon" size="1.5em"></t-icon>
                                </span>
                                <t-tag :theme="ran_tree_tap_data.plan_theme" variant="light-outline"
                                    style="margin-left: 4px">计划任务</t-tag>
                            </div>
                        </div>
                        <!--表内容-->
                        <t-table row-key="index" :data="main_table_data.plan" :columns="columns" :bordered="true"
                            :hover="true" class="ran-table-content-disshow--head ran-table-view--main"
                            :table-layout="'auto'" cell-empty-content="-"
                            :class="{ 'ran-table-view--show': ran_tree_tap_data.plan_task }" :onCellClick="handleCellClick">
                        </t-table>
                    </div>
                    <div model="cancel" v-if="main_table_data.cancel != ''">
                        <div>
                            <div class="ran-tree__item" :class="{ 'ran-tree--open': ran_tree_tap_data.cancel_task }">
                                <span class="ran-tree--transition" @click="handletagclick('cancel')">
                                    <t-icon name="caret-right-small" class="ran-tree__icon" size="1.5em"></t-icon>
                                </span>
                                <t-tag :theme="ran_tree_tap_data.cancel_theme" variant="light-outline"
                                    style="margin-left: 4px">已取消</t-tag>
                            </div>
                        </div>
                        <!--表内容-->
                        <t-table row-key="index" :data="main_table_data.cancel" :columns="columns" :bordered="true"
                            :hover="true" class="ran-table-content-disshow--head ran-table-view--main"
                            :table-layout="'auto'" cell-empty-content="-"
                            :class="{ 'ran-table-view--show': ran_tree_tap_data.cancel_task }"
                            :onCellClick="handleCellClick">
                        </t-table>
                    </div>

                    <div model="nodata" v-if="main_table_data.normal == '' &&
                        main_table_data.urgent == '' &&
                        main_table_data.plan == '' &&
                        main_table_data.cancel == ''
                        ">
                        <div>
                            <div style="
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    min-height: 120px;
                                    color: var(--td-text-color-disabled);
                                ">
                                没有任务数据
                            </div>
                        </div>
                    </div>
                </div>

                <div class="main_box_content_view" v-else-if="Tabs.active == 'weight'">
                    <t-table row-key="index" :data="data" :columns="columns" :bordered="true" :hover="true"
                        :table-layout="'auto'" :size="'medium'" cell-empty-content="" @row-click="handleRowClick">
                    </t-table>
                </div>
            </div>
        </div>
    </div>
    <footer class="mainapp_footer" style="display: none;">Powered By Wesley With ❤️</footer>
</template>

<script setup lang="jsx">
import { reactive } from "vue";
//import { MessagePlugin } from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon } from "tdesign-icons-vue-next";
import {
    ErrorCircleFilledIcon,
    CheckCircleFilledIcon,
    CloseCircleFilledIcon,
} from "tdesign-icons-vue-next";
import { ChevronDownIcon } from "tdesign-icons-vue-next";
import { ControlPlatformIcon } from "tdesign-icons-vue-next";

const rules = reactive({
    username: [
        { required: true, message: "请输入账户名", type: "error", trigger: "blur" },
        { min: 0, max: 20, message: "账户名有点长啊...", type: "error", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", type: "error", trigger: "blur" },
        { min: 1, max: 100, message: "密码好像有点短？", type: "error", trigger: "blur" },
    ],
});

const statusNameListMap = {
    0: { label: "一般任务", theme: "success" },
    1: { label: "紧急任务", theme: "warning" },
    2: { label: "计划任务", theme: "primary" },
    3: { label: "已取消", theme: "danger" },
};
const data = [];
const xndata = [
    {
        index: "",
        id: "",
        applicant: "",
        label: 0,
        channel: "",
        name: "",
        time: "",
        changetime: "",
        whocreate: "",
        weight: "",
        place: "",
    },
];
const total = 28;
for (let i = 0; i < total; i++) {
    data.push({
        index: i + 1,
        id: i + 1,
        applicant: ["贾明", "张三", "王芳"][i % 3],
        label: i % 4,
        channel: ["电子签署", "纸质签署", "纸质签署"][i % 3],
        detail: {
            email: ["w.cezkdudy@lhll.au", "r.nmgw@peurezgn.sl", "p.cumx@rampblpa.ru"][i % 3],
        },
        name: ["宣传物料制作费用", "algolia 服务报销", "相关周边制作费", "激励奖品快递费"][i % 4],
        time: [
            "2022-01-01 14:00",
            "2022-02-01 14:00",
            "2022-03-01 14:00",
            "2022-04-01 14:00",
            "2022-05-01 14:00",
        ][i % 4],
        changetime: [
            "2022-01-01 14:00",
            "2022-02-01 14:00",
            "2022-03-01 14:00",
            "2022-04-01 14:00",
            "2022-05-01 14:00",
        ][i % 5],
        whocreate: "人人人",
        weight: ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"][i % 5],
        place: [
            "一个地方",
            "一个神奇的地方",
            "一个非常非常神奇的地方",
            "一个非常非常非常非常神奇的地方",
        ][i % 4],
    });
}

//

const columns = ref([
    { colKey: "id", title: "任务id", width: "70px", thClassName: ["ran-empty-table--head-left"] },
    { colKey: "time", title: "工作时间", width: "120px" },
    { colKey: "name", title: "工作内容", width: "260px" },

    { colKey: "place", title: "工作地点", width: "250px" },
    {
        colKey: "lable",
        title: "分类",
        width: "80px",
        align: "center",
        cell: (h, { row }) => {
            return (
                <t-tag
                    theme={row.label.theme}
                    variant="light-outline">
                    {row.label.label}
                </t-tag>
            );
        },
    },
    {
        colKey: "assigned",
        title: "人员安排",
        width: "160px",
        cell: (h, { row }) => {
            return (
                <span class="ran-tag--assigned">
                    <t-tag
                        theme="default"
                        variant="light-outline"
                        style="margin:0px 4px">
                        人人人
                    </t-tag>
                    <t-tag
                        theme="default"
                        variant="light-outline"
                        style="margin:0px 4px">
                        人人人
                    </t-tag>
                    <t-tag
                        theme="default"
                        variant="light-outline"
                        style="margin:0px 4px">
                        人人人
                    </t-tag>
                </span>
            );
        },
    },
    { colKey: "needequipment", title: "所需设备", width: "180px" },
    { colKey: "whocreate", title: "创建人", width: "90px", align: "center" },
    { colKey: "changetime", title: "修改时间", width: "200px" },
    { colKey: "weight", title: "权重", width: "140px", thClassName: "ran-empty-table--head-right" },
]);
const xncolumns = ref([
    { colKey: "id", title: "任务id", width: "70px", thClassName: ["ran-empty-table--head-left"] },
    { colKey: "time", title: "工作时间", width: "120px" },
    { colKey: "name", title: "工作内容", width: "260px" },

    { colKey: "place", title: "工作地点", width: "250px" },
    {
        colKey: "lable",
        title: "分类",
        width: "80px",
        align: "center",
        cell: (h, { row }) => {
            return (
                <t-tag
                    theme={statusNameListMap[row.label].theme}
                    variant="light-outline">
                    {statusNameListMap[row.label].label}
                </t-tag>
            );
        },
    },
    {
        colKey: "assigned",
        title: "人员安排",
        width: "160px",
        cell: (h, { row }) => {
            return (
                <span class="ran-tag--assigned">
                    <t-tag
                        theme="default"
                        variant="light-outline"
                        style="margin:0px 4px">
                        人人人
                    </t-tag>
                    <t-tag
                        theme="default"
                        variant="light-outline"
                        style="margin:0px 4px">
                        人人人
                    </t-tag>
                    <t-tag
                        theme="default"
                        variant="light-outline"
                        style="margin:0px 4px">
                        人人人
                    </t-tag>
                </span>
            );
        },
    },
    { colKey: "needequipment", title: "所需设备", width: "180px" },
    { colKey: "whocreate", title: "创建人", width: "90px", align: "center" },
    { colKey: "changetime", title: "修改时间", width: "200px" },
    { colKey: "weight", title: "权重", width: "140px", thClassName: "ran-empty-table--head-right" },
]);

const handleRowClick = (e) => {
    console.log(e);
};

const handleCellClick = (e) => {
    console.log(
        "是否点击图标：" + e.e.target.__vnode.type == "svg" || e.e.target.__vnode.type == "use",
        "行：",
        e.rowIndex,
        "列："
    );
};
</script>

<script lang="jsx">
import { reactive, ref } from "vue";

import { MessagePlugin } from "tdesign-vue-next";
import { locale } from "dayjs";
import FakeProgress from "fake-progress";
export default {
    name: "TaskList",
    components: {},
    data() {
        return {
            windowHeight: "0",
            windowWidth: "0",
            Tabs: {
                BackgroundWidth: "",
                active: "label",
            },
            main_table_data: {
                normal: [],
                urgent: [],
                plan: [],
                cancel: [],
            },
            ran_tree_tap_data: {
                normal_task: true,
                urgent_task: true,
                plan_task: true,
                cancel_task: true,
                normal_theme: "success",
                urgent_theme: "warning",
                plan_theme: "primary",
                cancel_theme: "danger",
            },
            tabs_active_left_data: 120,
            tabs_active_top_left_radius_data: 12,
            tabs_active_top_right_radius_data: 0,
        };
    },
    mounted() {
        this.$emit("mounted")
        //页面大小改变时
        window.onresize = () => {
            return (() => {
                this.getPageWidthAndHeight();
            })();
        };
        this.getPageWidthAndHeight();
    },
    methods: {

        //标签被点击
        handletagclick(e) {
            this.$data.ran_tree_tap_data[e + "_task"] = !this.$data.ran_tree_tap_data[e + "_task"];
        },
        // 点击导航标签
        handleTabsClick(e, e2) {
            // console.log(this.$refs[e].getBoundingClientRect())
            this.$data.Tabs.active = e;
            this.getPageWidthAndHeight();
            this.$data.tabs_active_top_left_radius_data = 0;
            this.$data.tabs_active_top_right_radius_data = 0;
            if (e2 == 1) {
                this.$data.tabs_active_left_data = 120;
                this.$data.tabs_active_top_left_radius_data = 12;
            } else if (e2 == 2) {
                this.$data.tabs_active_left_data = -1;
                this.$data.tabs_active_top_right_radius_data = 12;
            }
        },
        getPageWidthAndHeight() {
            var that = this;
            that.windowHeight = document.documentElement.clientHeight;
            that.windowWidth = document.documentElement.clientWidth;
            let a = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
            };
            return a;
        },

        getTableData() {
            element.label = { label: "一般任务", theme: "success" };
            this.$data.main_table_data.normal.push(element);
        },
    },
};
</script>

<style scoped>
.ran-tree--transition .ran-tree__icon:hover {
    transition: 0.2s linear;
}

.ran-tree__icon:hover {
    background-color: var(--td-bg-color-container-hover);
}

.ran-tree__icon {
    border-radius: 5px;
}

.t-tree--transition .ran-tree__icon {
    transition: color, transform cubic-bezier(0.38, 0, 0.24, 1) 0.2s;
}

.ran-tree--open .ran-tree__icon {
    transform: rotate(90deg) !important;
}

.ran-tree__item {
    margin: 8px 0px;
}

.ran-tree__item .ran-tree__icon {
    transform: rotate(0);
}

.ran-tree__item .ran-tree__icon {
    color: var(--td-text-color-secondary) !important;
}

.ran-tree__item .t-tag {
    user-select: none;
}

.ran-tree--open .ran-tree__icon {
    color: var(--td-text-color-brand) !important;
}

/**全系表格不能选择 */
table {
    user-select: none;
}

td.t-table__td-first-col:has(> div.ran-tree__item) {
    padding-left: 4px !important;
}

tr:hover:has(div.ran-tree__item) {
    background-color: unset !important;
}

.ran-empty-table--body-notshow {
    user-select: none;
    opacity: 0 !important;
}

.t-table__content:has(.ran-empty-table--body-notshow) {
    border-bottom: none !important;
    border-left: none !important;
    border-radius: none !important;
}

.t-table--bordered th:first-child {
    border-left-width: 1px !important;
}

.t-table--bordered th:last-child {
    border-left-width: 1px !important;
}

.ran-empty-table--body-notshow td {
    border-bottom: 0 !important;
    min-height: 0px !important;
    height: 0px !important;
    max-height: 0px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    line-height: 0px !important;
}

.ran-table-content-disshow--head thead {
    display: none !important;
}

.ran-empty-table--body-notshow .t-tag {
    height: 0px !important;
}

table:has(.ran-empty-table--body-notshow) {
    overflow: hidden;
}

td:has(.ran-tag--assigned) {
    display: block;
    width: fit-content;
}

.ran-table-view--main {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
}

.ran-table-view--show {
    max-height: 1000vh;
    transition: max-height 1s var(--transition-default);
}

/**覆盖TDesign的样式*/
:root,
:root[theme-mode="dark"] {
    --td-success-color: #3ad9a5 !important;
    --td-error-color: #e26d76 !important;
    --td-brand-color: #659fff !important;
    --td-warning-color: #e1925e !important;
    --text-color: #fff;
    --dai1: #fff;
}

:root {
    --ran-color-fff: #fff;
    --CornerBackgroundColor: #fff;
    --text-color: #000;
    --dai1: var(--td-bg-color-page);
    --dai2: var(--td-bg-color-container)
}

/**内容 */
.main_box_content_view {
    width: 97%;
    margin: 0 auto;
    margin-top: 35px;
    margin-bottom: 35px;
    transition: transform 1s var(--transition-default);
}

.main_box_content_big {
    width: 100%;
    background: var(--td-bg-color-container);
    border-radius: 15px;
    border-top-right-radius: 0px !important;
    border: 1px #fff solid;
    border-top: none;
    overflow: hidden;
}

.main_box_content_big::before {
    content: " ";
    height: 15px;
    display: flex;
    width: 95%;
    border: 1px #fff solid;
    border-top-left-radius: 15px;
    border-bottom: none;
    border-right: none;
    position: revert;
}

/**标签组 */

.main_box_tabs_view {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    user-select: none;
}

.main_box_tabs_view_tab {
    width: 120px;
    display: flex;
    justify-content: center;
    color: var(--text-color);
    height: 40px;
    align-items: center;
    font: var(--td-font-title-medium);
    border: 1px #fff solid;
    border-bottom: none;
    border-left: none;
    border-right: none;
    z-index: 5;
    transition: color 0.28s var(--transition-default);
}

.main_box_tabs_view_tab:first-child {
    border-top-left-radius: 15px;
}

.main_box_tabs_view_tab:last-child {
    border-top-right-radius: 15px;
}

.tabs_active {
    color: var(--td-text-color-primary);
    background: transparent;
    z-index: 5;
}

/**第一个标签 */
.main_box_tabs_view_tab:first-child {
    position: relative;
    border-right: none;
}

.main_box_tabs_view_tab:first-child::after {
    content: " ";
    position: absolute;
    width: 21px;
    height: 32px;
    top: -1px;
    left: -1px;
    border-top-left-radius: 15px;
    border: 1px #fff solid;
    border-bottom: none;
    border-right: none;
}

.main_box_tabs_view_tab:last-child {
    position: relative;
    border-left: none;
}

.main_box_tabs_view_tab:first-child>span[ran-tag-z2] {
    content: " ";
    position: absolute;
    width: 15px;
    height: 16px;
    bottom: -0.5px;
    left: -15.5px;
    background: radial-gradient(circle at 0 0,
            transparent 15px,
            var(--CornerBackgroundColor) 15.6px,
            var(--CornerBackgroundColorF) 17px);
    opacity: 1;
    transition: all 0.28s var(--transition-default);
}

:root[theme-mode="dark"] .main_box_tabs_view_tab:first-child>span[ran-tag-z2][tagz2="weight"] {
    background: radial-gradient(circle at 0 0,
            transparent 15px,
            var(--CornerBackgroundColorF) 15.6px,
            var(--td-bg-color-page) 17px);
}

.main_box_tabs_view_tab:last-child::after {
    content: " ";
    position: absolute;
    width: 21px;
    height: 40px;
    top: -1px;
    right: 0px;
    border-top-right-radius: 15px;
    border: 1px #fff solid;
    border-bottom: none;
    border-left: none;
}

.mainapp_footer {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--td-text-color-primary);
    font: var(--td-font-body-medium);
    letter-spacing: 0.5px;
}

/**原有样式 */
body {
    background: var(--td-bg-color-page) !important;
    margin: 0px;
}

a {
    color: #fff;
    text-decoration: none;
}

a:visited {
    color: #fff;
    text-decoration: none;
}

a:focus {
    color: rgb(207, 207, 207);
    text-decoration: none;
}

a:hover {
    color: rgb(207, 207, 207);
    text-decoration: none;
}

img {
    display: block;
    width: 430px;
    margin: 0 auto;
    user-select: none;
}
</style>
