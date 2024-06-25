import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import axios from 'axios'
import * as echarts from 'echarts';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(echarts);
Vue.use(ElementUI);
Vue.prototype.$axios=axios;
Vue.prototype.$echarts=echarts;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
