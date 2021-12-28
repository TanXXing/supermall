<template>
  <div id="cart">
    <!-- 顶部栏 -->
    <cart-nav-bar/>
    <!-- 添加的商品列表 -->
    <scroll class="cart-scroll" 
            :probe-type="probeType"
            ref="scroll">
      <cart-list></cart-list>
    </scroll>
    <!-- 底部汇总栏-->
    <cart-bottom-bar />
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartList from 'views/cart/childComps/CartList'
import CartBottomBar from 'views/cart/childComps/CartBottomBar'

import CartNavBar from 'views/cart/childComps/CartNavBar'

export default {
  name: 'Cart',
  components: {
    CartBottomBar,
    CartNavBar,
    CartList,
    Scroll
  },
  data() {
    return {
      probeType: 3
    }
  },
  created() {
    console.log('Cart.vue被创建');
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped> 
#cart {
  height: 100vh;
}

.cart-scroll {
  height: calc(100% - 133px);
  color: black;
}
</style>
