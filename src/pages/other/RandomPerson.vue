<template>
  <div style="margin-bottom: 16px">
    <t-alert theme="warning" message="This Page Function Is Pending Development! PLEASE Wait For Development!" />
  </div>
  <SelectButtonList :value="{ title: 'asdsd' }"></SelectButtonList>
  <t-tabs :value="Tabs.value" theme="card" @change="handleChange">
    <t-tab-panel value="All">
      <template #label> <t-icon name="user-list" class="tabs-icon-margin" /> 总名单抽取 </template>
      <div>
        <t-row>
          <t-col :flex="1">
            <t-space direction="vertical">
              <t-space>
                <t-button
                  variant="outline"
                  :class="{ 'wesley-hover': number_choose == 1 }"
                  @click="handleNumberChoose(1)"
                  >1</t-button
                >
                <t-button
                  variant="outline"
                  :class="{ 'wesley-hover': number_choose == 2 }"
                  @click="handleNumberChoose(2)"
                  >2</t-button
                >
                <t-button
                  variant="outline"
                  :class="{ 'wesley-hover': number_choose == 3 }"
                  @click="handleNumberChoose(3)"
                  >3</t-button
                >
                <t-input-number
                  v-model="number_input"
                  :allow-input-over-limit="false"
                  :min="4"
                  :max="Data.TotalData.length"
                  theme="column"
                  placeholder="其他"
                  :class="{ 'wesley-hover': number_choose == 4 }"
                  :on-change="
                    (e) => {
                      number_input = e;
                    }
                  "
                  @click="(number_choose_backup = number_choose), (number_choose = 4)"
                ></t-input-number>
              </t-space>
              <div style="display: flex; flex-direction: row">
                <div style="display: flex; flex-direction: row; align-items: center; margin-right: 16px">
                  动画：<t-switch
                    v-model="animation_switch"
                    size="large"
                    :label="['开', '关']"
                    :disabled="Pumping"
                  ></t-switch>
                </div>
                <t-button
                  :loading="Pumping"
                  class="startPump_default_button_style"
                  :class="{ onPumping: Pumping }"
                  @click="handleAllPumpsClick"
                  >抽取</t-button
                >
                <t-button
                  class="immediatelyEnd_default_button_style"
                  :class="{ onPumping: Pumping, NoStart: !Pumping }"
                  variant="outline"
                  theme="primary"
                  @click="hangleAllFinishImmediately"
                  >立即完成</t-button
                >
              </div>
            </t-space>
          </t-col>
          <t-col :flex="3">
            <div style="text-align: center; width: 100%; padding: 12px; margin: 6px">
              <div style="font-size: 48px; word-break: keep-all">
                <div v-for="item in PumpsValue" :key="item.id" style="margin: 24px 16px; display: inline-block">
                  {{ item.name }}
                </div>
                <div style="display: inline-block">
                  {{ PumpsData?.name }}
                </div>
              </div>
            </div>
          </t-col>
          <t-col :flex="1"></t-col>
        </t-row>
      </div>
    </t-tab-panel>
    <t-tab-panel value="Group">
      <template #label> <t-icon name="usergroup" class="tabs-icon-margin" /> 组别抽取 </template>
      <div>
        <t-row>
          <t-col :flex="1">
            <div style="display: flex; flex-direction: column; gap: 12px">
              <t-space :size="8">
                <t-button
                  v-for="(item, index) in GroupList"
                  :key="item"
                  variant="outline"
                  :class="{ 'wesley-hover': Group_number_choose == index }"
                  @click="handleGroupChoose(index)"
                  >{{ item.label }}</t-button
                >
              </t-space>
              <t-space direction="vertical">
                <t-space>
                  <t-button
                    variant="outline"
                    :class="{ 'wesley-hover': number_choose === 1 && Data.SelectGroupData.length > 1 }"
                    :disabled="Data.SelectGroupData.length < 1"
                    @click="handleNumberChoose(1)"
                    >1</t-button
                  >
                  <t-button
                    variant="outline"
                    :class="{ 'wesley-hover': number_choose === 2 && Data.SelectGroupData.length > 2 }"
                    :disabled="Data.SelectGroupData.length < 2"
                    @click="handleNumberChoose(2)"
                    >2</t-button
                  >
                  <t-button
                    variant="outline"
                    :class="{ 'wesley-hover': number_choose === 3 && Data.SelectGroupData.length > 3 }"
                    :disabled="Data.SelectGroupData.length < 3"
                    @click="handleNumberChoose(3)"
                    >3</t-button
                  >
                  <t-input-number
                    v-model="number_input"
                    :allow-input-over-limit="false"
                    :min="4"
                    wesley-tag
                    :max="Data.SelectGroupData.length"
                    theme="column"
                    placeholder="其他"
                    :disabled="Data.SelectGroupData.length < 4"
                    :class="{ 'wesley-hover': number_choose == 4 && Data.SelectGroupData.length > 4 }"
                    :on-change="
                      (e) => {
                        number_input = e;
                      }
                    "
                    @click="(number_choose_backup = number_choose), (number_choose = 4)"
                  ></t-input-number>
                </t-space>
                <div style="display: flex; flex-direction: row">
                  <div style="display: flex; flex-direction: row; align-items: center; margin-right: 16px">
                    动画：<t-switch
                      v-model="animation_switch"
                      size="large"
                      :label="['开', '关']"
                      :disabled="Pumping"
                    ></t-switch>
                  </div>
                  <t-button
                    :loading="Pumping"
                    :disabled="Data.SelectGroupData.length == 0"
                    :title="Data.SelectGroupData.length == 0 ? '当前组无人' : ''"
                    class="startPump_default_button_style"
                    :class="{ onPumping: Pumping }"
                    @click="handleAllPumpsClick"
                    >抽取</t-button
                  >
                  <t-button
                    class="immediatelyEnd_default_button_style"
                    :class="{ onPumping: Pumping, NoStart: !Pumping }"
                    variant="outline"
                    theme="primary"
                    @click="hangleAllFinishImmediately"
                    >立即完成</t-button
                  >
                </div>
              </t-space>
            </div>
          </t-col>
          <t-col :flex="3">
            <div style="text-align: center; width: 100%; padding: 12px; margin: 6px">
              <div style="font-size: 48px; word-break: keep-all">
                <div v-for="item in PumpsValue" :key="item.id" style="margin: 24px 16px; display: inline-block">
                  {{ item.name }}
                </div>
                <div style="display: inline-block">
                  {{ PumpsData.name }}
                </div>
              </div>
            </div>
          </t-col>
          <t-col :flex="1"></t-col>
        </t-row>
      </div>
    </t-tab-panel>
    <t-tab-panel value="List">
      <template #label> <t-icon name="user-search" class="tabs-icon-margin" /> 给定名单抽取 </template>
      <div>
        <t-transfer v-model="transfer.value" theme="primary" :data="transfer.data" :search="true">
          <template #title="props">
            <div>{{ props.type === 'target' ? '从中抽取' : '人员名单' }}</div>
          </template>
        </t-transfer>
      </div>
    </t-tab-panel>
  </t-tabs>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted } from 'vue';
import { NotifyPlugin } from 'tdesign-vue-next';
import useRequest from '../../hooks/useRequest';

interface UserData {
  name: string;
  group: number;
  [key: string]: any;
}

interface PumpsData {
  name: string;
  [key: string]: any;
}

const GroupList = [
  {
    label: '未分组',
    value: 0,
  },
  {
    label: '照片组',
    value: 1,
  },
  {
    label: '视频组',
    value: 2,
  },
  {
    label: '海报组',
    value: 3,
  },
  {
    label: '特效组',
    value: 4,
  },
  {
    label: '技术组',
    value: 5,
  },
];

const Tabs = reactive({
  value: 'All',
});

const transfer = reactive({
  value: [],
  data: [],
});

const number_choose = ref(1);
const number_input = ref(4);
const number_choose_backup = ref(0);
const Group_number_choose = ref(0);
const animation_switch = ref(true);
const PumpsData = ref<PumpsData>({ name: '' });
const PumpsValue = ref<UserData[]>([]);
const Pumping = ref(false);
const Pump_number = ref(0);
const Pump_NeedEnd = ref(false);
const Data = reactive({
  TotalData: [] as UserData[],
  GroupData: [] as UserData[][],
  SelectGroupData: [] as UserData[],
});

const handleChange = (value: string) => {
  Tabs.value = value;
};

// 总名单抽取-触发操作
const handleAllPumpsClick = async () => {
  const PumpsNumber = number_choose.value == 4 ? number_input.value : number_choose.value;
  Pumping.value = true;
  Pump_NeedEnd.value = false;
  Pump_number.value = PumpsNumber;

  try {
    const result = await StartPumpingUsers(!animation_switch.value, 1, Data.TotalData, PumpsNumber);
    PumpsValue.value = result;
    PumpsData.value = { name: '' };
    Pumping.value = false;
  } catch (error) {
    console.error(error);
    Pumping.value = false;
  }
};

// 总名单抽取-立即完成
const hangleAllFinishImmediately = () => {
  PumpsData.value = { name: '' };
  Pumping.value = false;
  Pump_NeedEnd.value = true;

  if (Pump_number.value - PumpsValue.value.length > 0) {
    PumpsValue.value.push(SummonRandomPerson(Data.TotalData, true, PumpsValue.value));
    hangleAllFinishImmediately();
  }
};

const handleNumberChoose = (e: number) => {
  number_choose.value = e;
};

const handleGroupChoose = (e: number) => {
  Group_number_choose.value = e;
  Data.SelectGroupData = Data.GroupData[e];
};

/**
 * @initData
 * @初始化数据
 */
const initData = () => {
  const TOKEN = localStorage.getItem('token');
  useRequest({
    url: '/user/random_GetUserList',
    methods: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: TOKEN,
    },
    success: function (res) {
      const RES = JSON.parse(res);
      if (RES.errcode == 0) {
        // 遍历数据
        const DATA = RES.data;
        // 一共几个组（除去晚修管理组）0-5
        const GroupTotal = 6;
        for (let Group_ID = 0; Group_ID < GroupTotal; Group_ID++) {
          Data.GroupData[Group_ID] = [];
        }
        for (const index in DATA) {
          if (Object.hasOwnProperty.call(DATA, index)) {
            const element = DATA[index];
            if (element.group < GroupTotal) {
              // 忽略了晚修管理组
              // 总数据
              Data.TotalData.push(element);
              // 分组数据
              Data.GroupData[element.group].push(element);
              // 穿梭框数据
              transfer.data.push({ label: `${element.group}-${element.name}`, value: index });
            }
          }
        }
        transfer.data.sort((a, b) => {
          return a.label[0] - b.label[0];
        });
      } else {
        NotifyPlugin('error', {
          title: '获取人员数据失败',
          content: RES.errmsg,
          duration: 5000,
        });
      }
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin('error', {
        title: '获取用户列表失败',
        content: err,
        duration: 5000,
      });
    },
  });
};

/**
 * @SummonRandomPerson
 * 随机抽取人员-只抽一个，包含防重功能
 * @param {Array} UserList 人员名单
 * @param {Boolean} PD (Prevent duplication)是否开启防重
 * @param {Array} PumpsList 已经抽取名单
 * @return {Object}
 */
const SummonRandomPerson = (UserList: UserData[], PD: boolean, PumpsList: UserData[]) => {
  const RandomPersonIndex = Math.floor(Math.random() * UserList.length);
  if (PD) {
    if (ObjectInArray(UserList[RandomPersonIndex], PumpsList)) {
      return SummonRandomPerson(UserList, PD, PumpsList);
    }
  }
  return UserList[RandomPersonIndex];
};

/**
 * @StartPumpingUsers
 * 抽用户-主操作
 * @param {Boolean} SkipAnimation 跳过动画
 * @param {Number} AnimationSpeed 动画速度
 * @param {Array} UserList 人员名单
 * @param {Number} PumpsNumber 抽取数量
 * @param {Number} NowPumps 递归数
 * @param {String} LastPumped 上一次抽取的用户
 * @return {Array}
 */
const StartPumpingUsers = (
  SkipAnimation = false,
  AnimationSpeed = 1,
  UserList: UserData[] = [],
  PumpsNumber = 1,
  NowPumps = 0,
  LastPumped: UserData[] = [],
) => {
  let s3: any;
  let s5: any;
  let PUMPSRESON: UserData[] = [];
  if (NowPumps != 0) {
    PUMPSRESON = LastPumped;
  } else {
    PumpsValue.value = [];
    PumpsData.value = { name: '' };
  }

  return new Promise<UserData[]>((resolve, reject) => {
    if (PumpsNumber > UserList.length) {
      reject('超出范围');
      NotifyPlugin('error', { title: '错误', content: '抽取人数超出名单范围！' });
      return false;
    }
    // 是否跳过动画
    if (!SkipAnimation) {
      // 渐渐慢下来的效果处理
      // 第一层
      const s1 = setInterval(() => {
        if (Pump_NeedEnd.value) {
          return;
        }
        PumpsData.value = SummonRandomPerson(UserList, false, []);
      }, 50 * AnimationSpeed);
      // 第二层
      const s2 = setTimeout(() => {
        clearInterval(s1);
        s3 = setInterval(() => {
          if (Pump_NeedEnd.value) {
            return;
          }
          PumpsData.value = SummonRandomPerson(UserList, false, []);
        }, 150 * AnimationSpeed);
      }, 3000 * AnimationSpeed);
      // 第三层
      const s4 = setTimeout(() => {
        clearInterval(s3);
        const s5 = setInterval(() => {
          if (Pump_NeedEnd.value) {
            return;
          }
          PumpsData.value = SummonRandomPerson(UserList, false, []);
        }, 200 * AnimationSpeed);
      }, 5000 * AnimationSpeed);
      // 第四层
      setTimeout(() => {
        clearInterval(s5);
        if (Pump_NeedEnd.value) {
          return;
        }
        setTimeout(async () => {
          // 其实这个才是真的抽人操作，上面都是为了展现效果的。
          const PERSON = SummonRandomPerson(UserList, true, PUMPSRESON);
          PumpsData.value = PERSON;
          PUMPSRESON.push(PERSON);
          PumpsValue.value = PUMPSRESON;
          if (PumpsNumber > 1 && NowPumps + 1 != PumpsNumber) {
            PumpsData.value = { name: '' };
            setTimeout(() => {
              resolve(
                StartPumpingUsers(SkipAnimation, AnimationSpeed, UserList, PumpsNumber, NowPumps + 1, PUMPSRESON),
              );
            }, 500);
          } else {
            resolve(PUMPSRESON);
          }
        }, 50 * AnimationSpeed);
      }, 7500 * AnimationSpeed);
    } else {
      const PERSON = SummonRandomPerson(UserList, true, PUMPSRESON);
      PumpsData.value = PERSON;
      PUMPSRESON.push(PERSON);
      PumpsValue.value = PUMPSRESON;
      if (PumpsNumber > 1 && NowPumps + 1 != PumpsNumber) {
        setTimeout(async () => {
          resolve(
            await StartPumpingUsers(SkipAnimation, AnimationSpeed, UserList, PumpsNumber, NowPumps + 1, PUMPSRESON),
          );
        }, 10);
      } else {
        resolve(PUMPSRESON);
      }
    }
  });
};

/**
 * @ObjectInArray
 * 判断某Object是否在Array中
 * @param {Object} Object 要判断的Object
 * @param {Array} Array 要判断的Array
 * @return {Boolean}
 */
const ObjectInArray = (Object: UserData, Array: UserData[]) => {
  for (let i = 0; i < Array.length; i++) {
    if (Object == Array[i]) {
      return true;
    }
  }
  return false;
};

onMounted(() => {
  initData();
});
</script>

<script lang="tsx">
export default {
  name: 'RandomPerson',
};
</script>

<style>
.t-tabs__header .t-icon {
  font-size: 20px !important;
}

.tabs-icon-margin {
  margin-right: 6px;
}

.t-tabs .t-tab-panel {
  padding: 16px;
}

.t-button.t-button--variant-outline.t-button--theme-default.wesley-hover,
.wesley-hover .t-input {
  color: var(--td-brand-color-hover);
  border-color: var(--td-brand-color-hover);
}

.startPump_default_button_style {
  width: 167px;
}

.startPump_default_button_style.onPumping {
  width: 80px;
  margin-right: 7px;
}

.immediatelyEnd_default_button_style {
  width: 0px;
}

.immediatelyEnd_default_button_style.NoStart {
  padding: 0 !important;
  border: 0 !important;
}

.immediatelyEnd_default_button_style.onPumping {
  width: 80px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

[wesley-tag] .t-input.t-is-disabled.t-is-error {
  border-color: transparent;
}
</style>
