### Component

Component位于react包下ReactBaseClasses文件中

Component的主体代码量十分的少，主要是对`props`、`refs`、`context`进行一些初始化操作，以及内置了一个对象Updater，而Updater中的代码在react-dom包中，这么做的好处是方便多端渲染，比如在不同环境下只需要控制Updater的不同就可以控制渲染流程的不同，而Component主体还是原来的主体。

然后在后续的代码中，在原型对象上定义了`setSate`等一些方法，具体来看`setSate`

```js
Component.prototype.setState = function(partialState, callback) {
  // 类型判断 错误提醒
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  // 具体代码在react-dom中实现
  // 这么做的好处，方便多端
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

传入的两个参数

`partialState` setSate中新的state或者设置state的函数

`callback` state更新后的回调函数

首先进行了类型判断，然后给相应的错误提示

最重要是调用了

```js
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
```

enqueueSetState见名推断是一个更新方法，推断在更新队列中设置state(因为具体在吗在react-dom中实现，带着疑惑继续阅读源码，这里仅仅只是一个推断)

#### PureComponent

像hook中的memo，让子组件在Props改变的时候才进行一个渲染

```js
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

```

具体代码其实跟Component没什么差别，或者说PureComponent继承于Component

关键点在于这行代码，PureComponent被打上了一个标签，用于在后续渲染时进行一个判断，详细也等到解读react-dom包的时候再进行解读，届时会放上链接

```js
pureComponentPrototype.isPureReactComponent = true;
```

