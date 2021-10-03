<template>
  <!--使用swiper组件-->
  <swiper>
    <!--这里最好是用v-for循环，而不是直接用<swiper-item>写四个，把它给写死了-->
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" alt="">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
//导入轮播图的组件
/*
import Swiper from 'components/common/swiper/Swiper';
import {SwiperItem} from 'components/common/swiper/SwiperItem'
*/
//一起导出轮播图组件
import {Swiper, SwiperItem} from 'components/common/swiper/index.js'

export default {
  name: "HomeSwiper",
  components: {
    Swiper,
    SwiperItem
  },
  // props: ["banners"]
  props: {
    banners: {
      type: Array,
      default: () => {
        //默认为一个空数组
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>
