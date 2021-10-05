//这里是对request.js模块的进一步的封装

//导入request.js这个模块
import {request} from './request';

export function getHomeMultidata() {
  return request({
    url: '/home/multidata',
  })
}

//这个地方采用了get请求中，查询字符串的方式，而且，这里的type, page不是瞎写的，这个是要根据后端提供过来的接口来写的
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}
