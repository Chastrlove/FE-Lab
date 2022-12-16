const DragList = () => {
  return (
    <aside>
      <DragItem></DragItem>
      <DragItem></DragItem>
    </aside>
  );
};

const DragItem = () => {
  return <div style={{ cursor: "move", padding: 8, background: "red" }}>dragMe</div>;
};


const Content= ()=>{
  return <div style={{width:500,height:500,border:"1px solid"}}></div>
}

export const Main = () => {
  return (
    <main style={{display:"flex"}}>
      <DragList></DragList>
      <Content></Content>
    </main>
  );
};
