/**
 * Created by Mrzou on 2017-6-26.
 * singer         歌手id数据
 * playing        播放开关
 * fullScreen     全屏开关
 * playlist       播放列表
 * sequenceList   顺序列表
 * mode           播放方式（顺序、循环、随机）
 * currentIndex   当前播放的音乐下标值（index）
 * currentSong    当前播放的音乐（value） playlist[currentIndex]
 */
export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = state => state.playlist[state.currentIndex] || {}
export const disc = state => state.disc
export const topList = state => state.topList
