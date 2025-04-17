<template>
  <div
    style="display: flex; flex-direction: column; align-items: center; width: 890px; text-align: center; margin: 0 auto"
  >
    <div>
      <div style="font: var(--td-font-headline-medium)">{{ data.title }}</div>
      <div style="font: var(--td-font-body-small); font-size: 16px; padding-top: 8px">{{ data.sender }}</div>
    </div>
    <div style="padding: 56px 0px; font: var(--td-font-body-large)">
      <div>{{ data.body }}</div>
    </div>
    <div style="width: 560px">
      <t-button size="large" block>前往处理</t-button>
      <!-- <t-button size="large">我已知晓</t-button> -->
    </div>
  </div>
</template>

<script>
import * as api from '../../components/config/api.js';
import * as config from '../../components/config'; // for testing, replace with "./config.js" for production server. 描述自身数据库信息以";
export default {
  name: 'MessageDetails',
  data() {
    return {
      data: {
        id: 1,
        title: '消息标题阿斯达四方',
        sender: '发丝',
        body: '消息正文暗杀时代i傻傻的发丝哈上帝哈斯但还是ia打死的哈上帝哈佛还杀是否爱仕达防火阀i傅海峰哈桑覅未通过i我给他死哦发啊收容覅u和文化i哦呜俄国回复',
        date: '2021-07-16 10:10:10',
        status: false,
      },
    };
  },
  mounted() {
    this.$emit('mounted');
    var mid = this.getUrlParam('mid');
    mid != false ? console.info('【消息详情】：收到id为' + mid + '的消息') : console.info('【消息详情】：消息id错误');
  },

  methods: {
    /**
     * @getUrlParam
     * @desc 获取参数
     * @param id 参数名
     */
    getUrlParam(variable, url = window.location.search.substring(1)) {
      var vars = url.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
  },
};
</script>

<style></style>
