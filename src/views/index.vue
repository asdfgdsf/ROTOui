<template>
  <div id="app" class="background-image">
    <el-carousel height="100vh">
      <el-carousel-item>
        <img src="https://img.zcool.cn/community/0176d35e586b6ba801216518e31821.jpg@3000w_1l_0o_100sh.jpg"  class="pic"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="https://img1.qunarzz.com/travel/d7/1501/ba/91d9864ac476d.jpg_r_2144x1424x95_9f0eb5ed.jpg"  class="pic"/>
      </el-carousel-item>
      <el-carousel-item>
        <img src="https://iili.io/JhstVob.jpg"  class="pic"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script></script>
<style>
.pic{
  width: 100vw;
  height: 100vh;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.background-image {
  background-image: url(https://iili.io/JW9JIhg.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
#app{
  width: 100vw;
  height: 100vh;
}
</style>
