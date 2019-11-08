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
        <button type="button" class="reset" @click="resetProcess">Reset</button>
        <button type="button" @click="setShowMatrix">Matrix</button>
        <button type="button" @click="setShowIdx">Index</button>
        <button type="button" class="exec" @click="exec">Execute</button>
      </div>
      <div>
        <strong class="tit_queue">executing queue</strong>
        <div class="list_act" ref="actList">
          <span
            v-for="(eachProcess, idx) in processList"
            :key="`eachProcess${idx}`"
            class="act"
          >{{eachProcess.name}}</span>
        </div>
        <div class="wrap_btns">
          <button type="button" @click="setLeft">left</button>
          <button type="button" @click="setUp">up</button>
          <button type="button" @click="setDown">down</button>
          <button type="button" @click="setRight">right</button>
          <button type="button" class="search" @click="setSearch">search</button>
          <button type="button" class="loop" @click="setLoop">loop</button>
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
    /* common methods */
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
    sleep(ms) {
      return new Promise(res => setTimeout(res, ms))
    },
    /* set methods */
    setLeft() {
      this.processList.push({ name: 'left', func: this.left })
    },
    setUp() {
      this.processList.push({ name: 'up', func: this.up })
    },
    setDown() {
      this.processList.push({ name: 'down', func: this.down })
    },
    setRight() {
      this.processList.push({ name: 'right', func: this.right })
    },
    setSearch() {
      const insertedValues = prompt('방향검색 순서를 입력해 주세요.\n방향은 공백으로 구분되어 집니다\nex) right up left down')
      this.processList.push({
        name: 'search',
        func: this.search,
        params: insertedValues ? insertedValues.split(' ') : ['right', 'up', 'left', 'down']
      })
    },
    setLoop() {
      this.processList.push({ name: 'loop', func: this.loop, params: [] })
    },
    /* get methods */
    getNextLeftPos() {
      return this.currPos - 1
    },
    getNextRightPos() {
      return this.currPos + 1
    },
    getNextUpPos() {
      return this.currPos - this.rowCnt
    },
    getNextDownPos() {
      return this.currPos + this.rowCnt
    },
    /* check methods */
    isMovable(nextPos) {
      return !!this.matrix[nextPos]
    },
    isSameRow(nextPos, targetPos) {
      return this.getRowIdx(nextPos) === this[targetPos]
    },
    isHorizontal(nextPos, targetPos) {
      return this.isMovable(nextPos) && this.isSameRow(nextPos, targetPos)
    },
    isVertical(nextPos, targetPos) {
      return this.isMovable(nextPos) && !this.isSameRow(nextPos, targetPos)
    },
    /* exec methods */
    moveTo(nextPos) {
      this.currPos = nextPos
    },
    moveToSearch(nextPos) {
      this.searchPos = nextPos
    },
    async exec() {
      this.currPos = this.stage.start
      const len = this.processList.length
      let idx = 0
      while (idx < len) {
        try {
          await this.processList[idx].func(this.processList[idx].params)
          await this.sleep(this.fps)
          await this.execFinish()
          await idx++
        } catch (e) {
          idx = len + 1
          alert(`아니 에게 무슨일이야~\n${e.message}`)
          this.setInitialProcessData()
        }
      }
    },
    execFinish() {
      if (this.currPos === this.directionPos) {
        alert(`SUCCESS\n점수 : ${this.processList.length}`)
        this.setInitialProcessData()
      }
    },
    async search(directions) {
      this.searchFound = false
      console.log(directions)
      const len = directions.length
      const toCapitalizeString = str => str.substring(0, 1).toUpperCase() + str.substring(1)
      const dirList = directions.map(toCapitalizeString)
      let idx = 0
      while (!this.searchFound && idx < len) {
        console.log('search tick', idx)
        try {
          await this[`search${dirList[idx]}`]()
          await this.sleep(this.fps)
          await this.searchFinish()
          await idx++
        } catch (e) {
          idx = len + 1
          alert(`아니 에게 무슨일이야~\n${e.message}`)
          this.setInitialProcessData()
        }
      }
    },
    searchFinish() {
      // console.log('searchFinish')
      // this.searchFound = true
      // this.searchPos = -1
    },
    async loop() {},
    loopFinish() {},
    left() {
      const nextPos = this.getNextLeftPos()
      const able = this.isHorizontal(nextPos, 'currRow')
      if (able) {
        this.moveTo(nextPos)
      } else {
        throw new Error('이동할수 없어요!')
      }
    },
    up() {
      const nextPos = this.getNextUpPos()
      const able = this.isVertical(nextPos, 'currRow')
      if (able) {
        this.moveTo(nextPos)
      } else {
        throw new Error('이동할수 없어요!')
      }
    },
    right() {
      const nextPos = this.getNextRightPos()
      const able = this.isHorizontal(nextPos, 'currRow')
      if (able) {
        this.moveTo(nextPos)
      } else {
        throw new Error('이동할수 없어요!')
      }
    },
    down() {
      const nextPos = this.getNextDownPos()
      const able = this.isVertical(nextPos, 'currRow')
      if (able) {
        this.moveTo(nextPos)
      } else {
        throw new Error('이동할수 없어요!')
      }
    },
    async searchLeft() {
      const nextPos = this.getNextLeftPos()
      await this.moveToSearch(nextPos)
      await this.sleep(this.fps)
      const able = this.isHorizontal(nextPos, 'currRow')
      if (able) {
        await this.moveTo(nextPos)
        this.searchFound = true
      }
    },
    async searchUp() {
      const nextPos = this.getNextUpPos()
      await this.moveToSearch(nextPos)
      await this.sleep(this.fps)
      const able = this.isVertical(nextPos, 'currRow')
      if (able) {
        await this.moveTo(nextPos)
        this.searchFound = true
      }
    },
    async searchRight() {
      const nextPos = this.getNextRightPos()
      await this.moveToSearch(nextPos)
      await this.sleep(this.fps)
      const able = this.isHorizontal(nextPos, 'currRow')
      if (able) {
        await this.moveTo(nextPos)
        this.searchFound = true
      }
    },
    async searchDown() {
      const nextPos = this.getNextDownPos()
      await this.moveToSearch(nextPos)
      await this.sleep(this.fps)
      const able = this.isVertical(nextPos, 'currRow')
      if (able) {
        await this.moveTo(nextPos)
        this.searchFound = true
      }
    },
    setInitialProcessData() {
      this.processList = []
      this.currPos = this.stage.start
      this.searchPos = -1
    },
    resetProcess() {
      this.setInitialProcessData()
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
.list_matrix li.searching {
  background-color: #20c997;
}
.list_matrix li.start {
  background-color: #e83e8c;
}

.wrap_btns {
  text-align: center;
}
.wrap_btns button {
  background-color: #1a1c22;
  padding: 5px;
}
.wrap_btns button.search {
  border: 1px solid #9f86ff;
}
.wrap_btns button.loop {
  border: 1px solid #03c4c6;
}
.wrap_btns button + button {
  margin-left: 10px;
}
.insert_btn button.exec {
  border: 1px solid #007bff;
}
.insert_btn button.reset {
  border: 1px solid #ffc107;
}
.insert_btn button {
  display: inline-block;
  text-align: center;
  padding: 10px;
}
.insert_btn button + button {
  margin-left: 10px;
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