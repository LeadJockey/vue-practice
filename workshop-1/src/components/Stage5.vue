<template>
  <div class="game_stage_5">
    <MatrixDev :stage="stage5"></MatrixDev>
  </div>
</template>

<script>
import MatrixDev from './MatrixDev'
import { stage5 } from './../constants'

export default {
  name: 'game-state-5',
  data() {
    return {
      stage5
    }
  },
  components: {
    MatrixDev
  }
}
</script>
