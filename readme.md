# Typescript version of Vue

## RoadMap of Features

- [x] Reactivity
  - [x] Dep
  - [x] Observer
    - [x] Observe plain object
    - [x] Observe Array
    - [x] add/delete property
  - [x] Watcher
    - [x] Asynchronous Execution
      Update watchers in an async queue
    - [x] Watch object deeply
    - [x] Watch object lazily

- [ ] VDom
  - [ ] Patch(Update DOM according to old vnodes and new vnodes)
    - [x] Diff vnode
    - [ ] Scoped ID (css)
    - [x] Update properties of new vnode's corresponding HTMLElement
      - [x] class
      - [x] style
      - [x] DOM events
      - [x] DOM properties & DOM attributions(Frankly, I am confused about the differences)

- [ ] Vue Instance
  - [x] Lifecycle
    - [x] beforeCreate,create,beforeMount,mounted,beforeUpdate,updated,beforeDestroy,destroyed
    - [x] Vue.prototype._update
      Invoke patch process between new vnode and old vnode
    - [x] Vue.prototype.$destroy
    - [x] Method: mountComponent
      Create render watcher for Vue instance
  - [x] Event
    - [x] $on
    - [x] $off
    - [x] $once
  - [x] Render
    - [x] Vue.prototype_render
      Construct vnode tree according to state of Vue instance(props,state...)
    - [x] Vue.prototype.$createElement
      Constructor of vnode(used in render function)
  - [x] State
    - [x] Initialization of options `props`
    - [x] Initialization of option `methods`
    - [x] Initialization of option `data`
    - [x] Initialization of options `computed`
    - [x] Initialization of options `watch`

- [ ] Component
  - [x] basic
  - [x] slot
  - [ ] scoped-slot
  - [ ] Keep-alive
  - [ ] functional
  - [ ] custom directive
  - [ ] async component

- [ ] Filter
- [ ] Directive
- [ ] Transition
  - [ ] Involve vnode hook `remove`

- [ ] Util
  - [x] nextTick

- [ ] Error Handling
  - [ ] Vue.config.errorHandle
  - [ ] RenderError
  - [ ] Vue.prototype.errorCapture

- [ ] Global-API
  - [x] Vue.extend
  - [x] Vue.mixin
    Behind the scene, method `mergeOptions` play a magnificent role in Vue.extend & Vue.mixin

- [ ] Compiler

## Sth Learned

### code style

- always execute user defined function in a try-catch block
