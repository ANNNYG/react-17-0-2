# 本仓库用于记录react源码阅读的一些笔记

主要对react、react-dom、react-reconciler、scheduler等包进行阅读

在阅读过程中会在源码位置上添上相应注释

以及在doc文件夹下会对一些方法一些流程进行一个总结

本仓库仅用于自己的知识记录，欢迎一起讨论，有哪里理解不对也欢迎指出👏

持续更新中～～

以下是具体方法的doc

### 设计模式

在react16之前，并没有采用可中断的渲染模式，如果一次更新所需要的计算量大的话，造成一个页面的卡顿。

可以理解为，浏览器内有一套事件循环，每次渲染前会执行js，正常一套事件循环下来时间大概是16毫秒，如果js的计算量大的话，就会导致事件循环的时间增加，那么比如一次渲染从16毫秒增加到了500毫秒（打个比方）那么肉眼就会感知到卡顿。因为16之前的递归计算不可中断，所以当有大量的渲染任务的时候会导致js执行时常增加。

为了解决这个现象，react16推出了基于Fiber架构的可中断的递归，并且实现了一套调度器，会根据浏览器事件循环时间计算出当前js在渲染前可执行多久，等到了渲染时间会优先执行浏览器任务，然后在空闲时再继续执行js。

#### 双缓存机制

react内部会同时存在两个由Fiber节点组成的Fiber树，当前ui视图展示的是current Fiber树，同时在内存中会存在一个WorkInProgress Fiber树，react项目根会通过current指针指向current Fiber树，在WorkInProgress Fiber树创建完成可以渲染的时候，current指针改变指向指向WorkInProgress Fiber树，此时WorkInProgress Fiber树就变成了current Fiber树。



### 以下是react包中源码的解读
react包与调度和渲染无关，源码中会调用其他包的方法，等到解读该包时才会进行解读

[createElement](./doc/react/createElement.md)

[Component和PureComponent](./doc/react/component.md)

[createRef和forwardRef](./doc/react/createRef和forwardRef.md)

[lazy和Suspense](./doc/react/lazy和Suspense.md)

[children.map](./doc/react/mapChildren.md)

### 以下是对react-dom中源码的解读

react-dom中与渲染流程有关，我们熟悉的render函数就在这个包中，react渲染主要分为render阶段和commit阶段，具体两个阶段做了什么事情，会等读完react-dom后进行一个汇总

[render在首屏渲染的大概流程](./doc/react-dom/render.md)
