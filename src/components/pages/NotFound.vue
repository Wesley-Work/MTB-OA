<template>
  <main class="t-layout__content">
    <section class="t-layout tdesign-starter-layout">
      <!--v-if-->
      <main class="t-layout__content tdesign-starter-content-layout">
        <!--v-if-->
        <div class="result-container">
          <div class="result-bg-img">
            <svg data-v-1de511de="" xmlns="http://www.w3.org/2000/svg" width="200" height="140" fill="none">
              <g mask="url(#mask0_16559_24301)">
                <path fill="#97A3B7" d="M30 62h88v60H30V62Z"></path>
                <g filter="url(#filter0_f_16559_24301)">
                  <path fill="var(--td-errp-color)" d="M12 84h80v60H12z"></path>
                </g>
                <g filter="url(#filter1_f_16559_24301)">
                  <path fill="var(--td-errp-color)" d="M80 54h80v60H80z"></path>
                </g>
                <path
                  stroke="#fff"
                  stroke-width="2"
                  d="m49 93-7 7 7 7M69 107l7-7-7-7M62.365 87.443l-6.73 25.114"
                ></path>
              </g>
              <path fill="currentcolor" d="M63 20h88v10H63V20Z" opacity=".9"></path>
              <mask id="a" width="88" height="50" x="63" y="30" maskUnits="userSpaceOnUse" style="mask-type: alpha">
                <path fill="currentcolor" d="M63 30h88v50H63V30Z"></path>
              </mask>
              <g mask="url(#a)">
                <path fill="currentcolor" d="M63 30h88v50H63V30Z"></path>
                <g filter="url(#filter2_f_16559_24301)" opacity=".3">
                  <path fill="#97A3B7" d="M30 62h88v60H30V62Z"></path>
                </g>
              </g>
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="M105.25 41c6.765 0 12.25 5.484 12.25 12.25 0 2.433-.709 4.7-1.932 6.606L121 65.288 117.288 69l-5.432-5.432a12.193 12.193 0 0 1-6.606 1.932C98.484 65.5 93 60.016 93 53.25S98.484 41 105.25 41Zm0 3.5a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 0 0 0-17.5Z"
                clip-rule="evenodd"
              ></path>
              <path fill="#fff" d="M68 24h2v2h-2zM74 24h2v2h-2zM80 24h66v2H80z"></path>
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="M153 56c-12.15 0-22 9.85-22 22 0 4.604 1.414 8.878 3.832 12.41L127 98.5l12.495-3.132A21.902 21.902 0 0 0 153 100c12.15 0 22-9.85 22-22s-9.85-22-22-22Z"
                clip-rule="evenodd"
              ></path>
              <path
                fill="#000"
                d="M131 78h.5-.5Zm3.832 12.41.359.348.284-.293-.23-.337-.413.282ZM127 98.5l-.359-.348-1.219 1.259 1.7-.426L127 98.5Zm12.495-3.132.307-.394-.192-.15-.237.06.122.484ZM153 100v.5-.5Zm22-22h-.5.5Zm-43.5 0c0-11.874 9.626-21.5 21.5-21.5v-1c-12.426 0-22.5 10.074-22.5 22.5h1Zm3.745 12.128A21.395 21.395 0 0 1 131.5 78h-1c0 4.708 1.446 9.08 3.919 12.693l.826-.565Zm-.772-.066-7.832 8.09.718.696 7.832-8.09-.718-.696Zm-7.351 8.923 12.494-3.132-.243-.97-12.495 3.132.244.97ZM153 99.5c-4.976 0-9.555-1.69-13.198-4.526l-.615.789A22.407 22.407 0 0 0 153 100.5v-1ZM174.5 78c0 11.874-9.626 21.5-21.5 21.5v1c12.426 0 22.5-10.074 22.5-22.5h-1ZM153 56.5c11.874 0 21.5 9.626 21.5 21.5h1c0-12.426-10.074-22.5-22.5-22.5v1Z"
              ></path>
            </svg>
          </div>
          <div class="result-title">404 Not Found</div>
          <div class="result-tip" style="margin-bottom: 0px">抱歉，您访问的页面不存在</div>
          <div class="result-tip" style="margin-top: 16px; margin-bottom: 0px">
            如果您是访客，请等待运维人员修复该问题。
          </div>
          <div class="result-tip" style="margin-top: 0px">如果您是运维人员，请检查相关文件配置及是否引入页面。</div>
        </div>
        <div><!--v-if--><!--v-if--></div>
      </main>
      <footer class="t-layout__footer tdesign-starter-footer-layout" style="display: none">
        <div class="tdesign-starter-footer">Copyright © 2021-2024 SDZZ-MTB. All Rights Reserved.</div>
      </footer>
    </section>
  </main>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped src="../../assets/errpage.css"></style>
