### render函数

本文大概过一遍render函数所做一些一些事情，不会深究到每个方法每个细节，只是记录一遍大概的流程，具体方法的具体细节后续记录

render函数位置在react-dom中的ReactDomLegacy文件中，函数最终返回legacyRenderSubtreeIntoContainer

```js
export function render(
  element: React$Element<any>, // 根组件 app
  container: Container, // 容器
  callback: ?Function, // 应用渲染结束后回调函数
) {
 	// 省略一些警告和开发模式相关内容
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback,
  );
}
```

然后进入到legacyRenderSubtreeIntoContainer方法中

```js
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>, // render中传null
  children: ReactNodeList, // App根组件
  container: Container, // 容器dom节点
  forceHydrate: boolean, // render中传false
  callback: ?Function, // render中的回调
) { 
  // 第一次渲染的时候 是一个原生dom节点 root为undefined
  let root: RootType = (container._reactRootContainer: any);
  let fiberRoot;
  // 首屏渲染会进入
  if (!root) {
    // 创建一个FiberRoot
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container, // 首屏渲染
      forceHydrate, // false
    );
    // root._internalRoot上保存着刚创建出来的FiberRootNode
    fiberRoot = root._internalRoot;
    // 涉及react上批量更新的概念
    unbatchedUpdates(() => {
      // 此时dom元素已经挂在到了页面上
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```

然后我们聚焦legacyCreateRootFromDOMContainer方法中这个方法创建了react项目的root，root上就存在一个current指针，负责切换我们的current Fiber树和workInProgress Fiber树，接下来是legacyCreateRootFromDOMContainer的代码

```js
function legacyCreateRootFromDOMContainer(
  container: Container, // 容器
  forceHydrate: boolean, // legacyRenderSubtreeIntoContainer首屏渲染传false
): RootType {
  // 服务端须渲染相关
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // 首先清除现有的内容。
  if (!shouldHydrate) {
    let warned = false;
    let rootSibling;
    while ((rootSibling = container.lastChild)) {
      container.removeChild(rootSibling);
    }
  }

  // this._internalRoot = createRootImpl(container, tag, options);
  return createLegacyRoot(
    container, // 容器
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}
```

方法会将我们的容器下所有的子dom节点全部清除，然后返回一个createLegacyRoot()函数，这个函数最终最终做这一步

```js
this._internalRoot = createRootImpl(container, tag, options);
```

所以最重要的方法是createRootImpl

```js
// createRootImpl目的是为了创建root,最终返回root
function createRootImpl(
  container: Container, // 首: app
  tag: RootTag, // 首: 0
  options: void | RootOptions, // 首: undefined
) {

  // 标签是LegacyRoot或Concurrent Root
  // 这一串变量不用管 都是false
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;
  const mutableSources =
    (options != null &&
      options.hydrationOptions != null &&
      options.hydrationOptions.mutableSources) ||
    null;
  // root被创建
  // 同时项目根的current指向了tag=3的根FiberRoot
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);
  // container上添加了一个__reactContainer属性 值是root.current
  // root.current  tag=3的根FiberRoot
  // 容器container dom
  markContainerAsRoot(root.current, container);
  const containerNodeType = container.nodeType;

 	// 省略部分首屏渲染无关的代码

  return root;
}

```

在此方法中比较重要的是createContainer的调用，返回了一个root，就是react根项目root，上有current指针，而createContainer里是返回了createFiberRoot方法，方法在react-reconciler包中ReactFiberRoot中

```js
// 创建根节点的root
// createRootImpl中最终root被创建所调用的函数
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag, // 0
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  // 项目的根root节点
  // current指针会在current Fiber树和workInProgress
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  if (enableSuspenseCallback) {
    root.hydrationCallbacks = hydrationCallbacks;
  }

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  // tag为3的root fiber节点
  // 项目根的current指向root fiber节点
  const uninitializedFiber = createHostRootFiber(tag);
  // root的current指针
  root.current = uninitializedFiber;
  // dom实例
  uninitializedFiber.stateNode = root;

  // tag为3的root fiber节点
  // updateQueue的updateQueue上放置了一个queue对象
  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```

在此方法中rootFiber被创建，且项目的根(fiberRootNode)的current指向了rootFiber，并且最终返回出去了fiberRootNode

然后顺着legacyRenderSubtreeIntoContainer方法继续往下走，走到时，看页面已经可以看到dom节点被挂载到了页面上，自此一个首屏渲染的大概流程就走完了

```js
unbatchedUpdates(() => {
  updateContainer(children, fiberRoot, parentComponent, callback);
});
```

对于unbatchedUpdates和updateContainer涉及一些批更新和更新优先级的东西，放到后面再进行解读