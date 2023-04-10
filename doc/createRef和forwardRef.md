# createRef和forwardRef

两个Api的用法这里不做过多描述

#### createRef

createRef位于react包下ReactCreateRef文件下，实现十分简单，代码如下(去除与开发模式相关的代码)

```js
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  
  return refObject;
}

```

可以看到就是返回一个refObject对象，其中有我们非常熟悉的current属性

#### forwardRef

forwardRef位于react包下ReactForWardRef下，实现同样十分简单，代码如下(去除与开发模式相关的代码)

```js
export function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) { 
  // $$typeof 并不是把component的$$typeof改为REACT_FORWARD_REF_TYPE
  // 而是ReactElement方法中返回的element的type修改为elementType对象
  // 通过React.createElement创建的节点的$$typeof永远都是REACT_ELEMENT_TYPE
  // render传进来的function Component
  const elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };

  return elementType;
}

```

函数最终返回elementType对象，值得注意的是其中两个属性，一个是render，一个是$$typeof

render就是我们传入的function Component，而`$$typeof`并不是并不是把component的`$$typeof`改为**`REACT_FORWARD_REF_TYPE`**，而是`ReactElement`(`createElement`方法中的最终返回)方法中返回的element的type修改为elementType对象，我们要记住的一点是，通过`React.createElement`创建的节点的`$$typeof`永远都是`REACT_ELEMENT_TYPE`
