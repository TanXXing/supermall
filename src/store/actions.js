import {ADD_COUNTER, ADD_TO_CART, ADD_CART} from "store/mutations-types"

export default  {
  [ADD_CART](context, payLoad) {
    return new Promise((resolve, reject) => {
        /* 现在的一个需求是：如果添加的是同一个商品的话，那么它的数量就加一，如果添加的不是同一个商品，那么
      购物车(cartList)中商品的种类就加一
      */
    // 创建一个变量作为标识：来标识该商品是否之前添加过
    let oldProduct = null;
    for(let item of context.state.cartList) {
      if(item.iid === payLoad.iid) {
        // 取出原来已经存在的商品(意味该商品已经有了count属性), 对其数量进行加一
        oldProduct = item
      }
    }

      // 我们要明白的一点是：当某种商品第一进入购物车的时候，是没有数量属性的
      if(oldProduct) { //之前已经添加过 // 商品的数量进行加一

        // 获取索引，然后，把索引传递过去(如果传递索引过去的话，那我怎么知道给cartList中的哪个商品的count的数量加一呢？)
        // const index = context.state.cartList.indexOf(oldProduct) 
        context.commit(ADD_COUNTER, oldProduct)
        resolve('商品数量加一')
      }else { //商品的种类加一
        payLoad.count = 1;
        context.commit(ADD_TO_CART, payLoad)
        resolve('商品种类加一')
      }
    })
  }
}