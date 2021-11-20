// 导入封装好的request.js
import {request} from './request'

// 发起请求获取数据
export function getDetail(iid) {
  return request({
    url: '/detail',
    params: {
      iid,
    }
  })
}

// 获取Recommend数据
export function getRecommend() {
  return request({
    url: '/recommend'
  })
}



// 利用面向对象编程的思想对在Detail组件里面获取到的数据进行整合，方便其子组件在同一个对象中获取数据
// 获取商品信息
export class Goods {
  constructor(itemInfo, columns, services) {
    this.title = itemInfo.title;
    this.desc = itemInfo.desc;
    this.newPrice = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice;
    this.discount = itemInfo.discountDesc;
    this.columns = columns;
    this.services = services;
    this.nowPrice = itemInfo.highNowPrice;
  }
}

// 获取商家信息
export class Shop {
  constructor(shopInfo) {
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.score = shopInfo.score;
    this.goodsCount = shopInfo.cGoods
  }
}

//  获取商品的参数信息
export class GoodsParam {
  constructor(info, rule) {
    // 注: images可能没有值(某些商品有值, 某些没有值)
    this.image = info.images ? info.images[0] : '';
    this.infos = info.set;
    this.sizes = rule.tables;
  }
}