<template>
  <nav-bar class="nav-bar">
    <!-- 如果直接像下面这样写的话，太长了，不好 $store.state.cartList.length,可以放到计算属性里面去处理-->
    <!-- 如果使用$store.getters.cartLengt  这个依然比较长-->
    <!-- 于是可以利用getters和辅助函数(mapGetters)来解决这个问题 -->
    <div slot="center">购物车({{cartLength}})</div>
  </nav-bar>
</template>

<script>

import NavBar from 'components/common/navbar/NavBar';


import {mapGetters} from 'vuex'

export default {
  name: 'CartNavBar',
  components: {
    NavBar
  },
  data() {
    return {

    }
  },
  computed: {
    // 使用计算属性来替代$store.state.cartList.length
    /* cartLength() {
      return this.$store.state.cartList.length
    }, */

    ...mapGetters([
      'cartLength'
    ])
  }
}
</script>

<style scoped> 
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 500;
  position: relative;
  z-index: 9;
}
</style>
