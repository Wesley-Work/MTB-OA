<template>
  <main class="t-layout__content">
    <section class="t-layout tdesign-starter-layout">
      <!--v-if-->
      <main class="t-layout__content tdesign-starter-content-layout">
        <!--v-if-->
        <div class="result-container">
          <div class="result-bg-img">
            <svg data-v-1de511de="" xmlns="http://www.w3.org/2000/svg" width="200" height="140" fill="none">
              <g mask="url(#mask0_17_619)">
                <path fill="#97A3B7" d="M30 62h88v60H30V62Z"></path>
                <g filter="url(#filter0_f_17_619)">
                  <path fill="var(--td-errp-color)" d="M12 84h80v60H12z"></path>
                </g>
                <g filter="url(#filter1_f_17_619)">
                  <path fill="var(--td-errp-color)" d="M80 54h80v60H80z"></path>
                </g>
                <path fill="#fff" d="M46 105h32v2H46zM46 98h32v2H46zM46 88h16v2H46z"></path>
              </g>
              <path fill="currentcolor" d="M63 20h88v10H63V20Z" opacity=".9"></path>
              <mask id="a" width="88" height="50" x="63" y="30" maskUnits="userSpaceOnUse" style="mask-type: alpha">
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
                clip-rule="evenodd"
              ></path>
              <path fill="#fff" d="M68 24h2v2h-2zM74 24h2v2h-2zM80 24h66v2H80z"></path>
              <path fill="#fff" stroke="#000" d="m157 54 24.249 42h-48.498L157 54Z"></path>
              <path stroke="#000" d="M157 89V71"></path>
            </svg>
          </div>
          <div class="result-title">抱歉！目前无法使用该功能</div>
          <div class="result-tip">
            <div>该页面功能仅供内网环境使用！</div>
            <div style="display: flex; flex-direction: row; align-items: center; transform: translateX(-20px)">
              <span class="sign-icon"></span>
              <div>请确认您当前的网络环境，如您确认在内网环境，请与管理人员联系。</div>
            </div>
          </div>
        </div>
        <div></div>
      </main>
      <footer class="t-layout__footer tdesign-starter-footer-layout" style="display: none">
        <div class="tdesign-starter-footer">Copyright © 2021-2024 SDZZ-MTB. All Rights Reserved.</div>
      </footer>
    </section>
  </main>
</template>

<script>
export default {
  name: 'OnlyInternet',
};
</script>

<style scoped src="../../assets/errpage.css"></style>
<style lang="scss">
.sign-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAAXNSR0IArs4c6QAABXZJREFUaEPtWltrXFUU/tbeaWK8IUZEai1Kk0nVeHloEW3pTH0RpQkkk0n7IOofUF9En2ya+qT4ov4BFR/aJpNAUhRf7KTYqjQPSms1kxSlxiJipBQ1Js3eS/Y5+yQzk7mcW2o89sDAwNl7nfXt9a29vn0hJPyhhOPDdYDxRpjtgBLHa7e2tfWJ4CALTBYE0hmNIdJ1wQRpG2JU4gWYY+n4MEyqzJfMiSa0bpFousl9v/ynwsKcQmHvclm7Wv1DAPO6xACQCTmIMlC5C1ul1o8w9A5ifpBJbAPzHSDc7HyY8QeIfiPWF5joW4KYUkJ8g+FtF1ewGLDD0EA0OkcDaOh1HuSAy7Fs0bPPLGv9LBOeALAl4MDPEeN0kxAfLYr2jz2beADckOZ1PhQeoAFn8it3rlmqlh6QfpUZO534wJmdTe6Zn/kvavhg3pv25r35OX2JcAYs3lJycRzDXUvwvhVwxEzzcAAd+pBCb/F+KfA2Mz8FwOSXcdADZWz7tW/6eT8D1PRTRPSp0ngFY6nvDEPW5LYPwH4dsKaYMAgykZP908+xxjsAbjPTRkkUfHy2YRMv+k0ALpPAy2qk80M3kmYg/OdlAICrNUz0FQ8D/HpJxLxRb+h5gAYeG6xtekOPpg4CwWqpf4A2D0T/9LvQeLGCigH8Dtx0lboC7+mRzpeC5KQ/gJb/ond6CISDJj8sJf31D4xpTQcvmhKMw3qsc9BvTjZ20IKT2ennmfF+yMh5USj1PMgk5FZPO+MS4QWV7/zAD8j6AC0tm3tnu5ZJTQK4vaQMRI9LcAteCfq9iWV6aaz9XCO61gFoktmdrWS2OM7M3ZaartwK9iwC+KWiy10AWoKZcVqb9JBENKHyqR63/6qvlfZqA1yh5swAsz4aEpyZ7gWRmNok1ACUdoW3FOKqlseY9Q5L+VpCoBZ+C1LsV/mOY/WoWp+iOZZSF08x47GQjrgAQZ+rhzrSK5JrkIU8OzPJ4N2R7BK+UiK1q54AqA7Q5p7MznQz6/EIeWcjiNNq/lIahYy7ysgUpGzbPMnsaFanTQiqWlknelS+Y6JWLlYH6NGzb+YIQ+8PSU/js0fRU6qrfU9ZBM/NnmTWuyIAdGkKcVSNdhyoRdO1AG30bjjww71LS4uTAG2N4MR6ArSR54vNzS3pv4/c92O1KK4FaBanhb3Lsr+4jzVPRIjeekdwdUYV1K1GUsdhfa8stuX09yRZ3/QggENWSBvRG+ZZzwgaf4zIN74d0qOdQ/4iaGHI7PcjzJSNQM9rEUE7gJxX+e391SJQfZLJnGgSbXefAfOj/wWAIPpaz/+8c80eT80F6dMzLaJVz9ptB08ebUSKer7N6QXRjk86jGIqeyoiaCVP7qdWof+6BHYWsxsfIOGyFjduxvA9C5Wy7f8G0EY3dooaJZNKo+AIZSADKduKUZWMo7JtmvmlqAUY3yTjGmS6QoLOliYHMz8M8C1hErukj1vsA08yzhIpljIR0f+G3UOUiXgLveehoVL5Nr1boBvvKNTHGKLQxyvVGoYgYgNXcIeRajGJbTsJ0K9gHAexe2zGRCDsA/jOCGUopNg2DsS+XKKTKt+RWd2wZZLZmQIz74mglEIulwzAuBe8oC/UrZueRPO8WyaW2qS8cvUzBj8eAWCEBa+XGBt/y+JLJVK7g29ZlNI0u4E3nZgH1Nj24ZCbTknfNizJxYRu/NpETPTWfclkYxI5mYcvHshEH59Z+eFiJU7mAagHMrlH2CWyOLmXEEpArr1G8hozzGlRHNdIpsDizX/vGknpxJPYi0ArwUzyVa7K1WoyL+NVWZMHuSIZpG2I5X/UPZGAnwx2iSeg8arNrzHAOFwOZuM6wGDjtfFa/wMO/wB1/VdXGAAAAABJRU5ErkJggg==')
    no-repeat;
  background-size: 100%;
}
</style>
