//封装了一个防抖函数
export function debounce(func, delay) {
  // console.log('debounce中的this', this);
  let timer = null;
  //这里的...args利用...的收集功能，来接受可变数量的参数
  return function (...args) {

    // console.log('这个里面的this是指谁呢？', this); //为什么这里的this也是undefined呢？

    //当事件被再次触发时，它还处于delay的时间范围内， 那么就清空计时器，重新计时
    if(timer) clearTimeout(timer)
    /* console.log('debounce中想要打印看下，这个里面的this指的是谁', this); */
    timer = setTimeout(() => {
      /*apply和call的区别在于，第二个参数，apply要通过数组的形式来传递，
      *但是，call是需要一个个的传递 */
      func.apply(this, args)
      // func(args)
      // console.log(this) //为什么是这里的this是undefined呢？

      // console.log('这个打印了多少次，就可以看出来，防抖是否起作用了'); //这个地方才能看出防抖是否起作用了
      /*
      为什么在setTimeout里面的这个地方才能看出来防抖是否起作用了呢？
      因为，setTimeout里面的这个函数意味着在一定的delay之后，才会进行某种未进行防抖时才会频繁执行的操作，
      当在这个delay期间，function(...args) {}这个函数一致没有被触发的话，那么timer就不会被清空(clearTimeout(timer)),
      这意味着什么呢？这意味着setTimeout里面的函数会从DOM时间管理模块里面推到任务队列里面，只要它进入到了任务队列里面，
      那么，它就一定会执行，很显然，这是可以限制“某种未进行防抖时才会频繁执行的操作”执行的次数
      */
    }, delay)

    // console.log('debounce函数执行了几次，可以判断如果不添加防抖函数(debounce)函数的话,那个频繁的操作(func会执行多少次)');
  }
}

// 格式化时间
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};
