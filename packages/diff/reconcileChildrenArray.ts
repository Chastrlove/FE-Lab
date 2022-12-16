type Flag = "Placement" | "Deletion";
interface Fiber {
  key: string;
  type: string;
  flag?: Flag;
  index?: number;
}

interface ReactElement {
  key: string;
  type: string;
}

type ReactFiberList = Fiber[];


const before: ReactFiberList = [
  { key: "a", type: "1", index: 0 },
  { key: "b", type: "1", index: 1 },
  { key: "c", type: "1", index: 2 },
  { key: "d", type: "1", index: 3 },
];

const after: ReactElement[] = [
  { key: "f", type: "1" },
  { key: "d", type: "1" },
  { key: "a", type: "1" },
  { key: "b", type: "2" },
  { key: "c", type: "2" },
];

const after1: ReactElement[] = [
  { key: "a", type: "1" },
  { key: "b", type: "1" },
  { key: "d", type: "1" },
  { key: "c", type: "1" },
  { key: "e", type: "1" },
];

const after2: ReactElement[] = [
  { key: "a", type: "1" },
  { key: "b", type: "1" },
  { key: "c", type: "1" },
  { key: "d", type: "2" },
];



/**
 *
 * @param lastPlacedIndex 上一个被复用的fiber在原有children中的index
 * @param newChild,新的ReactElement
 * @param copiedItem 被复用的fiber
 */
const placeChild = (lastPlacedIndex: number, newChild: Fiber, copiedItem?: Fiber) => {
  if (copiedItem && copiedItem.type !== newChild.type) {
    copiedItem.flag = "Deletion";
    newChild.flag = "Placement";
    return lastPlacedIndex;
  } else {
    //如果当前当前fiber的复用节点index小于已经被复用的节点的index（这里的index指的都是旧的children中的index）,则执行移动，若大于则保持不动
    const beforeIndex = copiedItem?.index;
    if (!copiedItem || lastPlacedIndex > beforeIndex) {
      newChild.flag = "Placement";
      return lastPlacedIndex;
    } else {
      return beforeIndex;
    }
  }
};

const createFiber = (element: ReactElement): Fiber => {
  return {
    ...element,
  };
};


const diff = (before: ReactFiberList, newChildren: ReactElement[]) => {
  const fiberList = []; //react自己是链表
  let newIdx = 0;
  let oldFiber = before[0];
  let lastPlacedIndex = 0;

  /*  第一次循环: 遍历最长公共序列(key 相同), 公共序列的节点都视为可复用
      如果newChildren序列被遍历完, 那么oldFiber序列中剩余节点都视为删除(打上Deletion标记)
      如果oldFiber序列被遍历完, 那么newChildren序列中剩余节点都视为新增(打上Placement标记)
  */
  for (; oldFiber && newIdx < newChildren.length; newIdx++) {
    const newChild = newChildren[newIdx];
    const currentChild = before[newIdx];
    if (currentChild.key !== newChild.key) {
      break;
    }
    const newFiber = createFiber(newChild);
    lastPlacedIndex = placeChild(lastPlacedIndex, newFiber, currentChild);
    fiberList.push(newFiber);
    oldFiber = before[newIdx + 1];
  }

  if (newIdx === newChildren.length - 1) {
    if (newIdx < before.length - 1) {
      for (let i = newIdx; i < before.length; i++) {
        before[i].flag = "Deletion";
      }
    }
    return fiberList;
  }

  if (oldFiber === null) {
    for (let i = newIdx; i < newChildren.length; i++) {
      const newFiber = createFiber(newChildren[newIdx]);
      lastPlacedIndex = placeChild(lastPlacedIndex, newFiber);
      fiberList.push(newFiber);
    }
    return fiberList;
  }

  const beforeMap = new Map();
  for (let i = newIdx; i < before.length; i++) {
    const node = before[i];
    beforeMap.set(node.key || i, node);
  }

  /*  第二次循环: 遍历剩余非公共序列, 优先复用 oldFiber 序列中的节点
      在对比更新阶段(非初次创建fiber, 此时shouldTrackSideEffects被设置为true). 第二次循环遍历完成之后, oldFiber序列中没有匹配上的节点都视为删除(打上Deletion标记)
  */
  for (; newIdx < newChildren.length; newIdx++) {
    const newChild = newChildren[newIdx];
    const beforeItem = beforeMap.get(newChild.key || newIdx);
    const newFiber = createFiber(newChild);
    lastPlacedIndex = placeChild(lastPlacedIndex, newFiber, beforeItem);
    fiberList.push(newFiber);
    beforeMap.delete(newChild.key || newIdx);
  }

  beforeMap.forEach((node) => {
    node.flag = "Deletion";
  });
  return fiberList;
};
const fiberList = diff(before, after);
console.log(before, fiberList);
