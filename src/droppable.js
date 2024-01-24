import React from "react";
import { useDroppable } from "@dnd-kit/core";

const CustomStyle = {
  display: "flex",
};

export function Droppable({ children }) {
  const { setNodeRef } = useDroppable({
    id: "droppable"
  });

  return (
    <div ref={setNodeRef} style={{ ...CustomStyle }}>
      {children}
    </div>
  );
}
