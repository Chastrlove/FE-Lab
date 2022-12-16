import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const defaultValue = {
  drawing: false,
  id: undefined,
  startPoint: undefined,
  endPoint: undefined,
};

function triggerDownload(imgURI) {
    var evt = new MouseEvent("click", {
        view: window,
        bubbles: false,
        cancelable: true,
    });

    var a = document.createElement("a");
    a.setAttribute("download", "MY_COOL_IMAGE.svg");
    a.setAttribute("href", imgURI);
    a.setAttribute("target", "_blank");

    a.dispatchEvent(evt);
}

const DrawSvg = () => {
  const svgRef = useRef<SVGElement>(null);

  const [drawList, setDrawList] = useState<{ id: number; path: React.ReactNode }[]>([]);

  const currentDrawRef = useRef<{
    drawing: boolean;
    id: number;
    offset?: { x: number; y: number };
    startPoint?: { x: number; y: number };
    endPoint?: { x: number; y: number };
    d?: string;
  }>({ ...defaultValue } as any);

  const ensureStartPoint = (event: MouseEvent) => {
    const { x, y } = event;

    const { x: svgX = 0, y: svgY = 0 } = svgRef.current?.getBoundingClientRect() || {};

    const id = Date.now();
    currentDrawRef.current.id = id;
    currentDrawRef.current.drawing = true;
    currentDrawRef.current.offset = {
      x: svgX,
      y: svgY,
    };
    currentDrawRef.current.startPoint = { x: x, y: y };
  };

  const drawLine = () => {
    const { startPoint, endPoint, d, offset } = currentDrawRef.current;

    if (startPoint && endPoint) {
      const { x, y } = startPoint;
      const { x: ex, y: ey } = endPoint;
      const { x: ox, y: oy } = offset;
      let newAttrd = `L ${ex - ox} ${ey - oy}`;
      if (d) {
        newAttrd = d + newAttrd;
      } else {
        newAttrd = `M ${x - ox} ${y - oy} ${newAttrd}`;
      }
      const path = (
        <g>
          <path d={newAttrd} fill="none" stroke="rgb(0, 0, 0)"></path>
        </g>
      );
      return [path, newAttrd];
    }
  };

  const stopDraw = useCallback(() => {
    currentDrawRef.current = { ...defaultValue };
  }, []);

  const drawIt = useCallback(
    (event: MouseEvent) => {
      const { x, y, clientX, clientY } = event;
      if (currentDrawRef.current.drawing) {
        currentDrawRef.current.endPoint = { x: x, y: y };
        const [path, d] = drawLine();
        currentDrawRef.current.d = d;
        if (path) {
          const findItem = drawList.find((item) => item.id === currentDrawRef.current.id);
          if (!findItem) {
            if (drawList.length === 0) {
              setDrawList([{ path: path, id: currentDrawRef.current.id }]);
            } else {
              setDrawList([...drawList, { path: path, id: currentDrawRef.current.id }]);
            }
          } else {
            setDrawList(
              drawList.map((item) => {
                if (item.id === currentDrawRef.current.id) {
                  return { path: path, id: currentDrawRef.current.id };
                }
                return item;
              }),
            );
          }
        }
      }
    },
    [drawList],
  );

  useEffect(() => {
    window.addEventListener("mousedown", ensureStartPoint);
    window.addEventListener("mousemove", drawIt);
    window.addEventListener("contextmenu", stopDraw);
    window.addEventListener("mouseup", stopDraw);
    return () => {
      window.removeEventListener("mousedown", ensureStartPoint);
      window.removeEventListener("mousemove", drawIt);
      window.removeEventListener("contextmenu", stopDraw);
      window.removeEventListener("mouseup", stopDraw);
    };
  }, [drawIt]);

  const resetAll = useCallback(() => {
    stopDraw();
    setDrawList([]);
  }, []);

  const onClick = useCallback(() => {
    var data = new XMLSerializer().serializeToString(svgRef.current);
    var DOMURL = window.URL || window.webkitURL || window;
    var svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    var url = DOMURL.createObjectURL(svgBlob);

      triggerDownload(url)
  }, []);

  return (
    <div style={{overflow:"hidden"}}>
      <div>
        <button onClick={onClick}>下载</button>
        <button onClick={resetAll}>清除</button>
      </div>
      <svg
        ref={svgRef}
        width={500}
        height={300}
        style={{ background: "ghostwhite" }}
      >
        {drawList.map((draw) => {
          return draw.path;
        })}
      </svg>
    </div>
  );
};

export default DrawSvg;
