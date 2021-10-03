//这里是对request.js模块的进一步的封装

//导入request.js这个模块
import {request} from './request';

export function getHomeMultidata() {
  return request({
    url: '/home/multidata',
  })
}
