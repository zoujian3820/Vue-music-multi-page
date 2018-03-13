<template>
  <div id="app">
    <m-header></m-header>
    <v-tab></v-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import VTab from 'components/tab/tab'
  import Player from 'components/player/player'
  /**
   * 为了防止,每次点击router-link触发，路由切换时，
   * router-view中的组件都会重新渲染并请求数据，造成切换时页面晃动，引响性能和体验
   * 可在router-view外层包一层keep-alive，这样组件就会保存在内存中，切换时直接从内存读取，而避免重新渲染
   * <keep-alive>
   *   <router-view></router-view>
   * </keep-alive>
   * */
  export default {
    components: {
      MHeader,
      VTab,
      Player
    },
    mounted(){
      console.log(this)
      //this.$router.push('/Singer')
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
