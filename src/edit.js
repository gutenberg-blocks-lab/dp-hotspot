// Edit.js

import React from "react";
import {
    useDroppable,
    DndContext,
    useDraggable,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { __ } from "@wordpress/i18n";
import {
    useBlockProps,
    InspectorControls,
    InnerBlocks,
} from "@wordpress/block-editor";
import {
    PanelBody,
    __experimentalNumberControl as NumberControl,
    Flex,
    Button,
} from "@wordpress/components";
import "./editor.scss";


function HotspotPoint({ id, style }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useDraggable({
            id: id.toString(),
        });

    const finalStyle = {
        ...style,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : "",
        transition,
    };

    return (
        <div
            className="hotspotPoint"
            ref={setNodeRef}
            style={finalStyle}
            {...attributes}
            {...listeners}
        >
            {id + 1} {/* Add 1 to id here */}
        </div>
    );
}



export default function Edit({ attributes, setAttributes }) {

     const { hotspotNumbers } = attributes;
     const sensors = useSensors(
         useSensor(PointerSensor),
         useSensor(KeyboardSensor)
     );

     const handleDragEnd = (event) => {
         const { active, over } = event;

         // Check if the draggable item is dropped over a valid target
         if (over && active.id !== over.id) {
             const oldIndex = hotspotNumbers.findIndex(
                 (hotspot) => hotspot.id === active.id
             );
             const newIndex = hotspotNumbers.findIndex(
                 (hotspot) => hotspot.id === over.id
             );

             // Update the order of hotspots
             const newHotspotNumbers = [...hotspotNumbers];
             newHotspotNumbers.splice(
                 newIndex,
                 0,
                 newHotspotNumbers.splice(oldIndex, 1)[0]
             );
             setAttributes({ hotspotNumbers: newHotspotNumbers });
         }
     };



    const addHotspotNumber = () => {
        const newHotspotNumber = { bottom: 0, left: 0 };
        setAttributes({
            hotspotNumbers: [...hotspotNumbers, newHotspotNumber],
        });
    };

    const updateHotspotNumber = (index, key, newValue) => {
        const newHotspotNumbers = [...hotspotNumbers];
        newHotspotNumbers[index] = {
            ...newHotspotNumbers[index],
            [key]: newValue,
        };
        setAttributes({ hotspotNumbers: newHotspotNumbers });
    };

    const removeHotspotNumber = (index) => {
        const updatedItems = hotspotNumbers.filter((_, i) => i !== index);
        setAttributes({ hotspotNumbers: updatedItems });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__("Position Settings", "dp-hotspot")}>
                    {hotspotNumbers.map((item, index) => (
                        <div key={index}>
                            <Flex>
                                <NumberControl
                                    label={__("Bottom (%)", "dp-hotspot")}
                                    value={item.bottom}
                                    onChange={(newBottom) =>
                                        updateHotspotNumber(
                                            index,
                                            "bottom",
                                            newBottom
                                        )
                                    }
                                />
                                <NumberControl
                                    label={__("Left (%)", "dp-hotspot")}
                                    value={item.left}
                                    onChange={(newLeft) =>
                                        updateHotspotNumber(
                                            index,
                                            "left",
                                            newLeft
                                        )
                                    }
                                />
                                <Button
                                    variant="tertiary"
                                    onClick={() => removeHotspotNumber(index)}
                                >
                                    Del
                                </Button>
                            </Flex>
                        </div>
                    ))}
                    <Button onClick={addHotspotNumber} variant="primary">
                        Add Hotspot
                    </Button>
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                <InnerBlocks />
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={hotspotNumbers}
                        strategy={verticalListSortingStrategy}
                    >
                        {hotspotNumbers.map((hotspot, index) => (
                            <HotspotPoint
                                key={index}
                                id={index}
                                style={{
                                    position: "absolute",
                                    bottom: `${hotspot.bottom}%`,
                                    left: `${hotspot.left}%`,
                                }}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </>
    );
}
