<template>
  <div class="app_header">
    <h2 class="tit_head">
      <router-link v-if="from" :to="from.path">
        <span></span>
        <span></span>
        <span></span>
      </router-link>
      {{to.name}}
      <div v-if="to.name !== 'Home'">
        <p>현재 위치</p>
        <p>목표 위치</p>
        <p>이동 가능</p>
      </div>
    </h2>
  </div>
</template>

<script>
export default {
  name: 'app-header',
  data() {
    return {
      from: { path: '/', name: 'Home' },
      to: this.$route
    }
  },
  watch: {
    $route(to, from) {
      this.to = to
      this.from = from
    }
  }
}
</script>

<style scoped>
.app_header {
  height: 60px;
  background-color: #1a1c22;
  border-bottom:1px solid rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
}
.tit_head {
  position: relative;
  padding: 10px;
}
.tit_head a {
  overflow: hidden;
  position: absolute;
  top: 10px;
  left: 10px;
  height: 30px;
  width: 30px;
  padding-top: 6px;
  box-sizing: border-box;
}
.tit_head span {
  display: block;
  background-color: #fff;
  height: 4px;
  width: calc(100% - 6px);
  margin: 3px;
  border-radius: 2px;
  box-sizing: border-box;
}
.tit_head div{
  position:absolute;
  top:5px;
  right:10px;
}
.tit_head div p{
  font-size:10px;
}
.tit_head div p:nth-child(1)::before{
  display: inline-block;
  height:8px;
  width:8px;
  margin-right:6px;
  background-color: #e83e8c;
  content: ''
}
.tit_head div p:nth-child(2)::before{
  display: inline-block;
  height:8px;
  width:8px;
  margin-right:6px;
  background-color: #007bff;
  content: ''
}
.tit_head div p:nth-child(3)::before{
  display: inline-block;
  height:8px;
  width:8px;
  margin-right:6px;
  background-color: #ffc107;
  content: ''
}
.wrap_nav {
  text-align: left;
}

</style>