<template>
  <div>
    <div style="display: flex; flex-direction: row">
      <!--item 1-->
      <div we-top-card-item>
        <t-card we-bg-color-green we-card>
          <template #header>
            <div class="t-card__header-wrapper">
              <div><span class="t-card__title">总借出次数</span></div>
            </div>
          </template>
          <div class="item-right">
            <span>{{ Top_items_Content.LendTime }}</span>
          </div>
          <div class="item-top" tag-green>
            <t-avatar size="56px">
              <template #icon>
                <t-icon name="logout"></t-icon>
              </template>
            </t-avatar>
          </div>
          <template #footer>
            <div class="t-card__footer-wrapper">
              <div class="dashboard-item-bottom">
                <div class="dashboard-item-block">
                  {{
                    Math.floor(Math.random() * 2) == 1
                      ? "是个不错的数字！"
                      : "芜芜芜芜芜芜芜芜湖~~"
                  }}
                  <!-- <span class="trend-container trend-container__down dashboard-item-trend"><span
                      class="trend-icon-container"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 8L8 11.5L4.5 8" stroke="currentColor" stroke-width="1.5"></path>
                        <path d="M8 11L8 4" stroke="currentColor" stroke-width="1.5"></path>
                      </svg></span><span>20.33333%</span></span> -->
                </div>
                <!-- <t-icon name="chevron-right"></t-icon> -->
              </div>
            </div>
          </template>
        </t-card>
      </div>
      <!--item 2-->
      <div we-top-card-item>
        <t-card we-bg-color-blue we-card>
          <template #header>
            <div class="t-card__header-wrapper">
              <div><span class="t-card__title">总设备数量</span></div>
            </div>
          </template>
          <div class="item-right">
            <span>{{ Top_items_Content.EquipmentTotal }}</span>
          </div>
          <div class="item-top" tag-blue>
            <t-avatar size="56px">
              <template #icon>
                <t-icon name="laptop"></t-icon>
              </template>
            </t-avatar>
          </div>
          <template #footer>
            <div class="t-card__footer-wrapper">
              <div class="dashboard-item-bottom">
                <div class="dashboard-item-block">
                  上次新增
                  <span
                    class="trend-container trend-container__down dashboard-item-trend">
                    <span class="trend-icon-container">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style="transform: rotate(180deg)">
                        <path
                          d="M11.5 8L8 11.5L4.5 8"
                          stroke="currentColor"
                          stroke-width="1.5"></path>
                        <path
                          d="M8 11L8 4"
                          stroke="currentColor"
                          stroke-width="1.5"></path>
                      </svg>
                    </span>
                    <span>5件 设备</span>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </t-card>
      </div>
      <!--item 3-->
      <div we-top-card-item>
        <t-card we-bg-color-red we-card>
          <template #header>
            <div class="t-card__header-wrapper">
              <div><span class="t-card__title">未还设备数</span></div>
            </div>
          </template>
          <div class="item-right">
            <span>{{ Top_items_Content.NotReturnTotal }}</span>
          </div>
          <div class="item-top" tag-red>
            <t-avatar size="56px">
              <template #icon>
                <t-icon name="login"></t-icon>
              </template>
            </t-avatar>
          </div>
          <template #footer>
            <div class="t-card__footer-wrapper">
              <div class="dashboard-item-bottom">
                <div class="dashboard-item-block">
                  {{
                    Math.floor(Math.random() * 2) == 1
                      ? "使用完设备记得还哦！"
                      : "用完不还是会被斩的！"
                  }}
                  <!-- <span class="trend-container trend-container__down dashboard-item-trend">
                    <span class="trend-icon-container">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 8L8 11.5L4.5 8" stroke="currentColor" stroke-width="1.5"></path>
                        <path d="M8 11L8 4" stroke="currentColor" stroke-width="1.5"></path>
                      </svg>
                    </span>
                    <span>20.33333%</span>
                  </span> -->
                </div>
              </div>
            </div>
          </template>
        </t-card>
      </div>
      <!--item 4-->
      <div we-top-card-item>
        <t-card we-card we-bg-color-primary>
          <template #header>
            <div class="t-card__header-wrapper">
              <div><span class="t-card__title">活跃用户（日/人次）</span></div>
            </div>
          </template>
          <div class="item-right">
            <span style="color: var(--td-text-color-primary)">NaN</span>
          </div>
          <div class="item-top" tag-black>
            <t-avatar size="56px">
              <template #icon>
                <t-icon name="usergroup"></t-icon>
              </template>
            </t-avatar>
          </div>
          <!-- <template #footer>
            <div class="t-card__footer-wrapper">
              <div class="dashboard-item-bottom">
                <div class="dashboard-item-block">
                  与{{ onlineuser.desc }}相比
                  <span
                    class="trend-container trend-container__down dashboard-item-trend">
                    <span class="trend-icon-container">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        :style="
                          onlineuser.preway ? 'transform: rotate(180deg)' : ''
                        ">
                        <path
                          d="M11.5 8L8 11.5L4.5 8"
                          stroke="currentColor"
                          stroke-width="1.5"></path>
                        <path
                          d="M8 11L8 4"
                          stroke="currentColor"
                          stroke-width="1.5"></path>
                      </svg>
                    </span>
                    <span>{{ onlineuser.pre }}%</span>
                  </span>
                </div>
              </div>
            </div>
          </template> -->
        </t-card>
      </div>
    </div>
    <div
      style="display: flex; margin-top: 16px; flex-direction: row"
      tag-100p-width>
      <!-- <t-space> -->
      <div style="min-width: 75.65%">
        <t-card
          style="
            height: 406px;
            margin-right: 16px;
            display: flex;
            flex-direction: column;
          "
          title="日借出量"
          subtitle="近7天"
          we-tag-dashboard-card
          card-header-remove-paddingbottom
          card-header-wrapper-div-display-flex
          card-body-remove-paddingtop
          card-body-height-100>
          <div
            ref="ChartsLR"
            id="ChartsLR"
            style="width: 100%; height: 100%" class="Ischarts"></div>
          <div
            id="skeleton"
            v-if="checkDOM('ChartsLR')"
            style="margin-top: 12px; height: 95%; width: 100%"></div>
        </t-card>
      </div>
      <div>
        <t-card
          style="height: 406px; display: flex; flex-direction: column"
          title="今日设备归还率"
          we-tag-dashboard-card
          card-header-remove-paddingbottom
          card-header-wrapper-div-display-flex
          card-body-remove-paddingtop
          card-body-height-100>
          <div
            ref="ChartsLRP"
            id="ChartsLRP"
            style="width: 100%; height: 100%" class="Ischarts"></div>
          <div
            id="skeleton"
            v-if="checkDOM('ChartsLRP')"
            style="margin-top: 12px; height: 95%; width: 100%"></div>
        </t-card>
      </div>
      <!-- </t-space> -->
    </div>
    <!-- <div
      style="display: flex; flex-direction: row; margin-top: 16px"
      tag-100p-width>
      <t-space>
        <div>
          <t-card
            style="width: 100%; height: 460px"
            title="借出设备排行"
            we-tag-dashboard-card></t-card>
        </div>
        <div>
          <t-card
            style="width: 100%; height: 460px"
            title="借出人次排行"
            we-tag-dashboard-card></t-card>
        </div>
      </t-space>
    </div>
    <div
      style="display: flex; flex-direction: row; margin-top: 16px"
      tag-100p-width>
      <t-space>
        <div>
          <t-card
            style="width: 100%; height: 460px"
            title="出入库概览"
            we-tag-dashboard-card></t-card>
        </div>
      </t-space>
    </div> -->
  </div>
  <footer
    class="t-layout__footer tdesign-starter-footer-layout"
    style="display: none">
    <div class="tdesign-starter-footer">
      Copyright © 2021-2023 Tencent. All Rights Reserved
    </div>
  </footer>
</template>

<script>
import * as api from "../../components/config/api.js";
// import * as config from "@/components/config.js"; // for testing, replace with "./config.js" for production server. 描述自身数据库信息以";
import { themeMode, toggleTheme } from "@/components/function/theme.js";
import { NotifyPlugin } from "tdesign-vue-next";
import { config } from "@/components/config.js";
import { HTTPRequest } from "@/components/function/hooks.js";
import { getCurrentInstance, onMounted } from "vue";

var echarts;
var Chartslist = []

export default {
  name: "DashBoard",
  data() {
    return {
      onlineuser: {
        fromdata: {},
        stand: "NaN",
        data: "NaN",
        desc: "NaN",
        pre: "NaN",
        preway: true,
      },
      Top_items_Content: {
        LendTime: NaN,
        EquipmentTotal: NaN,
        NotReturnTotal: NaN,
      },
      Charts_LR: {
        Charts_xAxis_Text: [],
        Charts_xAxis_LData: [],
        Charts_xAxis_RData: [],
      },
      Charts_TodayLR: {
        lend: 0,
        return: 0,
        percent: 0,
      },
    };
  },
  setup() {
    let internalInstance = getCurrentInstance();
    echarts = internalInstance.appContext.config.globalProperties.$echarts;
    const checkDOM = (id) => {
      let a = document.getElementById(id);
      if (!a) {
        return true;
      } else {
        return false;
      }
    };
    return {
      checkDOM,
    };
  },
  mounted() {
    var that = this;
    this.InitAllContentData();
    setTimeout(() => {
      that.InitAllCharts();
    }, 1000);
    var a = window.onresize
    window.onresize = (e) => {
      a(e)
      that.ResizeAllCharts();
    };
  },
  methods: {

    InitAllContentData() {
      this.initContentData()
      this.initChartsData()
    },

    InitAllCharts() {
      this.initChartsLR()
      this.initChartsLRP()
    },

    ResizeAllCharts() {
      const cl = Chartslist
      for (const index in cl) {
        if (Object.hasOwnProperty.call(cl, index)) {
          cl[index].resize()
        }
      }
    },

    initContentData() {
      var that = this;
      try {
        HTTPRequest({
          url: config.API_URL.MAIN_URL + "/Dashboard/ContentData",
          methods: "GET",
          header: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          success: function (res) {
            var RES = JSON.parse(res);
            if (RES.errcode == 0) {
              that.$data.Charts_LR.Charts_xAxis_Text = RES.data.Days_LR_Text;
              that.$data.Top_items_Content.LendTime = RES.data.TopItemsData.LendTotal
              that.$data.Top_items_Content.EquipmentTotal = RES.data.TopItemsData.EquipmentTotal
              that.$data.Top_items_Content.NotReturnTotal = RES.data.TopItemsData.NotReturnTotal
              // that.$data.Top_items_Content
            } else {
              that.$data.Charts_LR.Charts_xAxis_Text = [
                "NaN",
                "NaN",
                "NaN",
                "NaN",
                "NaN",
                "NaN",
                "NaN",
              ];
            }
          },
          error: function (err) {
            console.error(err);
            NotifyPlugin("error", {
              title: "获取图表数据失败",
              content: err,
              duration: 4000,
            });
          },
        });
      } catch (e) {
        console.log(e);
      }
    },

    initChartsData() {
      var that = this;
      try {
        HTTPRequest({
          url: config.API_URL.MAIN_URL + "/Dashboard/ChartData",
          methods: "GET",
          header: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          success: function (res) {
            var RES = JSON.parse(res);
            if (RES.errcode == 0) {
              that.$data.Charts_LR.Charts_xAxis_LData = RES.data.LendTotal;
              that.$data.Charts_LR.Charts_xAxis_RData = RES.data.ReturnTotal;
              that.$data.Charts_TodayLR.lend = RES.data.TodayTotal.lend;
              that.$data.Charts_TodayLR.return = RES.data.TodayTotal.return;
              that.$data.Charts_TodayLR.percent = RES.data.TodayTotal.percent;
            } else {
              that.$data.Charts_LR.Charts_xAxis_LData = [0, 0, 0, 0, 0, 0, 0];
              that.$data.Charts_LR.Charts_xAxis_RData = [0, 0, 0, 0, 0, 0, 0];
            }
          },
          error: function (err) {
            console.error(err);
            NotifyPlugin("error", {
              title: "获取图表数据失败",
              content: err,
              duration: 4000,
            });
          },
        });
      } catch (e) {
        console.log(e);
      }
    },

    initChartsLR() {
      var that = this;
      const RANDOM = Math.floor(Math.random() * 3600) % 2;
      const dom = document.getElementById("ChartsLR");
      if (dom === null) return false;
      Chartslist["ChartsLR"] = echarts.init(dom); // 初始化echarts实例
      const option = {
        tooltip: {
          trigger: "axis",
        },
        color: RANDOM == 0 ? ["#4582e6", "#4DC156"] : ["#4582E6", "#E290D0"],
        legend: {
          data: ["借出次数", "归还次数"],
          bottom: 0,
          textStyle: {
            color: "abcd",
          },
        },
        grid: {
          top: "24px",
          left: "16px",
          right: "32px",
          bottom: "26px",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: that.$data.Charts_LR.Charts_xAxis_Text,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "借出次数",
            type: "line",
            symbol: "circle",
            symbolSize: 8,
            areaStyle: {
              color: "#2667d470",
            },
            lineStyle: {
              width: 3,
            },
            data: that.$data.Charts_LR.Charts_xAxis_LData,
          },
          {
            name: "归还次数",
            type: "line",
            data: that.$data.Charts_LR.Charts_xAxis_RData,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
              width: 3,
              type: "dotted",
            },
          },
        ],
      };
      // 设置实例参数
      Chartslist["ChartsLR"].setOption(option);
    },

    initChartsLRP() {
      var that = this;
      const RANDOM = Math.floor(Math.random() * 3600) % 2;
      const dom = document.getElementById("ChartsLRP");
      if (dom === null) return false;
      Chartslist["ChartsLRP"] = echarts.init(dom, null, {renderer: 'svg'}); // 初始化echarts实例
      const option = {
        color: RANDOM == 0 ? ["#FABD2A", "#4582e6"] : ["#E290D0", "#4582E6"],
        legend: {
          bottom: 0,
          selectedMode: false,
          icon: "rect",
          itemHeight: 3,
          itemWidth: 12,
          textStyle:{
            color: "var(--td-text-color-primary)",
          }
        },
        grid: {
          top: "24px",
          left: "16px",
          right: "32px",
          bottom: "26px",
          containLabel: true,
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: true,
                position: "center",
                color: "#4c4a4a",
                formatter:
                  "{total|" + that.$data.Charts_TodayLR.percent + "%}" + "\n\r" + "{active|归还率}",
                rich: {
                  total: {
                    fontSize: 35,
                    fontFamily: "微软雅黑",
                    color: "#4582e6",
                  },
                  active: {
                    fontFamily: "微软雅黑",
                    fontSize: 16,
                    color: "var(--td-text-color-placeholder)",
                    padding: [4, 0, 0, 0],
                  },
                },
              },
              emphasis: {
                //中间文字显示
                show: true,
              },
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: 100 - that.$data.Charts_TodayLR.percent,
                name: "未归还",
              },
              { value: that.$data.Charts_TodayLR.percent, name: "已归还" },
            ],
          },
        ],
      };
      // 设置实例参数
      Chartslist["ChartsLRP"].setOption(option);
    },

  },
};
</script>

<style>
/**顶部5位的样式 */
/**蓝色的 */
[we-bg-color-blue] {
  background-color: #0052d9 !important;
}

[we-bg-color-blue] > div.t-card__body {
  background-color: #0052d9 !important;
}

[we-bg-color-blue] .t-card__title {
  color: var(--td-text-color-anti) !important;
}

.tdesign-starter-footer-layout {
  padding: 0;
}

.tdesign-starter-footer {
  color: var(--td-text-color-placeholder);
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}

.t-layout__footer {
  color: var(--td-text-color-placeholder);
  padding: 24px 24px 0px 24px !important;
}

/**红色的 */
[we-bg-color-red] {
  background-color: var(--td-error-color) !important;
}

[we-bg-color-red] > div.t-card__body {
  background-color: var(--td-error-color) !important;
}

[we-bg-color-red] .t-card__title {
  color: var(--td-text-color-anti) !important;
}

/**绿色的 */
[we-bg-color-green] {
  background-color: var(--td-success-color) !important;
}

[we-bg-color-green] > div.t-card__body {
  background-color: var(--td-success-color) !important;
}

[we-bg-color-green] .t-card__title {
  color: var(--td-text-color-anti) !important;
}

/**普通 */
[we-bg-color-primary] .t-avatar {
  color: var(--td-text-color-primary) !important;
}

/**卡片主要样式，覆盖tdesign默认的 */
[page="Dashboard"] .t-card--bordered {
  border: none !important;
}

[we-card] {
  height: 160px;
  border-radius: 6px;
}

[we-card] .t-card__title {
  /* color: var(--td-text-color-secondary) !important; */
  font: var(--td-font-body-medium) !important;
  font-size: 15px !important;
}

[we-card] [tag-black] .t-avatar {
  background: var(--we-card-primary-bg-color) !important;
}

[we-card] [tag-blue] .t-avatar {
  background: var(--we-card-blue-bg-color) !important;
}

[we-card] [tag-green] .t-avatar {
  background: var(--we-card-green-bg-color) !important;
}

[we-card] [tag-red] .t-avatar {
  background: var(--we-card-red-bg-color) !important;
}

[we-card] .t-avatar {
  color: var(--we-card-primary-text-color) !important;
}

[we-card] {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xxl) !important;
}

[we-card] .t-card__header {
  padding: 0 !important;
}

[we-card] .t-card__footer {
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  padding-top: 17px;
}

[we-card] .t-card__body {
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  flex: 1 !important;
  position: relative !important;
  padding: 0 !important;
  margin-top: var(--td-comp-margin-s) !important;
  margin-bottom: 0 !important;
  height: 56px;
}

[we-bg-color-green] .dashboard-item-block,
[we-bg-color-red] .dashboard-item-block,
[we-bg-color-blue] .dashboard-item-block {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #fff !important;
}

/**活跃用户图标覆盖样式 */
[we-charts-lastweekuser] > div > svg > g > path[fill="none"] {
  display: none !important;
}

[we-charts-lastweekuser] > div > svg > g > text {
  display: none !important;
}

/**组样式区域 */
[we-list-big] {
  display: flex !important;
}

/**下面还有一个组（空出一段距离） */
[we-list-big-xmhyygz] {
  margin-bottom: 16px !important;
}

/**第二组 */
[we-list-big-2] .t-card__header {
  padding: 32px 32px 0px 32px !important;
}

[we-list-big-2] .t-card__title {
  font: var(--td-font-title-large) !important;
  font-weight: 400 !important;
}

/**第三组 */
[we-list-big-3] .t-card {
  padding: 30px 32px 32px 32px !important;
}

[we-list-big-3] .t-card__header,
[we-list-big-3] .t-card__body {
  padding: 0 !important;
}

[we-list-big-3] .t-card__title {
  font: var(--td-font-title-large) !important;
  font-weight: 400 !important;
}

/**每个组的子组件 */
[we-top-card-item] {
  width: 100% !important;
  height: 160px;
  padding: 0px 8px;
}

[we-top-card-item]:first-child {
  padding-left: 0px;
}

[we-top-card-item]:last-child {
  padding-right: 0px;
}

/**服务状态图表样式 */
#serverun > div {
  cursor: default !important;
}

/**禁止用户选中 */
[we-user-select-none] {
  user-select: none !important;
}

:root {
  --we-card-primary-bg-color: rgb(84 84 84 / 73%) !important;
  --we-card-primary-text-color: #fff !important;
  --we-card-blue-bg-color: #003fa3 !important;
  --we-card-green-bg-color: #067c4ad9 !important;
  --we-card-red-bg-color: #b9443ef7 !important;
}

:root[theme-mode="dark"] {
  --we-card-primary-bg-color: rgb(255 255 255 / 38%) !important;
  --we-card-primary-text-color: #fff !important;
}

/**从TdesignStarter拿的样式 */
.dashboard-item-trend {
  margin-left: var(--td-comp-margin-s) !important;
}

.trend-container__down {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.trend-container .trend-icon-container {
  border-radius: 50% !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 16px !important;
  height: 16px !important;
}

.trend-container__down .trend-icon-container {
  background: rgb(255 255 255 / 20%) !important;
  margin-right: 8px !important;
}

.dashboard-item-bottom {
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-between !important;
  align-items: center !important;
}

.dashboard-item-block {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: var(--td-text-color-placeholder) !important;
}

.item-right {
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start !important;
  padding-top: 6px !important;
}

.item-right > span {
  font-size: 40px !important;
  color: #fff;
}

.item-top {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
}

[we-tag-dashboard-card] .t-card__title {
  font: var(--td-font-title-large);
  font-weight: 400;
}

[we-tag-dashboard-card] .t-card__header {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl) !important;
}

[tag-100p-width] > div {
  width: 100%;
}

[card-header-remove-paddingbottom] > .t-card__header {
  padding-bottom: 0px !important;
}

[card-body-remove-paddingtop] > .t-card__body {
  padding-top: 0px !important;
}

[card-body-height-100] > .t-card__body {
  height: 100%;
}

[card-header-wrapper-div-display-flex]
  > .t-card__header
  .t-card__header-wrapper
  > div {
  display: flex;
  align-items: flex-end;
}

#skeleton {
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-medium);
}
</style>
