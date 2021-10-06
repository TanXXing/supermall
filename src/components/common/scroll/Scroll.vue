<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
//导入better-scroll这个第三方包
import BScroll from 'better-scroll';

export default {
  name: "Scroll",
  data() {
    return {
      //存储被better-scroll托管的DOM元素
      scroll: null
    }
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper, {
      /*probeType: 3,
      pullUpLoad: true*/
      click: true
    })
  },
  methods: {
    //形参默认值的使用
    scrollTo(x, y, time=500) {
      this.scroll.scrollTo(x, y, time)
    }
  }
}
</script>

<style scoped>

</style>
