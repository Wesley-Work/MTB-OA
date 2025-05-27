<template>
  <div
    style="padding-top: 64px; display: flex; flex-direction: row; justify-content: space-evenly"
    class="CHANGELOG--VIEW"
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <CHANGELOG></CHANGELOG>
    </div>
  </div>
</template>

<script setup lang="tsx">
import CHANGELOG from '@utils/renderChangelog';
defineProps({
  handleChangeComponent: Function,
});
</script>

<script lang="tsx">
export default {
  name: 'CHANGlOG',
};
</script>

<style lang="scss">
.CHANGELOG--VIEW {
  // div>span{
  //     font-size: 35px;
  //     color: var(--td-text-color-primary);
  //     padding-bottom: 16px;
  // }
  h3 {
    padding-top: 12px;
  }
  .blueline .t-timeline-item__tail {
    border-color: var(--td-brand-color) !important;
  }

  .greenline .t-timeline-item__tail {
    border-color: var(--td-success-color) !important;
  }

  .t-timeline-item__content > h2 .t-tag {
    padding: 2px 12px;
    border-radius: 3px;
    margin-left: 24px;
    font-size: 20px;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  }

  ul,
  dl,
  ol {
    margin: 0;
    padding: 0 0 0 1.2em;
    line-height: 22px;
  }

  ul ul {
    list-style-type: circle;
    margin-block-start: 0px;
    margin-block-end: 0px;
  }

  .t-timeline-item__content > ul {
    list-style-type: disc;
  }

  ul > li > .t-tag {
    color: var(--td-error-color-8) !important;
    margin: 0 2px !important;
    border-radius: 3px;
    padding: 2px 6px !important;
    font-size: 12px !important;
  }

  ul > li > .t-tag.tagblue {
    color: var(--td-brand-color-7) !important;
    margin: 0 2px !important;
    border-radius: 3px;
    padding: 2px 6px !important;
    font-size: 12px !important;
  }

  html[theme-mode='dark'] ul > li > .t-tag {
    color: var(--td-error-color-6) !important;
  }

  li ul > li {
    font-size: 14px;
    margin: 4px 0;
  }

  li > a {
    line-height: 24px;
    text-decoration: none;
    color: var(--td-text-color-link);
  }

  h2 {
    margin-top: 0px !important;
  }

  .t-timeline-item__dot .t-loading__gradient-conic {
    background: conic-gradient(
      from 90deg at 50% 50%,
      var(--td-text-color-disabled) 0deg,
      var(--td-text-color-primary) 360deg
    ) !important;
  }
}
</style>
