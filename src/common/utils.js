//封装了一个防抖函数
export function debounce(func, delay) {
  let timer = null;
  //这里的...args利用...的收集功能，来接受可变数量的参数
  return function (...args) {
    //当事件被再次触发时，它还处于delay的时间范围内， 那么就清空计时器，重新计时
    if(timer) clearTimeout(timer)

    timer = setTimeout(() => {
      /*apply和call的区别在于，第二个参数，apply要通过数组的形式来传递，
      *但是，call是需要一个个的传递 */
      func.apply(this, args)
      // func(args)
      // console.log(this)
    }, delay)
  }
}
