<template>
    <main class="t-layout__content">
      <section class="t-layout tdesign-starter-layout">
        <!--v-if-->
        <main class="t-layout__content tdesign-starter-content-layout">
          <!--v-if-->
          <div class="result-container">
            <div class="result-bg-img" style="height: 64px;width: 64px;">
              <t-icon name="error-circle" style="height: 64px;width: 64px;color: var(--pagesmall);"></t-icon>
            </div>
            <div class="result-title">显示区域过小！</div>
            <div class="result-tip" style="text-align: center;">抱歉，您的显示区域过小！<br/>为了您更好的体验，请您尝试更改窗口大小或更换终端设备。</div>
          </div>
          <div><!--v-if--><!--v-if--></div>
        </main>
        <footer class="t-layout__footer tdesign-starter-footer-layout" style="display: none;">
          <div class="tdesign-starter-footer">
            Copyright © 2021-2024 SDZZ-MTB. All Rights Reserved.
          </div>
        </footer>
      </section>
    </main>
  </template>
  
  <script>
  export default {
    name: "NotFound",
  };
  </script>
  
  <style scoped src="../../assets/errpage.css"></style>
  