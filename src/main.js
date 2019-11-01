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
// import {
//   Button,
//   Input,
//   Dialog,
//   Menu,
//   Submenu,
//   MenuItem,
//   Icon,
//   Row,
//   Col,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   MenuItemGroup,
//   Form,
//   FormItem,
//   Select,
//   Option,
//   Table,
//   TableColumn,
// } from "element-ui";
// Vue.use(Button);
// Vue.use(Input);
// Vue.use(Dialog);
// Vue.use(Menu);
// Vue.use(Submenu);
// Vue.use(MenuItem);
// Vue.use(Icon);
// Vue.use(Row);
// Vue.use(Col);
// Vue.use(Dropdown);
// Vue.use(DropdownMenu);
// Vue.use(DropdownItem);
// Vue.use(MenuItemGroup);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Select);
// Vue.use(Option);
// Vue.use(Table);
// Vue.use(TableColumn)
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
