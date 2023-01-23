import { DOMAttributes, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";

export const VirtualList = (props: { dataSource: any[] }) => {
  const { dataSource } = props;
  const itemHeight = 50;
  const height = itemHeight * dataSource.length;

  const containerHeight = 300;
  const [startIndex, setStartIndex] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  let startIdx = Math.floor(scrollTop / itemHeight);
  let endIdx = Math.min(Math.floor((scrollTop + containerHeight) / itemHeight),dataSource.length -1);

  const displayItems = useMemo(() => {
    const items = [];
    for (let i = startIdx; i <= endIdx; i++) {
      items.push( <div
        className="item"
        key={i}
        style={{
          height: itemHeight,
          backgroundColor: i % 2 === 0 ? "burlywood" : "cadetblue",
        }}
      >
        {dataSource[i]}
      </div>);
    }
    return items
  },[dataSource,startIdx]);

  const onScroll = useCallback<DOMAttributes["onScroll"]>((content) => {
    const scrollTop = content.target.scrollTop;
    setScrollTop(scrollTop);
  }, []);

  return (
    <div style={{ maxHeight: containerHeight, overflowY: "auto",overflowAnchor:"none" }} onScroll={onScroll}>
      <div style={{ height: height }}>
        <div style={{ height: startIdx * itemHeight }}></div>
        {displayItems}
      </div>
    </div>
  );
};
