<template>
  <div class="gqg">
    <h6>测试组件传参</h6>
  </div>
</template>

<script>
export default {
  // name: "HelloWorld",
  props: {
    toChildMsg:Object
  },
  data() {
    return {
      offset: 0,
      limit: 20
    };
  },
  created() {
    console.log('执行此页面的逻辑吗',this.toChildMsg.gqg)
  },
  methods: {
    
  }
};
</script>
<style scoped lang="less">
  .hello{
    width:100%;
    height:100%;
  }
</style>
