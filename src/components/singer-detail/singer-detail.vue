<template>
  <transition name="slider">
    <!--<div class="singer-detail">-->
      <!--{{$route.params.id}}-->
    <!--</div>-->
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERROR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
     return {
       songs: []
     }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail()
      console.log('vuex-singer:',this.singer)
    },
    methods: {
      _getDetail() {
        if(!this.singer.id) return this.$router.push(`/Singer`)
        getSingerDetail(this.singer.id).then(res => {
          if(res.code === ERROR_OK){
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          let {musicData} = item
          //console.log(musicData)
          if(musicData.songid && musicData.albummid) ret.push(createSong(musicData))
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  /*.singer-detail*/
    /*position: fixed*/
    /*top: 0*/
    /*bottom: 0*/
    /*left: 0*/
    /*right: 0*/
    /*z-index: 100*/
    /*background: $color-background*/
  .slider-enter-active, .slider-leave-active
    transition: all .3s
  .slider-enter, .slider-leave-to
    transform: translate3d(100%, 0, 0)

</style>
