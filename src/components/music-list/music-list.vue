<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" @click="random" v-show="songs.length > 0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :dataJson="songs" :probeType="probeType" :listenScroll="listenScroll"
            class="list" ref="list" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {getStyle} from 'common/js/dom'
  import {prefixStyle} from 'common/js/dom'
  import loading from 'base/loading/loading'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const RESVERED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    mixins:[playlistMixin],
    data(){
      return {
        scrollY: 0
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    props: {
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      bgStyle() {
        return `background-image:url("${this.bgImage}")`
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESVERED_HEIGHT
      this.$refs.list.$el.style.top=`${this.imageHeight}px`
      this.imagePaddingTop = getStyle(this.$refs.bgImage, 'paddingTop')
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y
      },
      setBgImageStyle(obj) {
        this.$refs.bgImage.style.paddingTop = `${obj.paddingTop}`
        this.$refs.bgImage.style.height = `${obj.height}px`
        this.$refs.bgImage.style.zIndex = `${obj.zIndex}`
      },
      back() {
        this.$router.back()
      },
      selectItem(song, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      random() {
        console.log(this.songs)
        this.randomPlay({
          list: this.songs,
          index: 0
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ]),
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      }
    },
    components: {
      scroll,
      SongList,
      loading
    },
    watch: {
      scrollY(newY){
        let translateY = Math.max(this.minTranslateY, newY)
        this.$refs.layer.style[transform]=`translate3d(0, ${translateY}px, 0)`
        const percent = Math.abs(newY / this.imageHeight)
        let zIndex = 0
        let blur = 0
        if(newY > 0){
          let scale = 1 + percent
          zIndex = 10
          this.$refs.bgImage.style[transform] = `scale3d(${scale},${scale},1)`
        }else{
         // blur = Math.min(5 * (1+percent), 20)
          blur = Math.min(20, percent * 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
       // this.$refs.filter.style['opacity'] = `${blur}`
        if(newY < this.minTranslateY) {
          this.setBgImageStyle({paddingTop: 0, height: RESVERED_HEIGHT, zIndex: 10})
          this.$refs.playBtn.style.display = 'none'
        }else{
          this.setBgImageStyle({paddingTop: this.imagePaddingTop, height: 0, zIndex: zIndex?zIndex:0})
          this.$refs.playBtn.style.display = ''
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      /*overflow:hidden*/
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
