<template>
  <div class="tab-control">
    <div v-for="(item, index) in titles"
         class="tab-control-item"
         :class="{active: currentIndex === index}" @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
    //  向父组件(home.vue)传递数据(子传父，通过事件进行传递)
      this.$emit('tabClick', index);
    }
  }
}
</script>

<style scoped>
.tab-control{
  display: flex;
  text-align: center;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  background-color: var(--color-background);
}

.tab-control-item {
  flex: 1;
}

.tab-control-item span {
  /*这个padding-bottom感觉写在这里比写在.active span里面要好*/
  padding-bottom: 3px;
}

.active{
  color: var(--color-high-text);
}

.active span {
  border-bottom: 3px solid var(--color-high-text)
}
</style>
