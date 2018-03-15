/**
 * Created by Mrzou on 2017-6-26.
 */
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list, song) {
  return list.findIndex(item=> {
    return item.id === song.id
  })
}

/**
 * action传参第一个参数有两种方式：
 * 1、直接用es6语法传{commit,state}
 * 2、传context对象,然后：context.commit   context.state
 *
 * action: 用来提交mutation，是异步提交，可提交一个也可同时提交多个mutation
 *
 * const actions = {
 *    //2种书写方式
 *  addplus(context){ //可以理解为代表了整个的上下文
 *    context.commit('add',{a:10})
 *  },
 *  subplus({commit}){
 *    commit('sub');
 *   }
 * };
 *
 * */

export const selectPlay = function ({commit,state}, {list, index}) {
  commit(types.SET_SEQUENCELIST, list)
  if (state.mode === playMode.random) {
    const radomList = shuffle(list)
    commit(types.SET_PLAYLIST, radomList)
    index = findIndex(radomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENTINDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}

export const randomPlay = function ({commit,state}, {list, index}) {
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCELIST, list)
  const radomList = shuffle(list)
  commit(types.SET_PLAYLIST, radomList)
  commit(types.SET_CURRENTINDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}
