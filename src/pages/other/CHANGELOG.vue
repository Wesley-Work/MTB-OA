<template>
  <div
    style="padding-top: 64px; display: flex; flex-direction: row; justify-content: space-evenly"
    class="CHANGELOG--VIEW"
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <CHANGELOG></CHANGELOG>
      <!-- <t-timeline mode="same">
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 3.0.3
                    <t-tag theme="success" variant="light" style="background-color: rgba(2,156,212,.1);color: #029cd4;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">RC</t-tag>
                    <t-tag size="large">2024/05/08</t-tag>
                </h2>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Dashboard</t-tag>: 上线部分内容(基础信息、借出/归还数据) @Wesley
                    </li>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Theme-Toggle</t-tag>: 切换样式的动画 @Wesley
                    </li>
                </ul>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">EquipmentLend</t-tag>、<t-tag size="small" theme="danger" variant="light">EquipmentReturn</t-tag>: 修复借出/归还后未清空输入框内容 @Wesley
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 3.0.1
                    <t-tag theme="success" variant="light" style="background-color: rgba(2,156,212,.1);color: #029cd4;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">RC</t-tag>
                    <t-tag size="large">2024/04/22</t-tag>
                </h2>
                <h3 id="🐞-bug-fixes">🐞 Bug Fixes </h3>
                <ul>
                    <li>
                        <t-tag size="small" theme="danger" variant="light">API</t-tag>: 修复无法验证权限的Bug @Wesley
                    </li>
                </ul>
                <h3 id="❗-BREAKING-CHANGES">❗ BREAKING CHANGES</h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">Return</t-tag>: 取消帮还选项，无需输入借出人Code @Wesley
                    </li>
                </ul>
            </t-timeline-item>
            <t-timeline-item dot-color="primary" class="blueline">
                <h2>🌈 3.0.0
                    <t-tag theme="success" variant="light" style="background-color: rgba(2,156,212,.1);color: #029cd4;margin: 0px;font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;padding: 0px 8px;">RC</t-tag>
                    <t-tag size="large">2024/04/16</t-tag>
                </h2>
                <h3 id="💎-features">💎 Features </h3>
                <ul style="list-style-type: disc;">
                    <li>
                        <t-tag size="small" theme="danger" variant="light">...</t-tag>: 整体重构 @Wesley, @DDoS_LING
                    </li>
                </ul>
            </t-timeline-item>
        </t-timeline> -->
    </div>
  </div>
</template>

<script setup lang="tsx">
import CHANGELOG from '@hooks/useChangeLog';
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
