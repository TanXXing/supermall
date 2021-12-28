import Toast from './Toast'

// 先创建一个对象
const obj = {};



obj.install = function (Vue) {
  // 1. 创建组件构造器
  const toastConstructor = Vue.extend(Toast)

  // 2. 通过new的方式，根据组件构造器，创建组件构造器的实例对象
  const toast = new toastConstructor()

  // 3. 将创建出来组件实例对象，手动挂载到某一个元素上
  toast.$mount(document.createElement('div'))

  // 4. toast.$el对应的就是div
  document.body.appendChild(toast.$el)

  // 5. 将创建的组件实例对象放到Vue的原型上
  Vue.prototype.$toast = toast
}

// 导出创建的对象
export default obj