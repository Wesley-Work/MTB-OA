import { createApp } from 'vue'
import './style.css'
import App from './pages/index.vue'
import route from './routes'

import TDesign from 'tdesign-vue-next'

//import ElementPlus from 'element-plus'

// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css';

import * as echarts from 'echarts'

const app = createApp(App)

// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts

app.use(TDesign).use(route).mount('#main')