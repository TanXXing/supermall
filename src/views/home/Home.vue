<template>
  <div id="home">
    <!--    使用NavBar组件-->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <!--    这是另外的一个tabcontrol的替身-->
    <tab-control
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />

    <!-- 使用封装好的scroll托管滚动区域-->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="0"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!--使用HomeSwiper组件-->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />

      <!-- 使用RecommendView这个组件-->
      <recommend-view :recommends="recommends" />

      <!--既然是组价化开发的话，我更希望使用组件的形式来开发，也就是把这里抽成一个个的组件，而不是，直接在这里使用image标签-->
      <feature-view />

      <!-- 使用TabControl组件-->
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />

      <!--  使用GoodsList这个组件，这个地方的pop是不能写死的，不能进行硬编码,这个地
     方用的并不是跳转路由来实现的-->
      <goods-list :goods="showGoods" />
    </scroll>

    <back-top @click.native="backTopClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
//导入组件的时候，按照该组件模板里面需要的顺序写导入的东西

//来自同一个目录下的组件放到一起，方便后面维护

//导入进一步封装的HomeSwiper组件
import HomeSwiper from "./childComps/HomeSwiper";

//导入RecommendView这个组件
import RecommendView from "views/home/childComps/RecommendView";

//导入FeatureView组件
import FeatureView from "./childComps/FeatureView";

//导入components下面的common里面的组件
//导入NavBar组件
import NavBar from "components/common/navbar/NavBar";

import Scroll from "components/common/scroll/Scroll";

//导入components下面的context里面的组件
import TabControl from "components/context/tabControl/TabControl";

import GoodsList from "components/context/goods/GoodsList";

import BackTop from "components/context/backTop/BackTop";

//导入src/common/utils.js
import { debounce } from "common/utils.js";

//导入home.js这个包含请求的模块
import { getHomeMultidata, getHomeGoods } from "network/home.js";

// 导入混入对象
import { itemMixin, backTopMixin } from "common/mixin.js";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  mixins: [itemMixin, backTopMixin],
  data() {
    return {
      // results: null
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      //当前类型的默认值
      currentType: "pop",

      //  吸顶效果的参数
      tabOffsetTop: 0,
      isTabFixed: false,

      //  跳转路由时，保存位置
      saveY: 0,

      // 在这里保存一个事件处理函数itemImgListener(此处已经放在混入对象里面了)
      /* itemImgListener: null */

      // 记录home.vue里面，当tabcontrol中的流行对应的界面，变为新款对应的界面，此时滚动的距离发生了变化了吗？
      scrollDis: 0,
    };
  },
  computed: {
    showGoods() {
      // console.log('计算一次')
      return this.goods[this.currentType].list;
    },
  },
  /*什么时候发送请求呢？这个请求是需要在home组件里面发起的，我们希望当home组件被创建时，就发送这个请求，但是这个请求
   * 是不是立即被推到执行栈上面去执行呢？很显然不是，因为请求是一个异步操作，我们把这个请求放到了一个生命周期函数里面
   * ，这意味者，当这个函数结束的时候(里面的代码被放到执行栈完全执行完之后)，它里面的局部变量会被垃圾回收，那么我们如何获取
   * 请求得到的数据，以及把它打印出来,并保存呢？*/
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
      }
      //是两个真的tabcontrol和替身tabcontrol统一起来
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    /*下面是请求数据的方法*/
    getHomeMultidataInMethods() {
      getHomeMultidata().then((res) => {
        // console.log(res.data)
        // this.results = res.data

        /*
          这里的数据之所以被保存下来了，即使这个箭头函数完全从执行栈下来了，res这个局部变量会被垃圾回收，由于res保存着的对象的引用
          ，所以，我们通过this.banners使得banners这个变量保存着res所指的对象的引用，所以res对应的堆空间的对象，没有当做垃圾回收
          ，因为，这里还有banners这个变量，保存着这个对象的引用，那么问题，又来了，箭头函数没有自己的this，这里的this是指谁呢？
          * */
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
        // console.log(res)
      });
      /*如果在生命周期函数的这个地方去打印的话，不会得到正确保存后的this.results的正确数据，因为，请求是异步的，下面的代码
       * 会在请求获取成功之前打印，因此，这里的this.results是拿不到正确的数据的，因此，要获取数据，需要在.then里面拿到数据*/
      // console.log(this.results)
    },

    getHomeGoodsInMethods(type) {
      //注意这里涉及到两个page,但是，实际上，他们表示的不是同一个东西(其实，下面的page不需要使用const,因为在同一个作用
      // 作用域范围内，page的值并没有改变，只是在多次调用这个函数的时候，它的值才会变)
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        //...运算符的扩展作用
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page++;
        /*在这里去拿到home.vue的子组件里面的data里面的scroll，为了面向组件编程（体现封装思想），
          因此，我们调用了自己对better-scroll的finishPullUp进一步封装的方法*/

        //完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },

    backTopClick() {
      // this.$refs.scroll.scroll.scrollTo(0,0, 500)
      this.$refs.scroll.scrollTo(0, 0, 1000);
    },

    contentScroll(position) {
      this.scrollDis = -position.y;
      const positionY = -position.y;
      //1. 判断是否返回顶部
      this.isBackTop(positionY);

      //  2. 实现tabcontrol的吸顶效果
      this.isTabFixed = positionY > this.tabOffsetTop;
    },

    //  上拉加载更多
    loadMore() {
      this.getHomeGoodsInMethods(this.currentType);
    },

    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      /*打印tabControl的相对偏移的父亲，但是，这个属性是要求该父亲是设置了position为非static的吗？
        答案：是的*/
    },
  },

  created() {
    this.getHomeMultidataInMethods();

    //请求商品的数据
    this.getHomeGoodsInMethods("pop");
    this.getHomeGoodsInMethods("new");
    this.getHomeGoodsInMethods("sell");
  },
  mounted() {
    // console.log(this)
    /*获取到那个闭包对象(但是，按道理说，mounted的生命周期结束以后，refresh作为
      一个局部变量，会被释放，于是它所指的函数对象也会被当做垃圾对象给释放，
      但是，在这个mounted里面，是产生了闭包的this.$bus.$on里面的回调函数里面引用了refresh这个
      变量，)*/
    // const refresh = debounce(this.$refs.scroll.refresh, 100)
    /*  console.log('想要看下，这个里面的this指的是谁', this); */
    /* this.itemImgListener =  () => {
        refresh()
      }


      this.$bus.$on('itemImageLoad', this.itemImgListener)
 */
    // console.log(this.$refs.scroll.$el);
  },
  destroyed() {
    // console.log("组件被销毁");
  },
  //使用activated和deactivated时，意味着对该路由组件使用了keep-alive
  activated() {
    //  当发生路由又跳转到home.vue时，直接改变滚动位置
    console.log(this.saveY);
    this.$refs.scroll.scrollTo(0, this.saveY, 0);

    // console.log("组件被激活");
    //进行一次刷新
    // this.$refs.scroll.refresh();
  },
  deactivated() {
    /* 思考一个问题，为什么这个地方的记录位置写在deactivated这个生命周期函数就可以了呢？ 但是，之前的
    例子中，就不能写在deactivated里面了呢？*/

    /*离开home.vue组件时，记录该组件离开时的位置(注意，由于该项目的特殊性，home.vue里面
    真正能够滑动的东西就是scroll组件里面的东西，于是，记录位置，我们只需要记录下离开home.vue组件时
    scroll这个实例对象的滑动距离就可以了，这个可以通过this.$refs.scroll.scroll.y（也就是拿到better-scroll实例化
    对象.y属性，通过打印scroll这个对象就可以看到里面包含的东西）)*/
    this.saveY = this.$refs.scroll.getScrollY();

    // 由于Home.vue这个组件被keep-alive了,因此，当发生路由跳转后，它会执行deactivated这个生命周期函数
    //所以，我们可以在这个时候去取消对图片加载事件的监听
    // this.$bus.$on(取消事件监听的名字，取消对应事件监听的处理函数)
    // 如果，你只在this.$bus.$off里面写了第一个参数，那么，意味着，这会取消所有的关于itemImageLoad的事件
    //监听，为了具体取消哪一个，我们可以通过后面的处理函数的不同，实现取消同一事件监听下的，不同的处理函数的操作(因为关键
    //在于操作的不同)

    // 那么问题，又来了，这意味着，这个处理函数在开始监听和取消监听的时候都需要使用
    // 因此，最好，我们把这个函数给保留下来，如果不保留下来，直接使用匿名函数的话，也就是
    // ()= {}，那么在两次使用() => {}这个的时候，这不能保证在开始监听和取消监听的时候，是同一个事件处理函数
    //  this.$bus.$off('itemImageLoad', this.itemImgListener)

    // console.log("离开了Home.vue组件");
  },
};
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  /*margin-top: 44px;*/
  position: relative;
  height: 100vh;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*之前homeNav需要使用固定定位，是因为，之前使用的是浏览器的原生滚动(此时，需要homeNav不随着网页的滚动而滚动的话，
  那么，就需要使得home.vue是相对于视口定位)*/

  /*better-scroll能够实现局部滚动(在某个给定的wrapper的范围内，使得位于wrapper内的有效子元素实现局部滚动)
  本项目中，scroll组件的使用，使得，homeNav不需要使用相对于视口的固定定位了，当homeNav处于正常文档流时
  homeNav下面的东西，仍然是可以实现局部滚动的，这就是better-scroll实现局部滚动的好处*/
  /*position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;*/
}

.content {
  /*这个高度不是固定的，不是固定的300px*/
  /*height: 300px;*/
  /*overflow: hidden;*/

  /*  现在有两种方案来解决
1. 直接通过计算来解决
2. 通过定位来解决
现在通过定位来解决
*/
  position: absolute;
  /*注意，如果它的父元素是有padding的话，这个top就是从
  padding的位置开始的*/
  top: 44px;
  bottom: 49px;
  /*这个地方，left和right都设置值，是因为为了使得.content这个元素的宽度不是尤其内容撑开，在这里根据那个公式
  可以计算为，它的宽度为其设置了position非static的元素的最近父元素的宽度的百分之百
  ，.home这个元素的宽度，在这里又是视口宽度的百分之百*/
  left: 0;
  right: 0;
  overflow: hidden;

  /*height: calc(100% - 93px);
  overflow: hidden;*/
}

/*替身tabcontrol*/
.tab-control {
  /*这里需要改变tabcontrol的层级，使用定位，但是，这里不需要使用absolute或者是fixed*/
  position: relative;
  z-index: 9;
}
</style>
