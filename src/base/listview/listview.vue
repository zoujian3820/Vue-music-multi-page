<template>
  <scroll :dataJson="data" :listenScroll="listenScroll"
          class="listview" ref="listView" @scroll="scroll"
          :probeType="probeType">
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title" v-text="group.title"></h2>
        <ul>
          <li class="list-group-item" @click="selectItem(item)" v-for="item in group.items">
            <img v-lazy="item.avatar" class="avatar" alt="">
            <span class="name" v-text="item.name"></span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" v-for="(item, index) in shortCutList"
            v-text="item" :data-index="index"
            :class="{'current':currentIndex === index}"></li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loadging-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import loading from 'base/loading/loading'

  const ANCHOR_HEIGHT = 18 //高度为字体高+ padding高计算出
  const TITLE_HEIGHT = 30

  export default {
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortCutList() {
        return this.data.map(el => {
          return el.title.substr(0, 1)
        })
      },//js map() 方法返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组。
      fixedTitle() {
        if(this.scrollY>0) return ''
        return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let targetIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = targetIndex
        this._scrollToElement(targetIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        //if(this.touch.y1) this.$refs.listView.scrollTo(0, - this.touch.y2+this.touch.y1)
        let delta = (this.touch.y2 - this.touch.y1)/ANCHOR_HEIGHT | 0
        let anchorIndex =  Number(this.touch.anchorIndex) + delta
         setTimeout(()=>{
           this._scrollToElement(anchorIndex)
         },60)
        //console.log(this.$refs.listGroup[anchorIndex])
      },
      _scrollToElement(index) {
        if(!index && index !== 0) return
        if(index < 0) index = 0
        if(index > this.listHeight.length-2) index = this.listHeight.length-2
        this.scrollY = -this.listHeight[index]
        this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
      },
      refresh() {
        this.$refs.listView.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _calcLateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i=0; i<list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectItem(item) {
        this.$emit('select', item)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calcLateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        //当滚动到页面顶部 newY > 0
        if(newY > 0) return this.currentIndex = 0
        for(let i=0; i<listHeight.length-1; i++){
          let height1 = listHeight[i]
          let height2 = listHeight[i+1]
          //在中间部分滚动
          if(-newY >= height1 && -newY < height2){//newY为负数
            //console.log('Y=='+newY+' '+'one=='+height1+' '+'two=='+height2)
            this.diff = height2 + newY
            return this.currentIndex = i
          }
        }
        //当滚动到底部，且-newY大于最后一个元素的上限距离 height2   0 + 23 =24 -2
        this.currentIndex = this.listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop) return
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform=`translate3d(0, ${fixedTop}px,0)`
      }
    },
    components: {
      scroll,
      loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .loadging-container
      position: absolute
      top: 50%
      width: 100%
      transform: translateY(-50%)
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
