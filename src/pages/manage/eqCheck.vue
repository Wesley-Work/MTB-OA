<template>
  <div
    id="LendComponent"
    ref="MainBox"
    class="MainBox"
    style="background: var(--td-bg-color-container); padding: 32px; border-radius: 5px"
  >
    >
    <div class="MainBox-Operate">
      <div id="lendpage">
        <div style="display: flex; flex-direction: row; justify-content: space-between">
          <!--info-->
          <div style="min-width: 44%">
            <div>
              <t-button
                style="width: 100%; height: 56px; font: var(--td-font-title-large)"
                :disabled="formData.start"
                @click="start"
                >开始清点</t-button
              >
            </div>
            <!---->
            <div style="margin-top: 13px">
              <div style="display: flex; align-items: center">
                <span class="bitian">*</span>
                <span style="color: var(--td-text-color-primary); font: var(--td-font-body-medium)">设备Code: </span>
                <t-input
                  ref="lendinput"
                  v-model="formData.eqcode"
                  style="width: 181px; margin-left: 10px"
                  class="lendinput"
                  placeholder="请扫描或输入"
                  :on-enter="newlend"
                  :autofocus="true"
                  @Input="requesteqinfo(lendeqcodevalue)"
                ></t-input>
                <t-button class="lendbutton" style="margin-left: -10px; z-index: 2" @click.end="newlend">归还</t-button>
              </div>
            </div>
          </div>
          <!--list-->
          <div style="max-width: 54%">
            <t-card id="weTag">
              <template #title>
                <span>剩余设备列表</span>
              </template>
              <div style="display: flex; flex-direction: row; align-items: center">
                <t-table :data="TableData" :columns="TableColumns"></t-table>
              </div>
            </t-card>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="loading__" :class="{ show: loading, hidden: !loading }">
    <div class="text__" :class="{ hidden: textchange, show: !textchange }">
      {{ textlist[nowtext] }}
    </div>
  </div>
</template>

<script>
import { NotifyPlugin } from 'tdesign-vue-next';
import { config } from '../../config';
import useRequest from '../../hooks/useRequest';

function sleep(d) {
  for (var t = Date.now(); Date.now() - t <= d; );
}

export default {
  name: 'EqCheck',
  data() {
    return {
      formData: {
        eqcode: '',
        start: false,
      },
      loading: false,
      TableData: [
        {
          eqname: '一个设备设备设备设备设备设备',
          eqcode: '09098',
          //
          user: '文俊亮',
          lendtime: '2023-07-11 22:55:34',
          dothisthinguser: '文俊亮',
          more: 'ok',
        },
      ],
      TableColumns: [
        { colKey: 'eqname', title: '设备名称', width: '200' },
        { colKey: 'eqcode', title: '设备Code', width: '150' },
        { colKey: 'user', title: '归还人', width: '90', align: 'center' },
        { colKey: 'dothisthinguser', title: '操作人', width: '90', align: 'center' },
        { colKey: 'lendtime', title: '归还时间', ellipsis: true },
        { colKey: 'more', title: '备注', width: '170' },
      ],
      textlist: [
        '请稍等，正在执行清点设备程序',
        '请不要关闭浏览器',
        '很快就好',
        '去看看窗外的风景吧',
        '稍安勿躁',
        '海内存知己，天涯若比邻',
      ],
      textchange: false,
      nowtext: 0,
      timer: null,
      Operation_id: null,
      getStatusTimer: null,
    };
  },

  mounted() {},

  methods: {
    start() {
      var that = this;
      setTimeout(() => {
        this.$data.formData.start = true;
        this.$data.loading = true;
        this.$data.timer = setInterval(() => {
          setTimeout(() => this.s1(), 2500);
          setTimeout(() => this.s2(), 5000);
        }, 7500);
      }, 280);

      var TOKEN = localStorage.getItem('token');
      try {
        useRequest({
          url: config.API_URL.MAIN_URL + '/eqcheck/start',
          methods: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            token: TOKEN,
          },
          success: function (res) {
            var RES = JSON.parse(res);
            console.log(RES);
            if (RES.errcode == 0) {
              // pass
              that.$data.Operation_id = RES.data.operation_sha;
              that.$data.getStatusTimer = setInterval(() => {
                that.getStatus();
              }, 1000);
            } else {
              // Unknown
              NotifyPlugin('error', {
                title: '执行失败',
                content: `未知错误，错误码${RES.errcode}，${RES.errmsg}`,
              });
            }
          },
          error: function (err) {
            console.error(err);
            NotifyPlugin('error', {
              title: '借出设备失败！',
              content: err,
              duration: 5000,
            });
          },
        });
      } catch (e) {
        console.log(e);
      }
    },

    getStatus() {
      var that = this;
      var TOKEN = localStorage.getItem('token');
      try {
        HTTPRequest({
          url: config.API_URL.MAIN_URL + '/eqcheck/status',
          methods: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            token: TOKEN,
          },
          success: function (res) {
            var RES = JSON.parse(res);
            if (RES.errcode == 0) {
              console.log(RES, RES.data.progress);
              if (RES.data.progressing == false) {
                that.$data.loading = false;
                clearInterval(that.$data.getStatusTimer);
                clearInterval(that.$data.timer);
              }
            }
          },
          error: function (err) {
            console.error(err);
            NotifyPlugin('error', {
              title: '获取状态失败！',
              content: err,
              duration: 5000,
            });
          },
        });
      } catch (e) {
        console.log(e);
      }
    },

    s1() {
      var that = this;
      that.$data.textchange = true;
    },
    s2() {
      var that = this;
      var b = that.$data.textlist.length;
      var c = Math.floor(Math.random() * b);
      var d = c == that.$data.nowtext ? Math.floor(Math.random() * b) : c;
      var e = d == that.$data.nowtext ? Math.floor(Math.random() * b) : d;
      var f = e == that.$data.nowtext ? Math.floor(Math.random() * b) : e;
      that.$data.nowtext = f;
      that.$data.textchange = false;
    },
  },
};
</script>

<style>
.loading__ {
  background-color: #003cab;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  opacity: 0;
  transition: all 0.28s var(--transition-default);
  color: #fff;
  font: var(--td-font-display-large);
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 9px;
  user-select: none;
}

.loading__.show {
  opacity: 1;
}

.loading__.hidden {
  pointer-events: none;
}

.text__ {
  transition: all 1s var(--transition-default);
}

.text__.show {
  opacity: 1;
}

.text__.hidden {
  opacity: 0;
}
</style>
