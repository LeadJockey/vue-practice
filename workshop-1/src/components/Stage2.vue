<template>
  <div class="game_stage_2">
    <MatrixDev :stage="stage2"></MatrixDev>
  </div>
</template>

<script>
import MatrixDev from './MatrixDev'
import { stage2 } from './../constants'

export default {
  name: 'game-state-2',
  data() {
    return {
      stage2
    }
  },
  components: {
    MatrixDev
  }
}
</script>
