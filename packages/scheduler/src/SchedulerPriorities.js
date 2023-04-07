/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type PriorityLevel = 0 | 1 | 2 | 3 | 4 | 5;

// TODO: Use symbols?
// react更新优先级
export const NoPriority = 0; // 无优先级
export const ImmediatePriority = 1; // 最高优先级，立即执行
export const UserBlockingPriority = 2; // 用户触发的更新
export const NormalPriority = 3; // 一般优先级，最常见
export const LowPriority = 4; // 低优先级
export const IdlePriority = 5; // 空闲优先级
 