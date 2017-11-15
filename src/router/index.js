import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import singerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
import topList from 'components/top-list/top-list'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/Recommend'},
    {path: '/Recommend', component: Recommend, name: '', children:[
      {path: ':id', component: Disc, name: ''}
    ]},
    {path: '/Singer', component: Singer, name: '', children: [
      {path: ':id', component: singerDetail, name: ''}
    ]},
    {path: '/Rank', component: Rank, name: '', children: [
      {path: ':id', component: topList, name: ''}
    ]},
    {path: '/Search', component: Search, name: '', children: [
      {path: ':id', component: singerDetail, name: ''}
    ]}
  ]
})
