import { createApp } from 'vue'
import App from './index.vue'

import TDesign from 'tdesign-vue-next'

//import ElementPlus from 'element-plus'

// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css';

import * as echarts from 'echarts'

const app = createApp(App)

// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts

app.use(TDesign).mount('#main')