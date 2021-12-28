<template>
  <div class="goods-item" @click="itemClick">
    <!-- 这里是在监测”每一张图片“的加载是否完成-->
    <img v-lazy="showImage" alt="" @load="imageLoad" />
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">¥{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    showImage() {
      // a.b(undefined)            a.b.c的问题
      return this.goodsItem.image || this.goodsItem.show.img;
      /* return this.goodsItem.show.img || this.goodsItem.image    */
    },
  },
  methods: {
    imageLoad() {
      /*发送事件(但是，这个地方的this.$bus是undefined，
      要想使用事件总线(是可以用来直接在不同的组件里面发送事件
      和监听事件的)，我们需要在main.js里面加上这句话
      Vue.prototype.$bus = new Vue())*/

      /* this.$bus.$emit('itemImageLoad') */

      /* 方式一(思路是，根据所处的路由，决定向事件总线上发出哪个事件):
      判断，当前goodsItem展示时，所处于的哪个路由 */
      /* if(this.$route.path.indexOf('/home') !== -1) {
        this.$bus.$emit('homeItemImageLoad')
      }else if(this.$route.path.indexOf('/detail') !== -1) {
        this.$bus.$emit('detailItemImageLoad')
      } */

      /* 方式二：仍然是发出同一个事件，但是，在对应的页面进行取消全局事件的监听(那应该在何处取消监听呢？) */
      this.$bus.$emit("itemImageLoad");

      // console.log("图片加载了");
    },
    itemClick() {
      this.$router.push("/detail/" + this.goodsItem.iid);
    },
  },
};
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  width: 47%;
}
.goods-item img {
  width: 100%;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 3px;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 0;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
