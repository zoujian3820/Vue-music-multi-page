/**
 * Created by Mrzou on 2017-6-26.
 * singer         歌手id数据
 * playing        播放开关
 * fullScreen     全屏开关
 * playlist       播放列表
 * sequenceList   顺序列表 原始列表
 * mode           播放方式（顺序、循环、随机）
 * currentIndex   当前播放的音乐下标值（index）
 */
import {playMode} from 'common/js/config'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {}
}

export default state
