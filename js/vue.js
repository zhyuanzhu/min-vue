class Vue {
  constructor (options) {
    // 1 模拟 vue 使用 $ 开头的内部属性保存选项数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' 
      ? document.querySelector(options.el) : options.el
    // 2 给 data 中的数据挂载 getter 和 setter，注入到 vue 实例中
    this._proxyData(this.$data)

    // 调用 observer 对象，监听数据变化
    new Observer(this.$data)

    // 
  }

  _proxyData (data) {
    Object.keys(data).forEach(key => {
      // 把 data 的属性注入到 vue 实例中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get () {
          return data[key]
        },
        set (newValue) {
          if (newValue === data[key]) return
          data[key] = newValue
        }
      })
    })
  }
}