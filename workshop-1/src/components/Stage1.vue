<template>
  <div class="game_stage_1">
    <MatrixDev :stage="stage1"></MatrixDev>
  </div>
</template>

<script>
import MatrixDev from './MatrixDev'
import { stage1 } from './../constants'

export default {
  name: 'game-state-1',
  data() {
    return {
      stage1
    }
  },
  components: {
    MatrixDev
  }
}
</script>
