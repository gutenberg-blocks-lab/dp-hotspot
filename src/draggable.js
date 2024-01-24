import React from "react";
import { useDraggable } from "@dnd-kit/core";

const CustomStyle = {
  display: "flex",
  width: '50px',
  height: '50px',
  backgroundColor: 'lightblue',
  borderRadius: '8px',
  cursor: 'grab'
};

export function Draggable({ id, content, styles }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...CustomStyle, ...styles }}
      {...listeners}
      {...attributes}
    >
      {content}
    </div>
  );
}
