import axios from "axios";
import { Message } from 'element-ui'
// 添加post请求默认头部
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
axios.defaults.headers.post["Authorization"] = 'Bearer'+' '+ window.sessionStorage.getItem("key")
// 超时时间
axios.defaults.timeout = 10000;

// 自定义拦截器
// axios.interceptors.request.use(
//   config => {
//     // const request = JSON.stringify(config);
//     // requestList.includes(request)
//     //   ? console.log("取消重复请求")
//     //   : requestList.push(request);

//     // 判断登录状态
//     const sessionid = window.sessionStorage.getItem("key");
//     if (sessionid) {
//       console.log('token',sessionid)
//       config.headers["X-AUTH-TOKEN"] = sessionid;
//     } else {
//       Message.error('认证失败，请重新登录')
//       console.log("sesstion不存在，需要做什么操作",window.sessionStorage.getItem("key"));
//     }
//     return config;
//   },
//   function(error) {
//     return Promise.reject(error);
//   }
// );

axios.interceptors.response.use(
  function(response) {
    if (response.data.code === 401) {
      console.log("确认this指向", this);
			router.replace({
				path:'/login'
			})
    }
    return response;
  },
  function(error) {
    if (axios.isCancel(error)) {
      throw new axios.Cancel("cancel request");
    } else {
      console.log("网络请求失败！");
    }
    return Promise.reject(error);
  }
);
// 路径处理函数
let filterUrl = _url => {
  console.log("判断环境", process.env.NODE_ENV);
  let baseUrl;
  if (process.env.NODE_ENV === "development") {
    //本地环境
    baseUrl = "";
  } else {
    //生产环境
    baseUrl = "";
  }
  if (_url && _url.startsWith("http")) {
    console.log('进来了这个判断条件吗http')
    return _url;
  }
  return baseUrl + _url;
};

export default {
  get(_url, _params = {}) {
    // var header = {
    //   "Content-Type": "application/json;charset=UTF-8",
    // };
    console.log("网址", filterUrl(_url));
    return new Promise((resolve, reject) => {
      axios({
        credentials: 'include',
        url: filterUrl(_url),
        method: "get",
        data: _params,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: "cors",
        cache: "force-cache"
      })
        .then(res => {
          console.log('数据',res.data)
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  post(_url, _params = {}) {
    var header;
    if (JSON.stringify(_params) == "{}") {
      header = {
        "Content-Type": "application/json;charset=UTF-8",
      };
    } else {
      header = {
        "Content-Type": "application/json;charset=UTF-8",
      };
    }
    return new Promise((resolve, reject) => {
      axios({
        credentials: false,
        url: filterUrl(_url),
        method: "post",
        data: _params,
        headers: header
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
