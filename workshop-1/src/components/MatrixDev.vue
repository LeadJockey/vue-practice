<template>
  <div class="comp_matrix">
    <ul class="list_matrix">
      <li
        v-for="(each, idx) in matrix"
        :key="idx"
        :style="boxStyle"
        :class="{'on':each === 1,'end':directionPos=== idx, 'start':currPos===idx, 'searching':searchPos === idx}"
      >
        <span v-if="showMatrix">{{each}}</span>
        <span v-if="showIdx">{{idx}}</span>
      </li>
    </ul>
    <div class="bg">
      <div class="insert_btn">
        <button type="button" @click="setProcess">Insert</button>
        <button type="button" @click="execProcess">Execute</button>
        <button type="button" @click="resetProcess">Reset</button>
        <button type="button" @click="setShowMatrix">Matrix</button>
        <button type="button" @click="setShowIdx">Index</button>
      </div>
      <div v-if="insertProcess">
        <strong class="tit_queue">executing queue</strong>
        <div class="list_act" ref="actList">
          <span
            v-for="(direction, idx) in processList"
            :key="`direction${idx}`"
            class="act"
          >{{direction}}</span>
        </div>
        <div class="wrap_btns">
          <button type="button" @click="setLeft">left</button>
          <button type="button" @click="setUp">up</button>
          <button type="button" @click="setDown">down</button>
          <button type="button" @click="setRight">right</button>
          <button type="button" @click="setSearch">search</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'comp-matrix',
  props: {
    stage: {
      type: Object,
      required: true
    }
  },
  data() {
    const { matrix, start, end, rowCnt } = this.stage
    return {
      matrix: matrix,
      currPos: start,
      directionPos: end,
      rowCnt: rowCnt,
      searchPos: -1,
      insertProcess: false,
      processFinish: false,
      searchFound: false,
      processList: [],
      fps: 500,
      showMatrix: false,
      showIdx: false,
      boxStyle: {
        width: `calc((100vw - ${10 * rowCnt + 20}px) / ${rowCnt})`,
        height: `calc((100vw - ${10 * rowCnt + 20}px) / ${rowCnt})`,
        lineHeight: `calc((100vw - ${10 * rowCnt + 20}px) / ${rowCnt})`
      }
    }
  },
  computed: {
    currRow() {
      return this.getRowIdx(this.currPos)
    }
  },
  updated() {
    this.scrollLeft()
  },
  methods: {
    setShowMatrix() {
      this.showMatrix = !this.showMatrix
      this.showIdx = false
    },
    setShowIdx() {
      this.showIdx = !this.showIdx
      this.showMatrix = false
    },
    getRowIdx(pos) {
      return Math.floor(pos / this.rowCnt)
    },
    scrollLeft() {
      const target = this.$refs.actList
      if (target && target.scrollWidth) {
        target.scrollLeft = target.scrollWidth
      }
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
    setSearch() {
      this.processList.push('search')
    },
    repeat() {},
    async search() {
      this.searchFound = false
      const directionOrder = ['up', 'right', 'down', 'left']
      const length = directionOrder.length
      let idx = 0
      while (!this.searchFound && idx < length) {
        const currDirection = directionOrder[idx]
        try {
          await this[`search${currDirection}`]()
          await this.sleep(this.fps)
          await this.searchFinish(currDirection)
          await idx++
        } catch (e) {
          idx = length + 1
          this.setInitialProcessData()
          alert(`잘못된 행동입니다.\n원인 : ${e.message}\n다시 행동을 입력해 보아요.`)
        }
      }
    },
    searchleft() {
      this.searchPos = this.currPos - 1
      this.searchFound = this.moveHrizontal(this.searchPos)
    },
    searchup() {
      this.searchPos = this.currPos - this.rowCnt
      this.searchFound = this.moveVertical(this.searchPos)
    },
    searchdown() {
      this.searchPos = this.currPos + this.rowCnt
      this.searchFound = this.moveVertical(this.searchPos)
    },
    searchright() {
      this.searchPos = this.currPos + 1
      this.searchFound = this.moveHrizontal(this.searchPos)
    },
    left() {
      if (!this.moveHrizontal(this.currPos - 1)) throw new Error('이동할수 없어요!')
    },
    up() {
      if (!this.moveVertical(this.currPos - this.rowCnt)) throw new Error('이동할수 없어요!')
    },
    down() {
      if (!this.moveVertical(this.currPos + this.rowCnt)) throw new Error('이동할수 없어요!')
    },
    right() {
      if (!this.moveHrizontal(this.currPos + 1)) throw new Error('이동할수 없어요!')
    },
    moveHrizontal(nextPos) {
      const isSameRow = this.getRowIdx(nextPos) === this.currRow
      const isMovable = !!this.matrix[nextPos]
      if (isSameRow && isMovable) {
        this.currPos = nextPos
      }
      return isSameRow && isMovable
    },
    moveVertical(nextPos) {
      const isSameRow = this.getRowIdx(nextPos) === this.currRow
      const isMovable = !!this.matrix[nextPos]
      if (!isSameRow && isMovable) {
        this.currPos = nextPos
      }
      return !isSameRow && isMovable
    },
    setInitialProcessData() {
      this.insertProcess = false
      this.processList = []
      this.currPos = this.stage.start
      this.searchPos = -1
      this.processFinish = false
    },
    setProcess() {
      this.insertProcess = true
    },
    resetProcess() {
      this.setInitialProcessData()
    },
    async execProcess() {
      const length = this.processList.length
      let idx = 0
      while (!this.processFinish && idx < length) {
        try {
          await this[this.processList[idx]]()
          await this.sleep(this.fps)
          await this.finish()
          await idx++
        } catch (e) {
          idx = length + 1
          this.setInitialProcessData()
          alert(`잘못된 행동입니다.\n원인 : ${e.message}\n다시 행동을 입력해 보아요.`)
        }
      }
    },
    finish() {
      if (this.currPos !== this.directionPos) return
      this.processFinish = true
      alert('성공!')
      this.setInitialProcessData()
    },
    searchFinish(direction) {
      if (!this.searchFound && !this.processFinish) return
      this[direction]()
      this.searchPos = -1
      this.searchFound = true
    },
    sleep(ms) {
      return new Promise(res => setTimeout(res, ms))
    }
  }
}
</script>

<style scoped>
.comp_matrix {
  height: 100%;
}
.comp_matrix button {
  background-color: #1a1c22;
}
.list_matrix {
  overflow: hidden;
  height: 100vw;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #1a1c22;
}
.list_matrix li {
  float: left;
  width: calc((100vw - 120px) / 10);
  height: calc((100vw - 120px) / 10);
  line-height: calc((100vw - 120px) / 10);
  margin: 5px;
  background-color: #1e2128;
  transition: all 1s;
  font-weight: 600;
  border-radius: 10px;
}
.list_matrix li.on {
  background-color: #ffc107;
}
.list_matrix li.end {
  background-color: #007bff;
}

.list_matrix li.start {
  background-color: #e83e8c;
}
.list_matrix li.searching {
  background-color: #20c997;
}
.wrap_btns {
  text-align: center;
}
.wrap_btns button {
  background-color: #1a1c22;
  padding: 10px;
}
.wrap_btns button + button {
  margin-left: 4%;
}
.insert_btn button {
  display: inline-block;
  text-align: center;
  padding: 10px;
}
.insert_btn button + button {
  margin-right: 10px;
}
.list_act {
  display: flex;
  scroll-snap-type: x mandatory;
  scroll-snap-align: end;
  align-items: center;
  overflow-x: scroll;
  height: 60px;
  padding: 10px;
  white-space: nowrap;
  background-color: #1a1c22;
  margin: 10px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
}
.act {
  display: block;
  text-align: center;
  padding: 4px 6px;
  margin-right: 10px;
  color: #ffc107;
}
.list_act::-webkit-scrollbar {
  display: none;
}
.list_act .act:last-child {
  border: 1px solid #ffc107;
  border-radius: 10px;
}
.bg {
  height: calc(100% - 100vw);
  background-color: #1e2128;
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  box-sizing: border-box;
}
.tit_queue {
  display: inline-block;
  padding-top: 10px;
  color: #6c757d;
}
</style>