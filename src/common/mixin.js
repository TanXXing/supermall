import {debounce} from 'common/utils.js';
import BackTop from 'components/context/backTop/BackTop'
import { BACKTOP_DISTANCE } from 'common/const';

// 创建混入对象mixin
export const itemMixin = {
  // 混入钩子函数
  mounted() {

    // console.log(this)

    /*获取到那个闭包对象(但是，按道理说，mounted的生命周期结束以后，refresh作为
    一个局部变量，会被释放，于是它所指的函数对象也会被当做垃圾对象给释放，
    但是，在这个mounted里面，是产生了闭包的this.$bus.$on里面的回调函数里面引用了refresh这个
    变量，)*/
    const refresh = debounce(this.$refs.scroll.refresh, 50)

   /*  console.log('想要看下，这个里面的this指的是谁', this); */

    this.itemImgListener =  () => {
      refresh()
      /* console.log('这个函数被调用了多少次呢？');  */  //这个打印了多少次，并不能说明防抖是不是起作用了
      // 看防抖是不是起作用了是要看那个封装好的debounce里面的setTimeout函数里面的异步回调函数打印了多少次
    }


    this.$bus.$on('itemImageLoad', this.itemImgListener)

  },
  data() {
    return {
      // 混入：变量
    itemImgListener: null,
    }
  }
}


export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backTopClick() {
      this.$refs.scroll.scrollTo(0, 0, 1000);
    },

    isBackTop(position){
      this.isShowBackTop = (position) > BACKTOP_DISTANCE;
    }
  }
}
