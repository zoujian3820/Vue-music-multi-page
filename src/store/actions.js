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

export const selectPlay = function ({commit,state}, {list, index}) {
  commit(types.SET_SEQUENCELIST, list)
  if (state.mode === playMode.random) {
    const radomList = shuffle(list)
    commit(types.SET_PLAYLIST, radomList)
    index = findIndex(radomList, list[index])
  }else{
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
