<template>
  <div class="game_stage_4">
    <MatrixDev :stage="stage4"></MatrixDev>
  </div>
</template>

<script>
import MatrixDev from './MatrixDev'
import { stage4 } from './../constants'

export default {
  name: 'game-state-4',
  data() {
    return {
      stage4
    }
  },
  components: {
    MatrixDev
  }
}
</script>
