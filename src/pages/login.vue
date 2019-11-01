<template>
  <div class="login">
    <h2>少爷服装店后台管理系统</h2>
    <div class="content">
      <div class="user">
        <el-input v-model="username" placeholder="用户名"></el-input>
      </div>
      <div class="psd">
        <el-input v-model="password" type="password" placeholder="密码"></el-input>
      </div>
      <div class="btn">
        <el-button type="primary" size="medium" class="btn_login" @click="goLogin">登录</el-button>
      </div>
      <div class="remarks">
        <div>温馨提示：</div>
        <div>未登录过的新用户，自动注册</div>
        <div>注册过的用户可凭账号密码登录</div>
      </div>
    </div>
    <div>
      <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>{{info}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      info: "",
      dialogVisible: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    goLogin() {
      console.log("登录", this.username,this.password);
      if (!this.username || !this.password) {
        this.dialogVisible = true;
        this.info = "用户名和密码不能为空";
      } else {
        this.$request
          .post("/login", {username: this.username, password: this.password})
          .then(res => {
            console.log("登陆返回", res);
            if(res.code==1){
              window.sessionStorage.setItem('key',res.token);
              this.$router.push({
                path: "/"
              });
            }else{
              this.dialogVisible = true;
              this.info = res.message;
              this.username = "";
              this.password = "";
            }
          });
      }
    },
    handleClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  position: relative;
  background-color: #324057;
  width: 100%;
  height: 100%;
  h2 {
    padding-top: 40px;
    color: #fff;
    text-align: center;
  }
  .content {
    width: 370px;
    // height:290px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    padding: 25px;
    .psd {
      margin-top: 25px;
    }
    .btn {
      margin-top: 25px;
      .btn_login {
        width: 320px;
      }
    }
    .caution {
      color: red;
      font-size: 16px;
      line-height: 24px;
    }
    .remarks {
      margin-top: 25px;
      div {
        text-align: center;
        font-size: 12px;
        line-height: 16px;
        color: red;
      }
    }
  }
}
</style>