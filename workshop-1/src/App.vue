<template>
  <div id="app">
    <stage-1></stage-1>
  </div>
</template>

<script>
import Stage1 from './components/Stage1.vue'

export default {
  name: 'app',
  components: {
    Stage1
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
