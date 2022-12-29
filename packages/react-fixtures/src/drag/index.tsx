import React, {useState} from 'react';
import {DndContext} from "@dnd-kit/core";
import {Draggable} from "./Draggable";
import {Droppable} from "./Droppable";

const MyComponent = () => {
    const containers = ['A', 'B', 'C'];
    const [parent, setParent] = useState(null);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Draggable id="draggable">Drag me</Draggable>
            <Draggable id="draggable1">Drag me</Draggable>
            <Droppable id={'drop'}>
                Drop here
            </Droppable>
        </DndContext>
    );

    function handleDragEnd(event) {
        const {over} = event;

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        setParent(over ? over.id : null);
    }
};

export default MyComponent;