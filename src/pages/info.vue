<template>
  <div class="userInfo">
    <h2>{{gqg}}的后台管理系统账户详情</h2>
  </div>
</template>
<script>
export default {
  data() {
    return {
      gqg: ""
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$request.get("/admin/info").then(res => {
        console.log("用户信息", res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.userInfo {
  position: relative;
  background-color: #324057;
  width: 100%;
  height: 100%;
  h2 {
    padding-top: 40px;
    color: #fff;
    text-align: center;
  }
}
</style>