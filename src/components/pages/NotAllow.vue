<template>
  <main class="t-layout__content">
    <section class="t-layout tdesign-starter-layout">
      <!--v-if-->
      <main class="t-layout__content tdesign-starter-content-layout">
        <!--v-if-->
        <div class="result-container">
          <div class="result-bg-img">
            <svg
              data-v-1de511de=""
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="140"
              fill="none">
              <g mask="url(#mask0_17_619)">
                <path fill="#97A3B7" d="M30 62h88v60H30V62Z"></path>
                <g filter="url(#filter0_f_17_619)">
                  <path fill="var(--td-errp-color)" d="M12 84h80v60H12z"></path>
                </g>
                <g filter="url(#filter1_f_17_619)">
                  <path fill="var(--td-errp-color)" d="M80 54h80v60H80z"></path>
                </g>
                <path
                  fill="#fff"
                  d="M46 105h32v2H46zM46 98h32v2H46zM46 88h16v2H46z"></path>
              </g>
              <path
                fill="currentcolor"
                d="M63 20h88v10H63V20Z"
                opacity=".9"></path>
              <mask
                id="a"
                width="88"
                height="50"
                x="63"
                y="30"
                maskUnits="userSpaceOnUse"
                style="mask-type: alpha">
                <path fill="currentcolor" d="M63 30h88v50H63V30Z"></path>
              </mask>
              <g mask="url(#a)">
                <path fill="currentcolor" d="M63 30h88v50H63V30Z"></path>
                <g filter="url(#filter2_f_17_619)" opacity=".3">
                  <path fill="#97A3B7" d="M30 62h88v60H30V62Z"></path>
                </g>
              </g>
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="m95.686 40.858 10.278 10.277A4.03 4.03 0 0 1 107 51c2.213 0 4 1.786 4 4 0 .357-.047.704-.134 1.033l10.276 10.28-2.828 2.829-4.598-4.597A17.103 17.103 0 0 1 107 65.909c-7.273 0-13.484-4.524-16-10.91a17.29 17.29 0 0 1 5.696-7.472l-3.838-3.84 2.828-2.83ZM99 55a8.003 8.003 0 0 0 12.063 6.892l-3.029-3.026c-.33.087-.676.134-1.034.134-2.213 0-4-1.787-4-4 0-.358.047-.704.134-1.034l-3.027-3.027A7.96 7.96 0 0 0 99 54.999Zm8-10.91c7.273 0 13.484 4.524 16 10.91a17.273 17.273 0 0 1-4.166 6.177l-4.105-4.105a8.003 8.003 0 0 0-9.801-9.8l-2.55-2.551c1.47-.41 3.02-.63 4.622-.63Z"
                clip-rule="evenodd"></path>
              <path
                fill="#fff"
                d="M68 24h2v2h-2zM74 24h2v2h-2zM80 24h66v2H80z"></path>
              <path
                fill="#fff"
                stroke="#000"
                d="m157 54 24.249 42h-48.498L157 54Z"></path>
              <path stroke="#000" d="M157 89V71"></path>
            </svg>
          </div>
          <div class="result-title">出错啦！</div>
          <div class="result-tip">加载页面失败：无查看权限</div>
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
  name: "NotAllow",
};
</script>

<style scoped src="../../assets/errpage.css"></style>
