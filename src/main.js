import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
//router.push('/Singer') 除在路由中定义redirect属性外，可用router.push()做重定向
/*
 * 注意：在 Vue 实例内部，你可以通过 $router 访问路由实例。因此你可以调用 this.$router.push('/Singer')
 *   mounted(){
 *      this.$router.push('/Singer')
 *   }
 * **/
import 'common/stylus/index.styl'
fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
  //comments:{
  //  App
  //},
  //template:'<App/>'
})
