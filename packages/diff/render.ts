const vnode = {
  tag: "DIV",
  attrs: {
    id: "app",
  },
  children: [
    {
      tag: "SPAN",
      children: [
        {
          tag: "A",
          children: [],
        },
      ],
    },
    {
      tag: "SPAN",
      children: [
        {
          tag: "A",
          children: [],
        },
        {
          tag: "A",
          children: [],
        },
      ],
    },
  ],
};

function render(vnode) {
  const createElement = (node) => {
    const ele = document.createElement(node.tag);
    if(node.attrs){
      for (let attr of Object.keys(node.attrs)) {
        ele.setAttribute(attr, node.attrs[attr]);
      }
    }

    if (node.children) {
      for (let child of node.children) {
        const childEle = createElement(child);
        ele.appendChild(childEle);
      }
    }

    return ele;
  };
  return createElement(vnode);
}

console.log(render(vnode))
