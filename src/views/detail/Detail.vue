<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @themeClick="themeClick" ref="detailNavBar"/>
    <scroll class="detail-scroll" ref="scroll" 
    @scroll="contentScroll" :probe-type="probeType">
      <detail-swiper ref="swiper" :top-images='topImages'/>
      <detail-base-info ref="base" :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo"  @imgLoad="goodsImgLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommendInfo"/>
    </scroll>
    <detail-bottom-bar/>
    <back-top v-if="isShowBackTop" @click.native="detailBackTop"/>
  </div> 
</template>

<script>
import DetailNavBar from 'views/detail/childComponents/DetailNavBar'
import DetailSwiper from 'views/detail/childComponents/DetailSwiper'
import DetailBaseInfo from 'views/detail/childComponents/DetailBaseInfo'
import DetailShopInfo from 'views/detail/childComponents/DetailShopInfo'
import DetailGoodsInfo from 'views/detail/childComponents/DetailGoodsInfo'
import DetailParamInfo from 'views/detail/childComponents/DetailParamInfo'
import DetailCommentInfo from 'views/detail/childComponents/DetailCommentInfo'
import DetailBottomBar from 'views/detail/childComponents/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'

import GoodsList from 'components/context/goods/GoodsList'
import BackTop from 'components/context/backTop/BackTop'

import {debounce} from 'common/utils'
import {BACKTOP_DISTANCE} from 'common/const.js'

// 导入detail.js向服务器获取数据
import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'

// 导入混入对象
import {itemMixin} from 'common/mixin.js'



export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    BackTop,
    Scroll
  },
  mixins: [itemMixin],
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
      paramInfo: {},
      commentInfo: {},
      recommendInfo: [],
      // 很明显，这个高度肯定不是固定的，而是动态变化的，那么这个高度可以怎么获取呢？使用offsetTop(偏移距离)
      themeTopYs: [],
      getItemOffsetTop: null,
      probeType: 3,
      currentIndex: 0, 
      isShowBackTop: false
    }
  },
  created() {
    this.iid = this.$route.params.iid

    // 在跳转页面的时候，同时向服务器发起请求以获得数据，为后面的展示做准备
    getDetail(this.iid).then((res) => {

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

      // 6.获取评论的信息
      if(data.rate.crate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      /* this.$nextTick(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        console.log(this.themeTopYs); 
      }) */
    })
    
    // 获取recommend信息
    getRecommend().then((res) => {
      // console.log(res);
      this.recommendInfo = res.data.list
    })
  },
  mounted() {
    // 解决滚动卡顿的问题
   /*  const detailRefresh = debounce(this.$refs.scroll.refresh, 100)
    
    this.itemImgListener = () => detailRefresh() */

    /* this.$bus.$on('itemImageLoad', () => {
      detailRefresh()
    }) */

    /* console.log('想要看下，这个里面的this指的是谁', this); */

    /* this.$bus.$on('itemImageLoad', this.itemImgListener) */
    /* console.log('这是Detail.vue里面的mounted'); */

    // 第一种方案：在mounted里面获取参数、评论以及推荐的位置(DOM挂载之后)

    /* this.themeTopYs.push(0)
    this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    console.log(this.themeTopYs);  */
    //[0, undefined, 498, 498]
    /* 我们知道请求是异步的，从这个结果可以看出来mounted执行的时候，由于paramInfo使用了div的这个根元素，但是，它首先获得的
    数据是空的对象，因此，<div class="param-info" v-if="Object.keys(paramInfo).length !== 0"></div>这个根元素根本不会出现
    在组件对象里面，注意this.$refs拿到的是那个虚拟DOM，要想拿到真实的DOM,需要使用this.$refs.refname.$el,很显然，此时this.$refs
    .param可以得到虚拟DOM对应的组件对象，但是，没有得到$el，也就是此时还没有挂载$el属性
    */

   /* 为了实现Detail.vue里面的DetailNavBar的点击某一项后，自动跳转指定位置，这里使用
   了防抖策略，从封装的debounce防抖函数来看，第一个参数就是要进行防抖处理的操作，根据其
   使用setTimeout实现的防抖策略，会发现使用了闭包来保存timer, 那么要保存，这一个处于闭包中的
   变量(保存闭包，因此，我们需要使用一个变量来保存debounce返回来的那个函数(这个函数里面保存了闭包，其实就是timer以及
   需要进行防抖处理的函数，因此，debounce这个调用不能放到methodes里面的goodsImgLoad里面，因为，methods里面的
   东西，只能保证在某个事件触发后，才会执行某个语句，我们希望的是当goodsImgLoad事件触发时，直接执行防抖处理的函数，而不是
   执行debounce(debounce只是为了让timer有一个类似全局变量的特性，对实际的防抖函数的再一次封装而已)))) 
   
   为了保存闭包，我们需要使用一个变量getItemOffsetTop把debounce返回的包含闭包的一个函数给存储起来，因为，如果
   不存储的话，当mounted函数结束生命周期之后，那个debounce返回的函数在堆内存里面被释放掉，那么，真正地防抖也无法实现*/

   this.getItemOffsetTop = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(this.$refs.swiper.$el.offsetTop)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // 在这里补充一个比较大的值
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs); 
      }, 10)


      console.log(this);
  },
  destroyed() {
    // 由于Detail.vue没有使用keep-alive，因此，不能在deactivated里面去取消全局事件中的某个事件监听函数
    this.$bus.$off('itemImageLoad', this.itemImagListener)
    // console.log('离开了Detail.vue组件');
  },

  updated() {
    /* this.themeTopYs = []
    this.themeTopYs.push(0)
    this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    console.log(this.themeTopYs);  */

    // 测试scroll这个组件对象的根元素的offsetParent是谁
    /* console.log(this.$refs.scroll);
    console.log(this.$refs.scroll.$el.offsetParent);
    console.log(this.$refs.scroll.$el.offsetTop);
    console.log(this.$refs.scroll.$el.position); */
  },

  methods: {
    // 但是这样并不好，这相当于每次加载完一张图片之后，就会进行一次refresh
    // 考虑到手机屏幕的长度有限，这部分的图片需要滑动才能看到，因此，可以采取，当所有的这个图片加载完后，再refresh
    goodsImgLoad() {
      // this.$refs.scroll.refresh()
      // 图片每次刷新后，重新求offsetTop，先清空，然后再重新求距离(注意数据的响应式问题)
     

      // 对每次图片加载完成之后，都进行刷新数据的操作进行防抖处理

      // console.log('Detail.vue组件中的图片加载');

      this.getItemOffsetTop()
      /* console.log('***********');
      console.log('我想打印的看下，下面的这三个的offsetParent到底是谁');
      console.log(this.$refs.swiper.$el.offsetParent);
      console.log(this.$refs.params.$el.offsetParent);
      console.log(this.$refs.comment.$el.offsetParent);
      console.log(this.$refs.recommend.$el.offsetParent);
      console.log('&&&&&&&&&&&&&&&&&&'); */
    },

    // 点击DetailNavBar中的某一个，实现滚动到对应位置的功能
    themeClick(currentIndex) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[currentIndex], 0)
    },

    contentScroll(position) {
      // console.log(-position.y);
      // for(let index in this.themeTopYs) {
        /* if(this.themeTopYs[index] === (-position.y)) {
          // this.$refs.detailNavBar.currentIndex = index;
          // console.log('在这里使用二者相等来判断的条件很愚蠢，因为，很难保证这个相等的条件被获取到，应该使用范围去判断');
        } */
        // console.log(typeof index); //这里的index是一个字符串类型的, 因此需要对index进行隐式转换，转化为number类型
        //这样才能保证this.themeTopYs根据索引获取到对应的值

        // 尽管对index做了隐式转换，但是当index=3时，index+1会使得数组越界：this.themeTopYs[4]为undefined
        /* if((-position.y) > this.themeTopYs[+index] && (-position.y) < this.themeTopYs[+index + 1]) {
          console.log(index);
        } */

        // 为了解决数组越界的问题，当index为3的时候，我们另外做判断
        // 从性能的角度出发，由于-position.y在每一for...in...循环中会经常用到，我们先对它做一个保存
        /* let positionY = -position.y;
        let i = +index;
        let length = this.themeTopYs.length; */
        /* 下面的这两个if条件写的就很low，很明显，这两个if条件里面的判断是对立的，但是当它们进入到if之后，最后的结果都是一样的，
        都是为了得到此时的i
        */
        
        // 以后所有的if语句，看看能不能借助||以及&&的特点来代替
        /* if(i < length - 1 && (-position.y) >= this.themeTopYs[i] && (-position.y) < this.themeTopYs[i + 1]) {
          console.log(i);
        }

        if(i === length  - 1 && (positionY >= this.themeTopYs[i])) console.log(i); */

        // console.log('执行了几次呢？');

      // 这里的if循环嵌套的太狠了,可以考虑使用&&或者是||来简化
      /* if(this.currentIndex !== i) {  //判断上次记录的那个i是否相同的问题
          if((i < length - 1  && (-position.y) >= this.themeTopYs[i] && (-position.y) < this.themeTopYs[i + 1]) ||
         (i === length - 1 && (positionY >= this.themeTopYs[i]))) {
           //如果在这里直接把这个i传递给Detail.vue组件里面的话，这里会太频繁，频繁的操作？使用防抖是一种方式，但是，
           //这里可以不用使用防抖函数，利用前后比对的方式也可以解决，
           this.currentIndex = i;
          //  console.log(this.currentIndex);
          this.$refs.detailNavBar.currentIndex = this.currentIndex
          }
       } */
      
        /* if((this.currentIndex !== i) && ((i < length - 1  && (-position.y) >= this.themeTopYs[i] && (-position.y) < this.themeTopYs[i + 1]) ||
         (i === length - 1 && (positionY >= this.themeTopYs[i])))) {
           this.currentIndex = i;
           this.$refs.detailNavBar.currentIndex = this.currentIndex;
         } */
        
       


        let positionY = -position.y;
        let length = this.themeTopYs.length
        for(let i = 0; i < length - 1; i++) {
          if((this.currentIndex !== i) && (positionY >= this.themeTopYs[i]) && (positionY < this.themeTopYs[i + 1])) {
            this.currentIndex = i;
            this.$refs.detailNavBar.currentIndex = i;
          }
        }


        this.isShowBackTop = positionY > BACKTOP_DISTANCE ? true : false;

      // }
    },
    detailBackTop() {
      this.$refs.scroll.scrollTo(0, 0, 1000);
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
  height: calc(100% - 107px)
}
</style>
