/**
 * Created by Mrzou on 2017-6-26.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,    //'src/component/music-list/music-list.vue' 异步修改数据，Action 提交的是 mutation,可以是多个mutation
  getters,    //'src/component/singer-detail/singer-detail.vue' 获取vuex中的数据，在computed中调用computed:{...mapGetters(['singer'])},在组件中直接调用this.singer, 如： created() {console.log('vuex-singer:',this.singer)}
  state,      //'src/store/state.js' 初始数据结构
  mutations,  //'src/component/singer/singer.vue' 修改数据，在methods中调用methods:{...mapMutations({setSinger: 'SET_SINGER'})},在组件中直接调用this.setSinger(item)
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

