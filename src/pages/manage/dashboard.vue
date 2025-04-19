<template>
  <div style="margin-bottom: 16px">
    <t-alert
      theme="info"
      message="由于系统迭代升级，数据表及内容产生变更，导致数据表其中某些数据异常（已进行兼容处理），异常数据可人工修正或等待系统自动覆盖！"
    />
  </div>
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
            <span>{{ topCardData.LendTotal }}</span>
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
            <span>{{ topCardData.EquipmentTotal }}</span>
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
                  <!---->
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
            <span>{{ topCardData.NotReturnTotal }}</span>
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
            <span style="color: var(--td-text-color-primary)">{{ topCardData.LoginTotal }}</span>
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
    <div style="display: flex; margin-top: 16px; flex-direction: row" tag-100p-width>
      <!-- <t-space> -->
      <div style="min-width: 75.65%">
        <t-card
          style="height: 406px; margin-right: 16px; display: flex; flex-direction: column"
          title="日借出量"
          subtitle="近7天"
          we-tag-dashboard-card
          card-header-remove-paddingbottom
          card-header-wrapper-div-display-flex
          card-body-remove-paddingtop
          card-body-height-100
        >
          <div id="ChartsLR" ref="ChartsLR" style="width: 100%; height: 100%" class="Ischarts"></div>
          <!--监测尺寸变化Object-->
          <object
            ref="objectResizeRef"
            tabindex="-1"
            type="text/html"
            aria-hidden="true"
            data="about:blank"
            style="
              display: block;
              position: absolute;
              top: 0px;
              left: 0px;
              width: 100%;
              height: 100%;
              border: none;
              padding: 0px;
              margin: 0px;
              opacity: 0;
              z-index: -1000;
              pointer-events: none;
            "
          ></object>
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
          card-body-height-100
        >
          <div
            id="ChartsTodayPercent"
            ref="ChartsTodayPercent"
            style="width: 100%; height: 100%"
            class="Ischarts"
          ></div>
        </t-card>
      </div>
      <!-- </t-space> -->
    </div>
    <div style="display: flex; flex-direction: row; margin-top: 16px" tag-100p-width>
      <t-space>
        <div>
          <t-card class="limitHeight" style="width: 100%; height: 460px" title="借出设备排行" we-tag-dashboard-card>
            <t-table
              :columns="tableEquipmentRankingColumns"
              :data="tableEquipmentRankingData"
              max-height="368px"
            ></t-table>
          </t-card>
        </div>
        <div>
          <t-card class="limitHeight" style="width: 100%; height: 460px" we-tag-dashboard-card>
            <template #title>
              <div style="display: flex; flex-direction: row; gap: 8px; align-items: flex-end">
                <div>借出人次排行</div>
                <span style="font: var(--td-font-link-medium); color: var(--td-text-color-disabled)"
                  >(不包含访客数据)</span
                >
              </div>
            </template>
            <t-table
              :columns="tableUserRankingColumns"
              :data="tableUserRankingData"
              :rowspan-and-colspan="tableUserRankingRowspanAndColspan"
              max-height="368px"
              bordered
            ></t-table>
          </t-card>
        </div>
      </t-space>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { NotifyPlugin } from 'tdesign-vue-next';
import { getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import useRequest from '@hooks/useRequest';
import { getToken } from '@hooks/common';

const objectResizeRef = ref(null);
var echarts;
var Chartslist = [];
let internalInstance = getCurrentInstance();
echarts = internalInstance.appContext.config.globalProperties.$echarts;
var Timer = null;
// 默认数据都为0，使用updateChartsLendReturn更新图表数据
const chartsLendReturn = reactive({
  Charts_xAxis_Text: [0, 0, 0, 0, 0, 0, 0],
  Charts_xAxis_LData: [0, 0, 0, 0, 0, 0, 0],
  Charts_xAxis_RData: [0, 0, 0, 0, 0, 0, 0],
});
// 默认数据都为0，使用updateChartsTodayPercent更新图表数据
const chartsTodayPercent = reactive({
  lend: 0,
  return: 0,
  percent: 0,
});
// 顶部卡片数据
const topCardData = ref({
  EquipmentTotal: NaN,
  LendTotal: NaN,
  LoginTotal: NaN,
  NotReturnTotal: NaN,
});
// 借出设备排行表
const tableEquipmentRankingColumns = [
  {
    colKey: 'id',
    title: '排名',
    width: 120,
  },
  {
    colKey: 'equipment_code',
    title: '设备码',
    minWidth: 80,
  },
  {
    colKey: 'equipment_name',
    title: '设备名称',
    minWidth: 80,
  },
  {
    colKey: 'lend_total',
    title: '借出次数',
    width: 160,
  },
];
const tableEquipmentRankingData = ref([]);
// 借出人次排行表排名
const tableUserRankingColumns = [
  {
    colKey: 'id',
    title: '排名',
    width: 120,
  },
  {
    colKey: 'lend_userid',
    title: '借出人',
    minWidth: 80,
    align: 'center',
  },
  {
    colKey: 'operater_username',
    title: '操作人',
    minWidth: 80,
    align: 'center',
  },
  {
    colKey: 'lend_equipment',
    title: '借过几样设备',
    minWidth: 80,
    cell: (h, { row }) => {
      return row.lend_equipment.length + ' 样';
    },
  },
  {
    colKey: 'lend_total',
    title: '总计借出次数',
    width: 160,
    cell: (h, { row }) => {
      return row.lend_total + ' 次';
    },
  },
];
const tableUserRankingData = ref([]);

// 合并单元格
const tableUserRankingRowspanAndColspan = ({ row, col, rowIndex, colIndex }) => {
  if (row.lend_userid === row.operater_username && col.colKey === 'lend_userid') {
    return {
      colspan: 2,
      rowspan: 1,
    };
  }
  // if (col.colKey === 'lend_userid' && colIndex === 4) {
  //   return {
  //     colspan: 2,
  //     rowspan: 2,
  //   };
  // }
};

// 初始化全部图表
const InitAllCharts = () => {
  initCharts_LendReturn();
  initChartsTodayPercent();
};

const ResizeAllCharts = () => {
  const cl = Chartslist;
  for (const index in cl) {
    if (Object.hasOwnProperty.call(cl, index)) {
      cl[index].resize();
    }
  }
};

// 更新归还率图表
const updateChartsTodayPercent = () => {
  const option = {
    // ["#E290D0", "#4582E6"]
    color: ['#FABD2A', '#4582e6'],
    legend: {
      bottom: 0,
      selectedMode: false,
      icon: 'rect',
      itemHeight: 3,
      itemWidth: 12,
      textStyle: {
        color: 'var(--td-text-color-primary)',
      },
    },
    grid: {
      top: '24px',
      left: '16px',
      right: '32px',
      bottom: '26px',
      containLabel: true,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        hoverAnimation: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#4c4a4a',
            formatter: '{total|' + chartsTodayPercent.percent + '%}' + '\n\r' + '{active|归还率}',
            rich: {
              total: {
                fontSize: 35,
                fontFamily: '微软雅黑',
                color: '#4582e6',
              },
              active: {
                fontFamily: '微软雅黑',
                fontSize: 16,
                color: 'var(--td-text-color-placeholder)',
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
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: 100 - chartsTodayPercent.lend,
            name: '未归还',
          },
          { value: chartsTodayPercent.return, name: '已归还' },
        ],
      },
    ],
  };
  // 设置实例参数
  Chartslist['ChartsTodayPercent'].setOption(option);
};

// 初始化归还率图表实例
const initChartsTodayPercent = () => {
  const dom = document.getElementById('ChartsTodayPercent');
  if (dom === null) return false;
  Chartslist['ChartsTodayPercent'] = echarts.init(dom, null, { renderer: 'svg' });
};

// 更新借出归还图表
const updateChartsLendReturn = () => {
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    // ["#4582E6", "#E290D0"]
    color: ['#4582e6', '#4DC156'],
    legend: {
      data: ['借出次数', '归还次数'],
      bottom: 0,
      textStyle: {
        color: 'abcd',
      },
    },
    grid: {
      top: '24px',
      left: '16px',
      right: '32px',
      bottom: '26px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartsLendReturn.Charts_xAxis_Text,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '借出次数',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: '#2667d470',
        },
        lineStyle: {
          width: 3,
        },
        data: chartsLendReturn.Charts_xAxis_LData,
      },
      {
        name: '归还次数',
        type: 'line',
        data: chartsLendReturn.Charts_xAxis_RData,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          type: 'dotted',
        },
      },
    ],
  };
  // 设置实例参数
  Chartslist['ChartsLR'].setOption(option);
};

// 初始化借出归还图表实例
const initCharts_LendReturn = () => {
  // const RANDOM = Math.floor(Math.random() * 3600) % 2;
  const dom = document.getElementById('ChartsLR');
  if (dom === null) return false;
  Chartslist['ChartsLR'] = echarts.init(dom);
  updateChartsLendReturn();
};

// 顶部卡片数据、折线图文字数据
const loadContentData = () => {
  const TOKEN = getToken();
  useRequest({
    url: '/Dashboard/ContentData',
    methods: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: TOKEN,
    },
    success: function (res) {
      var RES = JSON.parse(res);
      if (RES.errcode == 0) {
        chartsLendReturn.Charts_xAxis_Text = RES.data.Days_LR_Text;
        topCardData.value = RES.data.TopItemsData;
        updateChartsLendReturn();
      } else {
        NotifyPlugin('error', {
          title: '获取设备借出列表失败',
          content: RES.errmsg,
          duration: 5000,
        });
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin('error', {
        title: '获取设备借出列表失败',
        content: err,
        duration: 5000,
      });
    },
  });
};

// 图表数据
const loadChartData = () => {
  const TOKEN = getToken();
  useRequest({
    url: '/Dashboard/ChartData',
    methods: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: TOKEN,
    },
    success: function (res) {
      var RES = JSON.parse(res);
      if (RES.errcode == 0) {
        chartsLendReturn.Charts_xAxis_LData = RES.data.LendTotal;
        chartsLendReturn.Charts_xAxis_RData = RES.data.ReturnTotal;
        chartsTodayPercent.lend = RES.data.TodayTotal.lend;
        chartsTodayPercent.return = RES.data.TodayTotal.return;
        chartsTodayPercent.percent = RES.data.TodayTotal.percent;
        updateChartsLendReturn();
        updateChartsTodayPercent();
      } else {
        NotifyPlugin('error', {
          title: '获取设备借出列表失败',
          content: RES.errmsg,
          duration: 5000,
        });
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin('error', {
        title: '获取设备借出列表失败',
        content: err,
        duration: 5000,
      });
    },
  });
};

// TableData
// {
//     "data": {
//         "equipment": [
//             {
//                 "equipment_code": "01002",
//                 "equipment_name": "\u7d22\u5c3cA7M3\u76f8\u673a",
//                 "id": 1,
//                 "lend_total": 22,
//                 "user_name": [
//                     "\u6797\u6653\u541b",
//                     "\u6b27\u9633\u8335\u6b23",
//                     "\u9093\u5609\u6d01",
//                     "\u90d1\u79c0\u7433",
//                     "\u5b63\u6069\u6cfd",
//                     "\u5434\u6893\u6052",
//                     "\u4f55\u9e3f\u4eae",
//                     "\u80e1\u94ed\u6866",
//                     "\u674e\u4fca\u6bc5",
//                     "\u8c22\u529b\u6d69",
//                     "\u9ec4\u6653\u742a"
//                 ]
//             }
//         ],
//         "user": [
//             {
//                 "id": 1,
//                 "lend_equipment": [
//                     "01030",
//                     "01036",
//                     "05006",
//                     "04003",
//                     "01002",
//                     "02065",
//                     "01032",
//                     "02079",
//                     "04007",
//                     "02022",
//                     "02016",
//                     "01011",
//                     "02070",
//                     "02077",
//                     "01029",
//                     "02076",
//                     "01038"
//                 ],
//                 "lend_total": 39,
//                 "lend_userid": "69",
//                 "operater_username": "\u5434\u6893\u6052"
//             }
//         ]
//     },
//     "errcode": 0,
//     "errmsg": "ok"
// }

// 加载全部数据

const loadTableData = () => {
  const TOKEN = getToken();
  useRequest({
    url: '/Dashboard/TableData',
    methods: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: TOKEN,
    },
    success: function (res) {
      var RES = JSON.parse(res);
      if (RES.errcode == 0) {
        tableEquipmentRankingData.value = RES.data.equipment;
        tableUserRankingData.value = RES.data.user;
      } else {
        NotifyPlugin('error', {
          title: '获取设备借出列表失败',
          content: RES.errmsg,
          duration: 5000,
        });
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin('error', {
        title: '获取设备借出列表失败',
        content: err,
        duration: 5000,
      });
    },
  });
};

const loadAllData = () => {
  loadContentData();
  loadChartData();
  loadTableData();
};

onMounted(() => {
  // 初始化全部图表
  InitAllCharts();
  // 加载全部数据
  loadAllData();
  // 添加一个窗口变化事件
  window.addEventListener('resize', () => {
    ResizeAllCharts();
  });
  objectResizeRef.value.contentDocument.defaultView.addEventListener('resize', () => {
    ResizeAllCharts();
  });
  // 启动计时器
  Timer = setInterval(() => {
    loadAllData();
  }, 30000);
});

onBeforeUnmount(() => {
  // 移除监听事件
  window.removeEventListener('resize', () => {
    ResizeAllCharts();
  });
  objectResizeRef.value.contentDocument.defaultView.removeEventListener('resize', () => {
    ResizeAllCharts();
  });
  // 关闭计时器
  clearInterval(Timer);
});
</script>

<script lang="tsx">
export default {
  name: 'DashBoard',
};
</script>

<style lang="scss">
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

.t-card.limitHeight .t-card__header {
  padding-bottom: 0 !important;
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
[page='Dashboard'] .t-card--bordered {
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
[we-charts-lastweekuser] > div > svg > g > path[fill='none'] {
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

:root[theme-mode='dark'] {
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
  padding-top: 12px !important;
}

.item-right > span {
  font-size: 45px !important;
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

[card-header-wrapper-div-display-flex] > .t-card__header .t-card__header-wrapper > div {
  display: flex;
  align-items: flex-end;
}

#skeleton {
  background: var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-medium);
}
</style>
