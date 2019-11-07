<template>
  <div class="app_header">
    <h2 class="tit_head">
      <router-link v-if="from" :to="from.path">
        <span></span>
        <span></span>
        <span></span>
      </router-link>
      {{to.name}}
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
.wrap_nav {
  text-align: left;
}

</style>