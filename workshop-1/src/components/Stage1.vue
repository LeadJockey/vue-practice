<template>
  <div class="game_stage_1">
    <h2>Stage 1</h2>
    <MatrixDev :matrix="matrix"></MatrixDev>
  </div>
</template>

<script>
import MatrixDev from './MatrixDev'
  export default {
    name:'game-state-1',
    data(){return {
      matrix:[
                0,0,0,0,0,
                0,0,1,1,1,
                0,0,1,0,0,
                1,1,1,0,0,
                0,0,0,0,0,
              ]
      // matrix:[
      //           1,1,1,1,1,
      //           1,1,1,1,1,
      //           1,1,1,1,1,
      //           1,1,1,1,1,
      //           1,1,1,1,1,
      //         ]
    }},
    components:{
      MatrixDev
    }
  }
</script>

<style scoped>
</style>