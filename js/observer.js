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
    const that = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()

    // 如果val是对象，把val的内部属性设置为响应式数据
    that.walk(val)

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newValue) {
        if (newValue === val) return
        val = newValue
        // 如果新赋值的属性值是对象，把该对象变成响应式
        that.walk(newValue)

        // 触发依赖，发送通知，通知观察者更新视图
        dep.notify()
      }
    })
  }

}