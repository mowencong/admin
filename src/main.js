import Vue from "vue";
import App from "./App.vue";
import request from "./request.js";
import axios from "axios";
import router from "./router.js";
import VConsole from 'vconsole/dist/vconsole.min.js' 
import "./assets/css/global.css";
import "./assets/css/main.less";

// import 'vant/lib/index.css';
// import { Button } from 'vant'
// Vue.use(Button)
import ElementUI from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
Vue.prototype.$request = request;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
var vConsole = new VConsole();
console.log('Hello world',vConsole);
import '@/rem.js'
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
