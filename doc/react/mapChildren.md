## mapChildren

mapChildren为React.Children.map方法，位于react包下ReactChildren文件中

代码如下

```js
function mapChildren(
  children: ?ReactNodeList, // 传入的Children
  func: MapFunc, // 传入的回调函数
  context: mixed,
): ?Array<React$Node> {
  if (children == null) {
    return children;
  }
  // 定义一个result数组
  const result = [];
  let count = 0;
  mapIntoArray(children, result, '', '', function(child) {
    return func.call(context, child, count++);
  });

  // 返回处理后的result
  return result;
}

```

react 17之前的代码还有实现一个对象池子来管理递归回调方法，避免在回调过程中一下创造过多的对象，回调结束后一下子删除，避免了一个内存的抖动。

可以看到就返回了一个处理后的数组，具体处理逻辑看`mapIntoArray`

`mapIntoArray`代码有点长，总的来说会判断当前传入的`children`是否是一个单独的节点，是的话直接调用传入的`callback`

否的话再对每一个节点进行便利然后递归调用`mapIntoArray`实现对一个多维数组的处理过程，然后将处理后的所有children push到传入的result数组里



