import { useDraggable } from "@dnd-kit/core";

const DraggableHotspot = ({ id, bottom, left, className }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `hotspot-${id}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={className}
            style={{
                position: "absolute",
                bottom: `${bottom}%`,
                left: `${left}%`,
            }}
            {...listeners}
            {...attributes}
        >
            {id + 1}
        </div>
    );
};

export default DraggableHotspot;
