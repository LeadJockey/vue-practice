<template>
  <div class="comp_matrix">
    <ul>
      <li
        v-for="(each, idx) in matrix"
        :key="idx"
        :class="{'on':each > 0,'target':currPos===idx}"
      >{{idx}}</li>
    </ul>
    <div class="insert_btn">
      <button type="button" @click="setProcess">행동을 입력해주세요.</button>
    </div>
    <div v-if="insertProcess" class="wrap_btns">
      <button type="button" @click="setLeft">left</button>
      <button type="button" @click="setUp">up</button>
      <button type="button" @click="setDown">down</button>
      <button type="button" @click="setRight">right</button>
    </div>
    <div v-if="insertProcess">
      <span v-for="(direction, idx) in processList" :key="`direction${idx}`">{{direction}}</span>
    </div>
    <div v-if="insertProcess">
      <button type="button" @click.once="execProcess">행동실행</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'comp-matrix',
  props: {
    matrix: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currPos: 15,
      rowCnt: 5,
      directionPos: 9,
      insertProcess: false,
      missionComplete: false,
      processList: []
    }
  },
  computed: {
    currRow() {
      return this.getRowIdx(this.currPos)
    }
  },
  methods: {
    getRowIdx(pos) {
      return Math.floor(pos / this.rowCnt)
    },
    setLeft() {
      this.processList.push('left')
    },
    setUp() {
      this.processList.push('up')
    },
    setDown() {
      this.processList.push('down')
    },
    setRight() {
      this.processList.push('right')
    },
    left() {
      this.moveHrizontal(this.currPos - 1)
    },
    up() {
      this.moveVertical(this.currPos - this.rowCnt)
    },
    down() {
      this.moveVertical(this.currPos + this.rowCnt)
    },
    right() {
      this.moveHrizontal(this.currPos + 1)
    },
    moveHrizontal(nextPos) {
      const isSameRow = this.getRowIdx(nextPos) === this.currRow
      const isMovable = !!this.matrix[nextPos]
      if (isSameRow && isMovable) {
        this.currPos = nextPos
      } else {
        throw new Error('이동 할 수 없어요!')
      }
    },
    moveVertical(nextPos) {
      const isSameRow = this.getRowIdx(nextPos) === this.currRow
      const isMovable = !!this.matrix[nextPos]
      if (!isSameRow && isMovable) {
        this.currPos = nextPos
      } else {
        throw new Error('이동 할 수 없어요!')
      }
    },
    setInitialProcessData() {
      this.insertProcess = false
      this.processList = []
      this.currPos = 15
    },
    setProcess() {
      this.insertProcess = true
    },
    async execProcess() {
      const length = this.processList.length
      let idx = 0
      while (idx++ < length) {
        try {
          await this.sleep(500)
          await this[this.processList[idx]]()
          await console.log(idx)
        } catch (e) {
          idx = length + 1
          this.setInitialProcessData()
          alert(`잘못된 행동입니다.\n원인 : ${e.message}\n다시 행동을 입력해 보아요.`)
        }
      }
    },
    sleep(ms) {
      return new Promise(res => setTimeout(res, ms))
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
ul {
  overflow: hidden;
  height: 50vh;
  width: 100%;
  margin-bottom: 10px;
}
li {
  float: left;
  width: 20%;
  height: 20%;
  font-size: 20px;
  line-height: 10vh;
  list-style: none;
  box-sizing: border-box;
  border: 1px solid #ccc;
  transition: background-color 1s;
}
.on {
  background-color: gold;
}
.target {
  background-color: red;
}
.wrap_btns {
  overflow: hidden;
  padding: 10px 0;
}
.wrap_btns button {
  float: left;
  width: 22%;
  font-size: 20px;
  line-height: 10vh;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.wrap_btns button + button {
  margin-left: 4%;
}
.insert_btn button {
  display: inline-block;
  text-align: center;
  padding: 10px;
  background-color: #efefef;
}
</style>