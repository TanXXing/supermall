<template>
  <nav-bar>
    <div slot="left" class="back" @click="backClick">
      <img src="~assets/img/common/back.svg" alt="">
    </div>
    <div slot="center" id="title">
        <div v-for="(item, index) in title" 
        class="title-item" 
        :class="{active: currentIndex === index}" 
        @click="titleClick(index)">{{item}}</div>
    </div>
  </nav-bar>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

export default {
  name: 'DetailNavBar',
  data() {
    return {
      title: ['商品', '参数', '评论', '推荐'],
      currentIndex: 0
    }
  },
  components: {
    NavBar
  },
  methods: {
    titleClick(index) {
      this.currentIndex = index
      // 向Detail.vue里面传递数据
      this.$emit('themeClick', index)
    },
    backClick() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped> 
#title{
  display: flex;
}

.title-item {
  flex: 1;
  font-size: 14px;
}

.active{
  color: var(--color-high-text)
}

.back img{
  margin-top: 10px;
}
</style>
