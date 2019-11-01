<template>
  <div class="headers">
    <div class="head_l">{{toChildMsg.title}}</div>
    <div class="head_r" v-show="show" @click="goLogin">登录</div>
    <div class="head_r" v-show="!show">
      <el-dropdown placement="bottom" @command="goBack" menu-align="start">
        <div class="el-dropdown-link">
          <img src="../assets/imgs/default.jpg" class="images" alt />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="home">首页</el-dropdown-item>
          <el-dropdown-item command="info">用户信息</el-dropdown-item>
          <el-dropdown-item command="reset">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    toChildMsg: Object
  },
  //注入依赖
  inject:['reload'],
  name:'activity',
  data() {
    return {
      show: true
    };
  },
  created() {
    console.log("参数", this.toChildMsg);
    if (sessionStorage.getItem("key")) {
      this.show = false;
    } else {
      this.show = true;
    }
  },
  methods: {
    goLogin() {
      this.$router.push("/login");
    },
    goBack(command) {
      console.log(123, command);
      if (command == "home") {
        this.$router.push({
          path: "/"
        });
      } else if (command == "info") {
        console.log("用户信息");
        this.$router.push({
          path: "/info"
        });
      } else {
        this.show = false;
        console.log("退出登录");
        window.sessionStorage.removeItem("key");
        this.reload()
        // 用户退出接口炸了
        // this.$request.post("/checklogin",{
        //   token:window.sessionStorage.getItem('key')
        // }).then(res => {
          
        //   console.log("退出返回", res);
        // });
      }
    }
  }
};
</script>
<style lang="less">
.el-dropdown {
  width: 40px;
  height: 40px;
}
</style>
<style lang="less" scoped>
.headers {
  width: 100%;
  height: 60px;
  background-color: #eff2f7;
  padding-left: 20px;
  display: flex;
  .head_l {
    flex: 1;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
  }
  .head_r {
    flex: 1;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    text-align: right;
    padding-right: 40px;
    position: relative;
    cursor: pointer;
    .el-dropdown-link {
      width: 40px;
      height: 40px;
      position: absolute;
      right: 20px;
      top: 10px;
      .images {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
  }
}
</style>