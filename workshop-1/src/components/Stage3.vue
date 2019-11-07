<template>
  <div class="game_stage_3">
    <MatrixDev :stage="stage3"></MatrixDev>
  </div>
</template>

<script>
import MatrixDev from './MatrixDev'
import { stage3 } from './../constants'

export default {
  name: 'game-state-3',
  data() {
    return {
      stage3
    }
  },
  components: {
    MatrixDev
  }
}
</script>
