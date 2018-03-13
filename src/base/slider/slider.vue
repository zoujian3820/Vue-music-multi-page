<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{'active':currentPageIndex==index}">2</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'
  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._setSliderWidth(false)
        this._initDocts()
        this._initSlider()
        if(this.autoPlay) this._play()
        window.addEventListener('resize',()=>{
          if(this.slider) {
            this._setSliderWidth(true)
            this.slider.refresh()
          }
        },false)
      })
    },
    methods: {
      _setSliderWidth(isRsize){
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for(let i=0; i<this.children.length; i++){
            let child = this.children[i]
            addClass(child, 'slider-item')
            child.style.width = sliderWidth + 'px'
            width += sliderWidth
        }
        if(this.loop && !isRsize) width += 2 * sliderWidth

        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDocts() {
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          //console.log(pageIndex)
          if(this.loop) pageIndex -= 1        //因为是无缝（限）循环，所以多两张，起始时默认是从第二个子元素开始this.slider.getCurrentPage().pageX : 2
          this.currentPageIndex = pageIndex   //所以计算当前播放到哪一张的，标识点<span class="dot" :class="{'active':currentPageIndex==index}">时，要减一
          if(this.autoPlay){
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1  //因为重新计算图片播放到哪一张了，所以要先加一，然后因为是无缝（限）循环，再播放下一张，所以还要加一
        if(this.loop) pageIndex += 1
        this.timer = setTimeout(()=>{
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
