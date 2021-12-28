<template>
  <div v-show="isShow" class="toast-wrapper">
    <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      message: '',
      isShow: false
    }
  },
  methods: {
    showMessage(res) {
      this.message = res
      this.isShow = true
      setTimeout(() => {
        this.message = ''
        this.isShow = false
      }, 2000)
    }
  }
}
</script>

<style scoped> 
.toast-wrapper{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, .8);
  z-index: 999;
  color: #fff;
}
</style>
