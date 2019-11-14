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
      <div class="box_queue">
        <div class="list_act" ref="actList">
          <span v-for="(eachProcess, idx) in processList" :key="`eachProcess${idx}`" class="act">
            <button
              v-if="eachProcess.name === 'search'"
              type="button"
              class="search"
              @click="onChangeDirectionOrder(idx)"
            >{{eachProcess.name}}:[ {{eachProcess.params.join(', ')}} ]</button>
            <button
              type="button"
              class="loop"
              v-else-if="eachProcess.name === 'loop'"
              @click="insertLoop(idx)"
            >{{eachProcess.name}}:[ {{eachProcess.params.join(', ')}} ]</button>
            <span v-else class="normal">{{eachProcess.name}}</span>
          </span>
        </div>
        <div class="act_btns">
          <button type="button" @click="setLeft">left</button>
          <button type="button" @click="setUp">up</button>
          <button type="button" @click="setDown">down</button>
          <button type="button" @click="setRight">right</button>
          <button type="button" @click="setSearch">search</button>
          <button type="button" @click="setLoop">loop</button>
        </div>
      </div>
      <div class="insert_btns">
        <button type="button" class="reset" @click="resetProcess">Reset</button>
        <button type="button" @click="setShowMatrix">Matrix</button>
        <button type="button" @click="setShowIdx">Index</button>
        <button type="button" class="exec" @click="exec">Execute</button>
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
      openPopup: false,
      searchFound: false,
      isProcessEnded: true,
      processList: [],
      fps: 300,
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
      this.processList.push({
        name: 'search',
        func: this.search,
        params: ['right', 'up', 'left', 'down']
      })
    },
    setLoop() {
      this.processList.push({ name: 'loop', func: this.loop, params: [], count: 0 })
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
    async exec() {
      this.isProcessEnded = false
      this.currPos = this.stage.start
      const len = this.processList.length
      let idx = 0
      while (!this.isProcessEnded && idx < len) {
        try {
          await this.processList[idx].func(this.processList[idx].params)
          await this.sleep(this.fps)
          await this.execFinish()
          await idx++
        } catch (e) {
          idx = len + 1
          alert(`아니 에게 무슨일이야~\n${e.message}`)
          this.openPopup = true
          this.setInitialProcessData()
        }
      }
    },
    execFinish() {
      if (this.currPos === this.directionPos) {
        alert(`SUCCESS`)
        this.setInitialProcessData()
      }
    },
    moveToSearch(nextPos) {
      this.searchPos = nextPos
    },
    async search(directions) {
      this.searchFound = false
      const len = directions.length
      const toCapitalizeString = str => str.substring(0, 1).toUpperCase() + str.substring(1)
      const dirList = directions.map(toCapitalizeString)
      let idx = 0
      while (!this.searchFound && idx < len) {
        try {
          await this[`search${dirList[idx]}`]()
          await this.sleep(this.fps)
          await idx++
        } catch (e) {
          idx = len + 1
          alert(`아니 에게 무슨일이야~\n${e.message}`)
          this.setInitialProcessData()
        }
      }
    },
    async loop(directions) {
      console.log(directions)
      const len = directions.length
      let idx = 0
      while (idx < len) {
        try {
          await this[directions[idx]]()
          await this.sleep(this.fps)
          await idx++
        } catch (e) {
          idx = len + 1
          alert(`아니 에게 무슨일이야~\n${e.message}`)
          this.setInitialProcessData()
        }
      }
    },
    loopFinish() {},
    onChangeDirectionOrder(idx) {
      const inserted = prompt('방향의 우선순위를 지정해 주세요.\n각 방향들은 공백으로 구분됩니다\nex) left right up down')
      try {
        const insertedList = inserted.split(' ')
        if (insertedList.length !== 4) throw new Error('방향검색 우선순위별로 네 방향 모두 입력해야 합니다.')
        this.processList[idx].params = insertedList
      } catch (e) {
        alert(`아니 에게 무슨일이야~\n${e.message}`)
      }
    },
    insertLoop(idx) {
      const inserted = prompt('반복할 함수의 이름을 입력해 주세요\n방향 함수만 지원합니다.\n각 방향들은 공백으로 구분됩니다.\nex) left right up down')
      const loopCount = prompt('반복횟수를 설정해 주세요.')
      const dirMap = {
        left: true,
        right: true,
        up: true,
        down: true
      }
      try {
        let params = []
        const insertedList = inserted.split(' ')
        const tick = insertedList.filter(dir => !!dirMap[dir])
        for (let i = 0; i < Number(loopCount); i++) {
          params = params.concat(tick)
        }
        this.processList[idx].params = params
        this.processList[idx].count = Number(loopCount)
      } catch (e) {
        alert(`아니 에게 무슨일이야~\n${e.message}`)
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
      this.isProcessEnded = true
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
.bg {
  height: calc(100% - 100vw);
  background-color: #1e2128;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}
.box_queue {
  height: calc(100% - 60px);
}
.list_act {
  height: 51px;
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background-color: #111;
  overflow-x: scroll;
  white-space: nowrap;
}
.list_act::-webkit-scrollbar {
  display: none;
}
.list_act .act {
  display: inline-block;
  text-align: center;
  margin-right: 10px;
  padding: 1px;
}
.list_act .normal {
  padding: 5px 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  background-color: #1a1c22;
}
.list_act .search {
  padding: 5px 10px;
  border: 1px solid #20c997;
}
.list_act .loop {
  padding: 5px 10px;
  border: 1px solid #e83e8c;
}
.list_act .act:last-child {
  background-color: yellow;
}

.act_btns {
  height: 60px;
  padding: 10px;
}
.act_btns button {
  width: 15%;
  height: 40px;
}
.act_btns button + button {
  margin-left: 2%;
}
.insert_btns {
  height: 60px;
  padding: 10px;
}
.insert_btns button {
  width: 22.75%;
  height: 100%;
  font-size: 16px;
}
.insert_btns button + button {
  margin-left: 3%;
}
.insert_btns button:nth-child(1) {
  background-color: #ffc107;
  color: #333;
}
.insert_btns button:nth-child(4) {
  background-color: #007bff;
}
</style>