class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm
    this.compiler(this.el)
  }

  // 编译模版，处理文本节点和元素节点
  compiler (el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compilerText(node)
      }

      // 处理元素节点
      if (this.isElementNode(node)) {
        this.compilerElement(node)
      }

      // 判断 node 节点是否有子节点
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node)
      }
    })
  }

  // 编译元素节点，处理指令
  compilerElement (node) {
    // console.log(node.attributes)
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach(attr => {
      // 判断是否是指令
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // 去掉指令前面的 v-
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }

  update (node, key, attrName) {
    let updater = this[`${attrName}Updater`]
    updater && updater.call(this, node, this.vm[key], key)
  }

  // 处理 v-text 指令
  textUpdater (node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }

  // 处理 v-model 
  modelUpdater (node, value, key) {
    node.value = value
    new Watcher(this.vm, key, newValue => {
      node.value = newValue
    })

    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 处理文本节点，处理差值表达式
  compilerText (node) {
    const regExp = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (regExp.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(regExp, this.vm[key])

      // 创建 watcher 对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }

  // 判断元素属性是否是指令
  isDirective (arrtName) {
    return arrtName.startsWith('v-')
  }

  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }

  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }

}