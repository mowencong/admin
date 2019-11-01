<template>
  <div class="hello">
    <h2>测试百度api获取当前地址和当前经纬度</h2>
    <div class="address">当前详细地址:{{address}}</div>
    <div class="lng">经度:{{lng}}</div>
    <div class="lat">纬度:{{lat}}</div>
    <div id="allmap" style="display:none"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address:'',
      lng:'',
      lat:''
    };
  },
  created() {
    this.getSystem();
  },
  mounted() {
    this.addressDetail();
  },
  methods: {
    addressDetail() {
      var that = this
      var map = new BMap.Map("allmap");
      var point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point, 12);
      var geoc = new BMap.Geocoder();
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            console.log("您的位置：" + r.point.lng + "," + r.point.lat);
            that.lng = r.point.lng
            that.lat = r.point.lat
            var pt = r.point;
            geoc.getLocation(pt, function(rs) {
              console.log('rs',rs)
              that.address = rs.address
            });
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    getSystem() {
      var u = navigator.userAgent;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        console.log("我是安卓系统");
      } else if (isiOS) {
        console.log("我是IOS系统");
      }
    }
  }
};
</script>
<style scoped lang="less">
.hello {
  width: 100%;
  height:100%;
  box-sizing: border-box;
  h2{
    font-size: 0.16rem;
    text-align: center;
  }
  div{
    margin-top:0.16rem;
  }
}
#allmap {
  width: 100px;
  height: 100px;
}
</style>
