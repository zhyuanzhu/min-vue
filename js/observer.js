class Observer {
  constructor (data) {
    this.walk(data)
  }
  // 遍历对象的所有属性
  walk (data) {
    // 判断 data 是否是对象
    if (!data || typeof data !== 'object') return
    // 遍历 data 对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  // 遍历所有的属性，设置 getter 和 setter
  defineReactive (obj, key, val) {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get () {
        return val
      },
      set (newValue) {
        if (newValue === val) return
        val = newValue
        // 发送通知
      }
    })
  }

}