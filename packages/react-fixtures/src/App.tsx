import React, { useRef, useState } from "react";
import "./App.css";
import DrawSvg from "./esign";
import MyComponent from "./drag";
import { Main } from "./dragTable";
import { VirtualList } from "./virtualList";
import { Uploader } from "./tus/Upload";

const dataSource = new Array(100);
for (let i = 0; i < 100; i++) {
  dataSource[i] = i;
}

const DD = (props) => {
    const {setAA} = props;
    const [bb, setBB] = useState(1);
    return <button onClick={()=>{
        setBB(22);
        setAA(222)
    }
    }>{bb}</button>
};
function App() {
  return (
    <>
      <Uploader />
    </>
  );
}

export default App;
