/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {REACT_FORWARD_REF_TYPE, REACT_MEMO_TYPE} from 'shared/ReactSymbols';

export function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) {
  // 开发环境相关
  if (__DEV__) {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      console.error(
        'forwardRef requires a render function but received a `memo` ' +
          'component. Instead of forwardRef(memo(...)), use ' +
          'memo(forwardRef(...)).',
      );
    } else if (typeof render !== 'function') {
      console.error(
        'forwardRef requires a render function but was given %s.',
        render === null ? 'null' : typeof render,
      );
    } else {
      if (render.length !== 0 && render.length !== 2) {
        console.error(
          'forwardRef render functions accept exactly two parameters: props and ref. %s',
          render.length === 1
            ? 'Did you forget to use the ref parameter?'
            : 'Any additional parameter will be undefined.',
        );
      }
    }

    if (render != null) {
      if (render.defaultProps != null || render.propTypes != null) {
        console.error(
          'forwardRef render functions do not support propTypes or defaultProps. ' +
            'Did you accidentally pass a React component?',
        );
      }
    }
  }

  // $$typeof 并不是把component的$$typeof改为REACT_FORWARD_REF_TYPE
  // 而是ReactElement方法中返回的element的type修改为elementType对象
  // 通过React.createElement创建的节点的$$typeof永远都是REACT_ELEMENT_TYPE
  // render传进来的function Component
  const elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };

  // 开发环境相关
  if (__DEV__) {
    let ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function() {
        return ownName;
      },
      set: function(name) {
        ownName = name;
        if (render.displayName == null) {
          render.displayName = name;
        }
      },
    });
  }
  return elementType;
}
