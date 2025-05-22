<template>
  <div>
    <t-tabs :default-value="1">
      <t-tab-panel :value="1">
        <template #label>
          <MenuIcon style="margin-right: 4px" />
          <span>Header 顶部内容管理</span>
        </template>
        <HeaderManage />
      </t-tab-panel>
      <t-tab-panel :value="2">
        <template #label>
          <FormIcon style="margin-right: 4px" />
          <span>Banner 中部内容管理</span>
        </template>
        <BannerManage />
      </t-tab-panel>
      <!-- <t-tab-panel :value="3">
        <template #label>
          <PageHeadIcon style="margin-right: 4px" />
          <span>Footer 底部内容管理</span>
        </template>
        <p style="margin: 20px">选项卡3内容区</p>
      </t-tab-panel> -->
    </t-tabs>
  </div>
</template>

<script setup lang="tsx">
import { MenuIcon, FormIcon } from 'tdesign-icons-vue-next';
import HeaderManage from './components/headerManage.vue';
import BannerManage from './components/bannerManage.vue';

defineProps({
  handleChangeComponent: Function,
});
</script>

<script lang="tsx">
export default {
  name: 'OfficialWebManage',
};
</script>

<style lang="scss"></style>
