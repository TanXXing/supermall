import {ADD_COUNTER, ADD_TO_CART} from "store/mutations-types"

export default {
  [ADD_COUNTER](state, payLoad) {
    payLoad.count++
  },
  [ADD_TO_CART](state, payLoad) {
    // 被选中的商品的选中状态默认为true
    payLoad.checked = true
    state.cartList.push(payLoad)
  }
}