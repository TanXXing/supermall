<template>
  <div class="CartList">
    <cart-list-item v-for="(item, index) in cartList" :item-info="item">{{item}}</cart-list-item>
  </div>
</template>

<script>
import CartListItem from 'views/cart/childComps/CartListItem';
import {mapGetters} from 'vuex'

export default {
  name: 'CartList',
  components: {
    CartListItem
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'cartList'
    ])
  }
}
</script>

<style scoped> 

</style>
