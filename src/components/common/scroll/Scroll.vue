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
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //存储被better-scroll托管的DOM元素
      scroll: null
    }
  },
  mounted() {
    /* console.log('scroll组件里面的this.$refs.wrapper', this.$refs.wrapper); */
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      click: true,
      pullUpLoad: this.pullUpLoad
    })

  //  监听组件的滚动位置(包括惯性滚动)
    this.scroll.on('scroll', (position) => {
      // 这个是实时的监听滚动，向父组件Detail.vue发出事件(为什么要向父组件发出事件呢？因为现在在两个组件
      //(scroll、DetailNavbar里面分别有两种数据，它们是滚动的距离以及点击的哪一个的索引)，而这两个组件都是Detail.vue的子组件)
      //为了方便统一进行处理，因此，我们可以统一在Detail.vue里面去处理
      this.$emit('scroll', position)
      // console.log(position);
      // console.log(this.scroll.y);
    })

    //上拉加载更多(这里为什么要加上一个判断？因为，当该组件在别的里面去使用的时候，虽然给了pullUpLoad的默认值，但是
    // 它不一定是需要添加pullingUp事件的)
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        //向home.vue里面发出事件，因为加载更多需要在home.vue里面完成，我们需要把这件事情告诉home.vue这个组件
        this.$emit('pullingUp')
      })
    }

  },
  methods: {
    //形参默认值的使用
    scrollTo(x, y, time=1000) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      //利用this.scroll进行容错处理结合短路与的操作进行容错处理
      return  this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>

</style>
