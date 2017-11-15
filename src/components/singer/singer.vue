<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="listView"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERROR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import listView from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10
  export default {
    /**
     * name的作用：
     * 指定 name 选项的另一个好处是便于调试。有名字的组件有更友好的警告信息。另外，
     * 当在有 vue-devtools, 未命名组件将显示成 <AnonymousComponent>,
     * 这很没有语义。通过提供 name 选项，可以获得更有语义信息的组件树。
     * name属性在组件递归的时候有用。
     * export出来的是一个Vue实例
     * **/
    mixins:[playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(item) {
       // console.log('item------')
        //console.log(item)
        this.$router.push({
          path:`/Singer/${item.id}`
        })
        this.setSinger(item)
      },
      _getSingerList() {
        getSingerList().then(res => {
          if(res.code === ERROR_OK) this.singers = res.data.list
           this.singers = this._normalLizeSinger(this.singers)

        })
      },
      _normalLizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if(index < HOT_SINGER_LEN) map.hot.items.push( new Singer ({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
          const key = item.Findex
          if(!map[key]) map[key] = {
            title: key,
            items: []
          }
          map[key].items.push(new Singer ({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        
        let hot = []
        let ret = []
        for(let k in map){
          let val = map[k]
          if(val.title.match(/[a-zA-Z]/)){
            ret.push((val.title=val.title.toUpperCase())&&val)
          } else if(val.title === HOT_NAME){
            hot.push(val)
          }
        }
        ret.sort((a, b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        console.log('singer组件jsonp拿到的json:',hot.concat(ret))
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.listView.refresh()
      }
    },
    components: {
      listView
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
</style>
