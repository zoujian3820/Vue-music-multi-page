/**
 * Created by Mrzou on 2017-7-19.
 */
import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = './api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    g_tk: 67232076,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res)=> {
    return Promise.resolve(res.data)
  })
}
