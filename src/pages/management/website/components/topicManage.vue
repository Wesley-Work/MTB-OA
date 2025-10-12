<template>
  <div class="headerManage">
    <div style="font: var(--td-font-body-medium); padding-left: 4px; margin-bottom: -6px">
      <span>
        <strong>PREVIEW</strong>
      </span>
    </div>
    <div class="headerPreview">
      <Topic :data="dataToDom(topicFormData)" />
    </div>
    <div class="htm">
      <div class="headerTree-Manage">
        <!---->
        <div style="font: var(--td-font-title-large); padding: 16px 12px">内容管理</div>
        <!---->
        <div class="NodeManage">
          <div>
            <t-form ref="form" :rules="topicFormRules" :data="topicFormData" :colon="true">
              <div class="NodeManage-view">
                <div>
                  <t-form-item label="类型" name="type">
                    <t-select
                      v-model:value="topicFormData.type"
                      default-value="_self"
                      :options="topicTypeOptions"
                      placeholder="请选择"
                    ></t-select>
                  </t-form-item>
                  <t-form-item label="内容" name="text">
                    <t-input v-model:value="topicFormData.text"></t-input>
                  </t-form-item>
                  <t-form-item label="后缀带链接" name="hasLink">
                    <t-switch v-model:value="topicFormData.hasLink" />
                  </t-form-item>
                  <template v-if="topicFormData.hasLink">
                    <t-form-item label="链接文字" name="linkText">
                      <t-input v-model:value="topicFormData.linkText"></t-input>
                    </t-form-item>
                    <t-form-item label="链接后内容" name="suffixText">
                      <t-input v-model:value="topicFormData.suffixText"></t-input>
                    </t-form-item>
                    <t-form-item label="链接地址" name="link">
                      <t-input v-model:value="topicFormData.link"></t-input>
                    </t-form-item>
                  </template>
                </div>
              </div>
            </t-form>
            <!---->
          </div>
          <!---->
          <div style="font: var(--td-font-title-large); padding: 16px 12px">推送管理</div>
          <t-space direction="vertical" style="width: 100%" size="small">
            <t-button block theme="danger" size="large" @click="cleanTopic"> 清空 </t-button>
            <t-button block theme="primary" size="large" @click="submitTopic"> 推送 </t-button>
          </t-space>
          <!---->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from 'vue';
import useRequest from '@hooks/useRequest';
import { NotifyPlugin } from 'tdesign-vue-next';
import { getInternetAPI } from '@utils/index';
import Topic from './topic.tsx';

interface TopicDataRes {
  id: number;
  data: string;
  type: 'static' | 'dynamic';
}

interface TopicData {
  id: null | number;
  text: string;
  suffixText: string;
  hasLink: boolean;
  link: string;
  linkText: string;
  type: 'static' | 'dynamic';
}

const topicTypeOptions = [
  { label: '静态内容', value: 'static' },
  { label: '动态内容（开发中）', value: 'dynamic' },
];
const topicFormRules = {};
const topicFormData = ref<TopicData>({
  id: null,
  text: '',
  suffixText: '',
  hasLink: false,
  link: '',
  linkText: '',
  type: 'static',
});

const cleanTopic = () => {
  useRequest({
    url: `${getInternetAPI()}/setTopic/clear`,
    useCustomURL: true,
    methods: 'POST',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '设置Topic内容失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      NotifyPlugin.success({
        title: '设置Topic内容成功[Main]',
        content: `清空`,
      });
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '设置Topic内容失败[Error]',
        content: err,
      });
    },
    complete: function () {
      getTopicList();
    },
  });
};

const submitTopic = () => {
  const { data, type } = dataToDom(topicFormData.value);

  useRequest({
    url: `${getInternetAPI()}/setTopic/coverAdd`,
    useCustomURL: true,
    methods: 'POST',
    data: {
      data,
      type,
    },
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '设置Topic内容失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      NotifyPlugin.success({
        title: '设置Topic内容成功[Main]',
        content: `覆盖添加`,
      });
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '设置Topic内容失败[Error]',
        content: err,
      });
    },
    complete: function () {
      getTopicList();
    },
  });
};

const domToData = (res: TopicDataRes) => {
  const { id, type, data } = res;
  // 解析内容
  const dom = new DOMParser().parseFromString(data, 'text/html');
  const a = dom.getElementsByTagName('a');

  let hasLink = false;
  let link = '';
  let linkText = '';
  const nodes = [];

  if (a.length > 0) {
    hasLink = true;

    link = a?.[0].href;
    linkText = a?.[0].textContent;
  }

  if (data) {
    dom.body.childNodes.forEach((node) => {
      if (node.nodeName !== 'A') {
        nodes.push(node.nodeValue);
      }
    });
  }

  return {
    id,
    type: type || 'static',
    text: nodes[0] || '',
    suffixText: nodes[1] || '',
    hasLink,
    link,
    linkText,
  };
};

const dataToDom = (data: TopicData) => {
  const { text, suffixText, hasLink, link, linkText, type } = data;
  const str = `${text}${hasLink ? `<a href="${link}">${linkText}</a>` : ''}${suffixText}`;
  return {
    data: str,
    type,
  };
};

const getTopicList = () => {
  useRequest({
    url: `${getInternetAPI()}/getTopic`,
    useCustomURL: true,
    methods: 'GET',
    success: function (res) {
      const json = JSON.parse(res);
      if (json.errcode !== 0) {
        NotifyPlugin.error({
          title: '获取Topic内容失败[Main]',
          content: `因为：${json.errmsg}`,
        });
        return;
      }
      const { data } = json;
      const itemData = domToData(data);
      topicFormData.value = itemData;
    },
    error: function (err) {
      console.error(err);
      NotifyPlugin.error({
        title: '获取Topic内容失败[Error]',
        content: err,
      });
    },
  });
};

onMounted(() => {
  getTopicList();
});
</script>

<script lang="tsx">
export default {
  name: 'HeaderManage',
};
</script>

<style lang="less" scoped>
.headerManage {
  margin: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: var(--td-bg-color-component);
  .headerPreview {
    width: 100%;
    height: 32px;
    iframe {
      width: 100%;
      height: 305px;
      border: none;
    }
  }
  .htm {
    display: flex;
    flex-direction: row;
    gap: 6px;
    .headerTree-Manage {
      width: 100%;
      padding: 12px;
      background-color: var(--td-bg-color-container);
      .rootNode-ManageButtonGroup {
        display: flex;
        flex-direction: row;
        gap: 12px;
      }
      .NodeManage {
        .headerTree-unChoose {
          font: var(--td-font-title-medium);
          color: var(--td-text-color-secondary);
          text-align: center;
          line-height: 180px;
          letter-spacing: 0.5px;
          background-color: var(--td-bg-color-container-hover);
        }
        .NodeManage-view {
          display: flex;
          flex-direction: row;
          gap: 12px;
          > div {
            width: 50%;
          }
        }
      }
    }
  }
}
</style>
