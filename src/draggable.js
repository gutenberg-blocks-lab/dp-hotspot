import React from "react";
import { useDraggable } from "@dnd-kit/core";

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
      className="hotspotPoint"
      ref={setNodeRef}
      style={{ ...style, ...styles }}
      {...listeners}
      {...attributes}
    >
      {content}
    </div>
  );
}
