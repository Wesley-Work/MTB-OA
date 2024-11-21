<template>
  <main class="t-layout__content">
    <section class="t-layout tdesign-starter-layout">
      <!--v-if-->
      <main class="t-layout__content tdesign-starter-content-layout">
        <!--v-if-->
        <div class="result-container">
          <div class="result-bg-img">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="140"
              fill="none">
              <g mask="url(#mask0_16559_24251)">
                <path
                  fill="#97A3B7"
                  d="m68 48 38.105 22v44L68 136l-38.105-22V70L68 48Z"></path>
                <g filter="url(#a)">
                  <path fill="var(--td-errp-color)" d="M46.391 92h80v60h-80z"></path>
                </g>
                <g filter="url(#b)">
                  <path fill="var(--td-errp-color)" d="M0 23h80v60H0z"></path>
                </g>
              </g>
              <mask
                id="c"
                width="78"
                height="88"
                x="80"
                y="9"
                maskUnits="userSpaceOnUse"
                style="mask-type: alpha">
                <path
                  fill="currentcolor"
                  d="m119 9 38.105 22v44L119 97 80.895 75V31L119 9Z"></path>
              </mask>
              <g mask="url(#c)">
                <path
                  fill="currentcolor"
                  fill-rule="evenodd"
                  d="M80.895 31v44L119 97l38.105-22V31L119 53 80.895 31Z"
                  clip-rule="evenodd"></path>
                <path
                  fill="currentcolor"
                  d="m119-35 38.105 22v44.5L119 53.5l-38.105-22V-13L119-35Z"
                  opacity=".9"></path>
                <g filter="url(#d)" opacity=".3">
                  <path
                    fill="#97A3B7"
                    d="m68 48 38.105 22v44L68 136l-38.105-22V70L68 48Z"></path>
                </g>
              </g>
              <path
                fill="#fff"
                stroke="#000"
                d="m143 68.822 4.867 17.053.133.466.469-.118 17.202-4.312-12.335 12.741-.337.348.337.348 12.335 12.741-17.202-4.312-.469-.118-.133.466L143 121.178l-4.867-17.053-.133-.466-.469.118-17.202 4.312 12.335-12.741.337-.348-.337-.348-12.335-12.741 17.202 4.312.469.118.133-.466L143 68.822Z"></path>
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="m123.243 35.082 2.828-1.633-2.828-1.633-2.829 1.633 2.829 1.633ZM119 32.632 121.828 31l-7.071-4.082-2.828 1.633L119 32.633Zm8.485 3.267c-4.679 2.701-12.291 2.701-16.97 0-4.68-2.702-4.68-7.096 0-9.798 4.679-2.701 12.291-2.701 16.97 0 4.68 2.702 4.68 7.096 0 9.798Zm-19.799-11.43c-6.248 3.607-6.248 9.455 0 13.062 6.248 3.607 16.38 3.607 22.628 0 6.248-3.607 6.248-9.455 0-13.062-6.248-3.607-16.38-3.607-22.628 0ZM41.899 86.286l2.828 1.633v6.532L41.9 92.818v-6.532Zm12.02 6.94 2.829 1.634v6.532l-2.828-1.633v-6.532Zm-9.19 14.289-2.83-1.633.001 3.266 2.828 1.633v-3.266l9.192 5.307v3.266l2.828 1.633v-3.266l-2.828-1.633v-3.266l-9.192-5.307v3.266Z"
                clip-rule="evenodd"></path>

            </svg>
          </div>
          <div class="result-title">出错啦！</div>
          <div class="result-tip">加载页面失败：无效的参数</div>
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
  name: "ParameterError",
};
</script>

<style scoped src="@/assets/errpage.css"></style>
