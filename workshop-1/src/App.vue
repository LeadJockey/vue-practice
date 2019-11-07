<template>
  <div id="app" :style="{height:`${screenHeight}px`}">
    <Header></Header>
    <div class="app_body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from './components/Header'

export default {
  name: 'app',
  data() {
    return { screenHeight: 0 }
  },
  mounted() {
    this.screenHeight = window.innerHeight
  },
  components: {
    Header
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  user-select: none;
  box-sizing: border-box;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
}
button {
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 5px;
  box-sizing: border-box;
}
a,
span,
li,
strong,
button,
div,
p {
  color: #f8f9fa;
  font-weight: 600;
}
body {
  background-color: #1e2128;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.app_body {
  height: calc(100% - 60px);
  overflow-x: auto;
  overflow-y: scroll;
}
.app_body > div {
  height: 100%;
}
</style>
