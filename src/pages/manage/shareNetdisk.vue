<template>
  <div>
    <t-tabs :default-value="1">
      <t-tab-panel :value="1" class="autoPadding">
        <template #label>
          <AssignmentCodeIcon style="margin-right: 4px" />
          <span>『取件码』设置</span>
        </template>
        <!---->
        <div class="pickUpCode-Title">当前『取件码』列表。受系统政策限制，不允许编辑『取件码』内容</div>
        <div class="pickUpCode-Box">
          <div v-for="(item, index) in pickUpCodeList" :key="item?.id ?? index" class="pickUpCode-Box--item">
            <div>『码』ID：{{ item?.id }}；『码』值:</div>
            <NumberBox :value="item.value"></NumberBox>
            <t-button size="small" @click="showPickUpCodeDetail(item)"> 详情 </t-button>
            <t-popconfirm theme="danger" content="确认删除吗" @confirm="DeletePickUpCode(item)">
              <t-button theme="danger" size="small" variant="outline"> 删除 </t-button>
            </t-popconfirm>
          </div>
        </div>
        <!---->
        <div class="pickUpCode-Title">新增『取件码』</div>
        <!---->
        <div>
          <div style="display: flex; flex-direction: column; gap: 12px; width: 50%; padding: 16px">
            <div class="pickUpCode-Form--item">
              <span>『取件码』</span>
              <NumberInput v-model:value="pickUpCodeFormData.code" :total="8" :split="3"></NumberInput>
            </div>
            <div class="pickUpCode-Form--item">
              <span>『取件码』类型</span>
              <t-select v-model:value="pickUpCodeFormData.type">
                <t-option key="分享链接" label="分享链接" value="redirect" />
                <t-option key="文件列表（暂未支持）" label="文件列表（暂未支持）" value="fileList" />
              </t-select>
            </div>
            <div class="pickUpCode-Form--item">
              <span>『取件码』是否为页面路由</span>
              <t-switch v-model:value="pickUpCodeFormData.isRouter" size="large">
                <template #label="slotProps">{{ slotProps.value ? '是' : '否' }}</template>
              </t-switch>
            </div>
            <div class="pickUpCode-Form--item">
              <span>『取件码』目标地址</span>
              <t-input
                v-model:value="pickUpCodeFormData.extra"
                :status="pickUpCodeURLInputStatus.status"
                :tips="pickUpCodeURLInputStatus.value"
                @input="
                  () => {
                    pickUpCodeURLInputStatus.status = 'default';
                    pickUpCodeURLInputStatus.value = '';
                  }
                "
              ></t-input>
            </div>
            <div>
              <t-button block size="large" style="margin-top: 12px" @click="vaiVerify">提 交</t-button>
            </div>
          </div>
        </div>
        <!---->
      </t-tab-panel>
    </t-tabs>
  </div>
  <t-dialog
    v-model:visible="pickUpCodeDetailDialogVisible"
    header="『取件码』内容"
    :cancel-btn="null"
    confirm-btn="关闭"
    width="40%"
    :on-close="
      () => {
        pickUpCodeDetailDialogVisible = false;
      }
    "
    :on-confirm="
      () => {
        pickUpCodeDetailDialogVisible = false;
      }
    "
  >
    <div>
      <div>『码』ID：{{ pickUpCodeDetail?.id }}</div>
      <div style="display: inline-flex; flex-direction: row; align-items: center; gap: 6px">
        <span>『码』值:</span>
        <NumberBox :value="pickUpCodeDetail?.value"></NumberBox>
      </div>
      <div>『码』类型：跳转页面</div>
      <div>『码』目标地址是否为本地路由：{{ islocalRoute(pickUpCodeDetail) ? '是' : '否' }}</div>
      <div>
        『码』目标地址：{{
          !islocalRoute(pickUpCodeDetail)
            ? decodeURI(pickUpCodeDetail?.extra)
            : JSON.parse(pickUpCodeDetail?.extra)?.path
        }}
      </div>
    </div>
  </t-dialog>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue';
import { getInternetAPI } from '@utils/index';
import useRequest from '@hooks/useRequest';
import { AssignmentCodeIcon } from 'tdesign-icons-vue-next';
import { NotifyPlugin } from 'tdesign-vue-next';
import NumberBox from '@components/numberBox.tsx';
import NumberInput from '@components/numberInput';

interface pickUpCodeListItem {
  id: number;
  value: string;
  extra: string;
  type: string;
}

const pickUpCodeList = ref([]);
const pickUpCodeDetail = ref<pickUpCodeListItem>();
const pickUpCodeDetailDialogVisible = ref(false);
const pickUpCodeRex = /(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/gi;
const pickUpCodeFormData = reactive({
  code: '',
  type: 'redirect',
  isRouter: false,
  extra: '',
});
const pickUpCodeURLInputStatus = reactive({
  status: 'default',
  value: '',
});

const showPickUpCodeDetail = (item: pickUpCodeListItem) => {
  pickUpCodeDetailDialogVisible.value = true;
  pickUpCodeDetail.value = item;
};

const islocalRoute = (str: pickUpCodeListItem) => {
  try {
    const obj = JSON.parse(str?.extra);
    const inval = ['isRouter', 'path'];
    inval.forEach((key) => {
      if (!obj[key]) {
        console.warn(`返回值[${key}]不是有效的本地路由数据`, str);
      }
      return false;
    });
    return true;
  } catch (e) {
    console.warn('返回值不是一个有效的JSON对象', str);
    return false;
  }
};

const isURL = (str: string) => {
  return pickUpCodeRex.test(str);
};

const vaiVerify = () => {
  if (!pickUpCodeFormData.code || !pickUpCodeFormData.extra || !pickUpCodeFormData.type) {
    NotifyPlugin.error({
      title: '请填写完整信息',
      content: '信息不完整',
    });
    return;
  }
  pickUpCodeURLInputStatus.status = 'default';
  pickUpCodeURLInputStatus.value = '';
  const value = pickUpCodeFormData.extra;
  if (pickUpCodeFormData.isRouter) {
    if (isURL(value)) {
      pickUpCodeURLInputStatus.status = 'error';
      pickUpCodeURLInputStatus.value = '应该为路由字符串';
      return;
    }
  } else if (!isURL(value)) {
    pickUpCodeURLInputStatus.status = 'error';
    pickUpCodeURLInputStatus.value = '链接地址不正确！';
    return;
  }
  AddPickUpCode();
};

const getPickupCodeList = () => {
  useRequest({
    url: `${getInternetAPI()}/netdisk/pick-up/getList`,
    useCustomURL: true,
    methods: 'GET',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '获取『取件码』列表失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      pickUpCodeList.value = json.data;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取『取件码』列表失败[Error]',
        content: err,
      });
    },
  });
};

const AddPickUpCode = () => {
  const { type, code, extra, isRouter } = pickUpCodeFormData;
  var linkTarget = extra;
  if (isRouter) {
    linkTarget = JSON.stringify({
      isRouter: true,
      path: extra,
    });
  }
  useRequest({
    url: `${getInternetAPI()}/netdisk/pick-up/add`,
    useCustomURL: true,
    methods: 'POST',
    data: {
      type,
      code,
      extra: linkTarget,
    },
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '新增『取件码』列表失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      NotifyPlugin.success({
        title: '新增『取件码』成功',
        content: `新增了ID为${json.data?.id}的『取件码』，『码』值: [${code}]`,
      });
      getPickupCodeList();
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '新增『取件码』列表失败[Error]',
        content: err,
      });
    },
  });
};

const DeletePickUpCode = (item: pickUpCodeListItem) => {
  const { id, value } = item;
  useRequest({
    url: `${getInternetAPI()}/netdisk/pick-up/delete`,
    useCustomURL: true,
    methods: 'POST',
    data: {
      id,
    },
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '删除『取件码』列表失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      NotifyPlugin.success({
        title: '删除『取件码』成功',
        content: `删除了ID为${json.data?.id}的『取件码』，『码』值: [${value}]`,
      });
      getPickupCodeList();
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '删除『取件码』列表失败[Error]',
        content: err,
      });
    },
  });
};

onMounted(() => {
  getPickupCodeList();
});
</script>

<script lang="tsx">
export default {
  name: 'ShareNetdiskManage',
};
</script>

<style lang="scss">
.pickUpCode-Title {
  font: var(--td-font-title-medium);
  padding: 8px;
  border-bottom: 1px solid var(--td-border-level-2-color);
}
.pickUpCode-Box {
  display: inline-flex;
  flex-direction: column;
  margin: 6px 0;
  padding: 16px;
  .pickUpCode-Box--item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    border-radius: 5px;
    transition: all 0.28s ease-in-out;
    gap: 6px;
    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }
  }
}

.pickUpCode-Form--item {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  > span {
    white-space: nowrap;
    &::after {
      content: ':';
    }
  }
}
</style>
