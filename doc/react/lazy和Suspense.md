## lazy和Suspense

lazy是一个异步加载组件的一个方法，可以通过结合Suspense组件来实现一个默认页（组件未加载完成之前显示），具体效果不做过多诠释。

在react包中lazy和Suspense的代码同样很简单，到了react-dom的时候再结合这两个组件进行一个更完全的解读，现在先解读react包中的源码

#### Lazy

lazy位于ReactLazy文件下，代码如下（去除开发环境相关代码）

```js
export function lazy<T>(
  ctor: () => Thenable<{default: T, ...}>,
): LazyComponent<T, Payload<T>> {
  const payload: Payload<T> = {
    // We use these fields to store the result.
    _status: -1,
    _result: ctor,
  };

  const lazyType: LazyComponent<T, Payload<T>> = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer,
  };

  return lazyType;
}
```

参数是一个Thenable对象，这里我们会传入`import("组件")`，然后定义了一个payload，payload的_result就是我们要引入的组件，最后返回lazyType对象

react包中的源码比较简单，但更多是要以后结合react-dom来观看，这里还是粗略介绍一下

#### **Suspense**

Suspense的源码在react包中只是定义了一个常量，具体还在react-dom中进行不同的处理

```js
export let REACT_SUSPENSE_TYPE = 0xead1;
```

