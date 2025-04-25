<template>
  <div
    style="display: flex; flex-direction: column; align-items: center; width: 890px; text-align: center; margin: 0 auto"
  >
    <div>
      <div style="font: var(--td-font-headline-medium)">data.title</div>
      <div style="font: var(--td-font-body-small); font-size: 16px; padding-top: 8px">data.sender</div>
    </div>
    <div style="padding: 56px 0px; font: var(--td-font-body-large)">
      <div>data.body</div>
    </div>
    <div style="width: 560px">
      <t-button size="large" block>前往处理</t-button>
      <!-- <t-button size="large">我已知晓</t-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageDetails',
};
</script>

<style></style>
