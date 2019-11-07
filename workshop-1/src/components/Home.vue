<template>
  <div class="game_home">
    <ul class="list_stage">
      <li>
        <router-link to="/stages/1" class="link_stage">Stage 1</router-link>
      </li>
      <li>
        <router-link to="/stages/2" class="link_stage">Stage 2</router-link>
      </li>
      <li>
        <router-link to="/stages/3" class="link_stage">Stage 3</router-link>
      </li>
       <li>
        <router-link to="/stages/4" class="link_stage">Stage 4</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'game-home'
}
</script>
<style scoped>
.game_home {
  padding: 10px;
}
.game_home .link_stage {
  display: inline-block;
  padding: 20px;
  font-size: 20px;
  line-height: 20px;
}
</style>

