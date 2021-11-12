<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="detail-scroll" ref="scroll">
      <detail-swiper :top-images='topImages'/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo"  @imgLoad="goodsImgLoad"/>
      <detail-param-info :param-info="paramInfo"/>
    </scroll>
  </div> 
</template>

<script>
import DetailNavBar from 'views/detail/childComponents/DetailNavBar'
import DetailSwiper from 'views/detail/childComponents/DetailSwiper'
import DetailBaseInfo from 'views/detail/childComponents/DetailBaseInfo'
import DetailShopInfo from 'views/detail/childComponents/DetailShopInfo'
import DetailGoodsInfo from 'views/detail/childComponents/DetailGoodsInfo'
import DetailParamInfo from 'views/detail/childComponents/DetailParamInfo'

import Scroll from 'components/common/scroll/Scroll'

// 导入detail.js向服务器获取数据
import {getDetail, Goods, Shop, GoodsParam} from 'network/detail'


export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    Scroll
  },
  data() {
    return {
      /* 在这里把点击某个图片之后，获取这个图片的一个id之后，并保存了起来，因为，这是为了方便后面根据这个唯一的标识
      去服务器请求相应的数据，之所以是为了在这里先对数据做个保存，有两个原因，第一：防止数据丢失  第二：由于data里面数据
      先占了个坑位的话，那么后面的这个数据就会被vue托管，这个就可以避免不能实现数据的响应式(否则后添加的数据，要想实现响应式的话
      就需要使用其它的方法)*/
      iid: '',

      // 存储detail中关于轮播图的数据
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {}
    }
  },
  created() {
    this.iid = this.$route.params.iid

    // 在跳转页面的时候，同时向服务器发起请求以获得数据，为后面的展示做准备
    getDetail(this.iid).then((res) => {
      console.log(res);

      const data = res.result

      // 1.获取顶部的轮播图数据
      this.topImages = data.itemInfo.topImages

      // 2. 获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 3.获取店铺信息
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      // 5.获取商品的参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
    })
  },
  methods: {
    // 但是这样并不好，这相当于每次加载完一张图片之后，就会进行一次refresh
    // 考虑到手机屏幕的长度有限，这部分的图片需要滑动才能看到，因此，可以采取，当所有的这个图片加载完后，再refresh
    goodsImgLoad() {
      this.$refs.scroll.refresh()
    }
  }
}
</script>

<style scoped> 
#detail {
  position: relative;
  z-index: 9;
  background-color:#fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

/* 如果#detail那里没有写height时，那么这个calc里面的100%并不会得到想要的效果(也就是detail-scroll的高度不会是
固定的，而是依然由其内容的高度给撑开) */
.detail-scroll {
  height: calc(100% - 44px)
}
</style>
