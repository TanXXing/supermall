<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" 
        :is-checked="isSelectAll"
        @click.native="selectAllClick"/>
    </div>
    <span class="checkAll">全选</span>
    <span class="totalPrice">合计:{{totalPrice}}</span>
    <span class="calculate" @click="calcClick">去计算({{checkLength}})</span>
  </div>
</template>

<script>
import CheckButton from 'components/common/checkButton/CheckButton'
import {mapGetters} from 'vuex'

export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  data() {
    return {

    }
  },
  computed: {
    totalPrice() {
      return '¥ ' + this.$store.getters.cartList.filter((item) => {
        return item.checked
      }).reduce((acc, cur) => {
        return acc + cur.count * cur.price
      }, 0).toFixed(2)
    },
    ...mapGetters([
      'cartList',
      'checkLength',
      'cartLength'
    ]),
    isSelectAll() {
      // 全选按钮的第一种情况: 非人为点击全选按钮(因为，商品添加进去的时候，默认是选中的，所以，现在只需要判断，
      // 如果有没有选中的话，那么全选按钮，就不选中
      // 如果，直接判断，全部的商品的checked属性为true时，才将isChecked设置为true,否则为false,那么这样会对性能造成影响
      // 因此，正确思路是，发现只要有一个商品的checked属性为非true时，那么全选按钮对应的isSelectAll的结果就是false
      // 具体方法，肯定是使用断言类的高阶函数，比
      // return !this.$store.getters.cartList.find((item) => !item.checked)
      // 下面“断言函数”性能比“”用在此处的性能要高
      if(this.cartLength === 0) return false
      // return !this.cartList.find((item) => !item.checked)

      // 下面的这个断言函数，其实性能比this.cartList.find还要高，因为，下面的this.cartList.some((item) => !item.checked)
      //得到的就是一个布尔类型的变量
      return !this.cartList.some((item) => !item.checked)
    }

  },
  methods: {
    selectAllClick() {
      // 全选按钮的第二部分：当点击全选按钮的时候
      // 两种情况：第一：当点击之前全部选中，那么点击之后，就全部不选中； 第二：当点击之前有部分选中或者是全部没选中，那就全部选中
      // 如果点击之前，已经全部选中了，那就改为全部不选中
      if(this.isSelectAll) {
        this.cartList.forEach((item) => item.checked = false)
      }else { //点击之前全部没选中，或者是部分选中时，点击之后，将其修改为全部选中的状态
        this.cartList.forEach((item) => item.checked = true)
      }


    /* 下面这行代码，会出问题，因为this.isSelectAll的结果为true时，意味着，所有添加至购物车中的商品，前面已经全部勾选
    ,此时，由于forEach循环中，将全部勾选中的商品的某个item.checked的结果修改为了false，按道理说，对于全选的商品，点击完
    全选按钮之后，它应该变为全不选的，但是这里只是将某个商品变为不选，这个结果会影响isSelectAll的计算结果，那么这是不能保证，
    在同一个forEach循环中，前后两次使用的isSelectAll的结果是一样的，所以会出错

    forEach()里面的回调函数可以看做是同步回调，这没有问题(是指：当执行this.cartList.forEach这个同步代码时，同时
    会执行forEach里面的回调函数，如果，forEach里面的为异步回调函数的话，那么执行this.cartList.forEach和执行里面的回调函数
    的时间会有一定的时间差)，但是，这并不意味着，里面的回调函数执行的时候，this.isSelectAll的结果不会变化，因为isSelectAll是一个
    计算属性，它不是一个像之前写法的哪种定值，“关键在于这里的代码和isSelectAll里面的代码存在相互影响的关系”
    */
    // this.cartList.forEach((item) => item.checked = !this.isSelectAll)
    },
    calcClick() {
      if(!this.checkLength) {
        this.$toast.showMessage('请添加商品，谢谢')
        // console.log(this.$toast.showMessage);
      }
    }
  }
}
</script>

<style scoped> 
.bottom-bar {
  display: flex;
  position: relative;
  z-index: 9;
  height: 40px;
  line-height: 40px;
  background-color: #eee;
}

.check-content {
  display: flex;

  width: 20px;
  align-items: center;
  margin-left: 10px;
  margin-right: 5px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
}

.checkAll {
  width: 50px;
}

.totalPrice{
  flex: 1;
}

.calculate{
  width: 100px;
  background-color: #FF4500;
  color: #fff;
  text-align: center;
}
</style>
