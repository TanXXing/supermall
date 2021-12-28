export default {
  cartList(state) {
    return state.cartList
  },
  cartLength(state, getters){
    return getters.cartList.length
  },
  checkLength(state, getters) {
    return getters.cartList.filter((item) => item.checked).length
  }
}