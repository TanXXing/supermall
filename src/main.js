import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



// 导入自建包
import toast from 'components/common/toast/index.js'

// 使用vue-lazyload进行图片的懒加载
import VueLazyLoad from 'vue-lazyload'

// 解决移动端300ms延迟：fastclick
/* const attachFastClick = require('fastclick')
console.log(attachFastClick); */
// attachFastClick(document.body)

// 安装插件(前面的相当于导入了一个包，只不过这个包是自己创建的包，非来自第三方的包)
Vue.use(toast)


Vue.use(VueLazyLoad, {
  loading: require('assets/img/common/placeholder.png')
})

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



/* setTimeout(() => {
  console.log(this) //undefined
}, 200)

setTimeout(function() {
  console.log(this) //window
}, 200)


console.log(this); */

