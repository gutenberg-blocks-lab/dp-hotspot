import React from "react";
import { useDraggable } from "@dnd-kit/core";

export function Draggable({ id, content, styles, backgroundColor, textColor }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const combinedStyles = {
        ...styles,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        backgroundColor, // Use the passed background color
        color: textColor, // Use the passed text color
    };

    return (
        <div
            className="hotspotPoint"
            ref={setNodeRef}
            style={combinedStyles}
            {...listeners}
            {...attributes}
        >
            {content}
        </div>
    );
}

