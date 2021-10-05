<template>
  <div id="home" >
<!--    使用NavBar组件-->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
<!--使用HomeSwiper组件-->
    <home-swiper :banners="banners" />

<!-- 使用RecommendView这个组件-->
    <recommend-view :recommends="recommends" />

<!--既然是组价化开发的话，我更希望使用组件的形式来开发，也就是把这里抽成一个个的组件，而不是，直接在这里使用image标签-->
    <feature-view />

<!-- 使用TabControl组件-->
    <tab-control :titles="['流行', '新款', '精选']"  class="tab-control"/>

<!--  使用GoodsList这个组件-->
    <goods-list :goods="goods.pop.list"/>

    <ul>
      <li>列表1</li>
      <li>列表2</li>
      <li>列表3</li>
      <li>列表4</li>
      <li>列表5</li>
      <li>列表6</li>
      <li>列表7</li>
      <li>列表8</li>
      <li>列表9</li>
      <li>列表10</li>
      <li>列表11</li>
      <li>列表12</li>
      <li>列表13</li>
      <li>列表14</li>
      <li>列表15</li>
      <li>列表16</li>
      <li>列表17</li>
      <li>列表18</li>
      <li>列表19</li>
      <li>列表20</li>
      <li>列表21</li>
      <li>列表22</li>
      <li>列表23</li>
      <li>列表24</li>
      <li>列表25</li>
      <li>列表26</li>
      <li>列表27</li>
      <li>列表28</li>
      <li>列表29</li>
      <li>列表30</li>
      <li>列表31</li>
      <li>列表32</li>
      <li>列表33</li>
      <li>列表34</li>
      <li>列表35</li>
      <li>列表36</li>
      <li>列表37</li>
      <li>列表38</li>
      <li>列表39</li>
      <li>列表40</li>
      <li>列表41</li>
      <li>列表42</li>
      <li>列表43</li>
      <li>列表44</li>
      <li>列表45</li>
      <li>列表46</li>
      <li>列表47</li>
      <li>列表48</li>
      <li>列表49</li>
      <li>列表50</li>
      <li>列表51</li>
      <li>列表52</li>
      <li>列表53</li>
      <li>列表54</li>
      <li>列表55</li>
      <li>列表56</li>
      <li>列表57</li>
      <li>列表58</li>
      <li>列表59</li>
      <li>列表60</li>
      <li>列表61</li>
      <li>列表62</li>
      <li>列表63</li>
      <li>列表64</li>
      <li>列表65</li>
      <li>列表66</li>
      <li>列表67</li>
      <li>列表68</li>
      <li>列表69</li>
      <li>列表70</li>
      <li>列表71</li>
      <li>列表72</li>
      <li>列表73</li>
      <li>列表74</li>
      <li>列表75</li>
      <li>列表76</li>
      <li>列表77</li>
      <li>列表78</li>
      <li>列表79</li>
      <li>列表80</li>
      <li>列表81</li>
      <li>列表82</li>
      <li>列表83</li>
      <li>列表84</li>
      <li>列表85</li>
      <li>列表86</li>
      <li>列表87</li>
      <li>列表88</li>
      <li>列表89</li>
      <li>列表90</li>
      <li>列表91</li>
      <li>列表92</li>
      <li>列表93</li>
      <li>列表94</li>
      <li>列表95</li>
      <li>列表96</li>
      <li>列表97</li>
      <li>列表98</li>
      <li>列表99</li>
      <li>列表100</li>
    </ul>

    </div>
</template>

<script>
//导入组件的时候，按照该组件模板里面需要的顺序写导入的东西

//来自同一个目录下的组件放到一起，方便后面维护

//导入进一步封装的HomeSwiper组件
import HomeSwiper from './childComps/HomeSwiper';

  //导入RecommendView这个组件
import RecommendView from 'views/home/childComps/RecommendView'

  //导入FeatureView组件
import FeatureView from "./childComps/FeatureView";




//导入components下面的common里面的组件
//导入NavBar组件
import NavBar from 'components/common/navbar/NavBar';


//导入components下面的context里面的组件
import TabControl from 'components/context/tabControl/TabControl'

import GoodsList from 'components/context/goods/GoodsList'

//导入home.js这个包含请求的模块
import {getHomeMultidata, getHomeGoods} from 'network/home.js'


  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList
    },
    data() {
      return {
        // results: null
        banners: [],
        recommends: [],
        goods: {
          pop: {page: 0, list: []},
          new: {page: 0, list: []},
          sell: {page: 0, list: []},
        }
      }
    },
    /*什么时候发送请求呢？这个请求是需要在home组件里面发起的，我们希望当home组件被创建时，就发送这个请求，但是这个请求
    * 是不是立即被推到执行栈上面去执行呢？很显然不是，因为请求是一个异步操作，我们把这个请求放到了一个生命周期函数里面
    * ，这意味者，当这个函数结束的时候(里面的代码被放到执行栈完全执行完之后)，它里面的局部变量会被垃圾回收，那么我们如何获取
    * 请求得到的数据，以及把它打印出来,并保存呢？*/
    created() {
      this.getHomeMultidataInMeghods()

      //请求商品的数据
      this.getHomeGoodsInMethods('pop')
      this.getHomeGoodsInMethods('new')
      this.getHomeGoodsInMethods('sell')
    },

    methods: {
      getHomeMultidataInMeghods() {
        getHomeMultidata().then(res => {
          // console.log(res.data)
          // this.results = res.data

          /*
          这里的数据之所以被保存下来了，即使这个箭头函数完全从执行栈下来了，res这个局部变量会被垃圾回收，由于res保存着的对象的引用
          ，所以，我们通过this.banners使得banners这个变量保存着res所指的对象的引用，所以res对应的堆空间的对象，没有当做垃圾回收
          ，因为，这里还有banners这个变量，保存着这个对象的引用，那么问题，又来了，箭头函数没有自己的this，这里的this是指谁呢？
          * */
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
          // console.log(res)
        })
        /*如果在生命周期函数的这个地方去打印的话，不会得到正确保存后的this.results的正确数据，因为，请求是异步的，下面的代码
        * 会在请求获取成功之前打印，因此，这里的this.results是拿不到正确的数据的，因此，要获取数据，需要在.then里面拿到数据*/
        // console.log(this.results)
      },

      getHomeGoodsInMethods(type) {
        //注意这里涉及到两个page,但是，实际上，他们表示的不是同一个东西(其实，下面的page不需要使用const,因为在同一个作用
        // 作用域范围内，page的值并没有改变，只是在多次调用这个函数的时候，它的值才会变)
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          //...运算符的扩展作用
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page++
          console.log(res)
        })
      }
    }
  }
</script>

<style scoped>
#home {
  padding-top: 44px;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

.tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
}
</style>
