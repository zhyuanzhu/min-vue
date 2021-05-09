class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    // data 中的属性名称
    this.key = key
    // 回调函数，负责更新视图
    this.cb = cb
    // 把 watcher 对象记录到 Dep 类的静态属性 target
    Dep.target = this

    // 触发 get 方法，在get方法中调用 addSub
    this.oldValue = vm[key]
    // 设置为 null ，防止重复添加
    Dep.target = null
  }

  // 当数据发生变化的时候，更新视图
  update () {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) return
    this.cb(newValue)
  }

}