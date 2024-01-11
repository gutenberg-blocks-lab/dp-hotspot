// Edit.js

import React, { useRef } from "react";
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

function HotspotPoint({ id, style, containerRef }) {
    // Convert percentage to pixels for initial position
    let initialX = 0,
        initialY = 0;
    if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        initialX = (style.left.replace("%", "") / 100) * containerWidth;
        initialY =
            ((100 - style.bottom.replace("%", "")) / 100) * containerHeight;
    }

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id.toString(),
        initialTransform: { x: initialX, y: initialY },
    });

    let finalStyle = style;
    if (transform) {
        const leftPercentage =
            (transform.x / containerRef.current.offsetWidth) * 100;
        const bottomFromTop =
            (transform.y / containerRef.current.offsetHeight) * 100;
        const bottomPercentage = 100 - bottomFromTop;

        finalStyle = {
            ...style,
            left: `${leftPercentage}%`,
            bottom: `${bottomPercentage}%`,
        };
    }

    return (
        <div
            className="hotspotPoint"
            ref={setNodeRef}
            style={finalStyle}
            {...attributes}
            {...listeners}
        >
            {id + 1}
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
        const { active, delta } = event;

        const activeIndex = hotspotNumbers.findIndex(
            (hotspot) => hotspot.id === active.id
        );

        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;

            const leftPercentage =
                ((active.rect.current.translated.left + delta.x) /
                    containerWidth) *
                100;
            const bottomPercentage =
                100 -
                ((active.rect.current.translated.top + delta.y) /
                    containerHeight) *
                    100;

            // Update the hotspot position
            updateHotspotNumber(activeIndex, "left", leftPercentage);
            updateHotspotNumber(activeIndex, "bottom", bottomPercentage);
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
    
    const containerRef = useRef(null); // Ref for the container

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
            <div {...useBlockProps()} ref={containerRef}>
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
                                containerRef={containerRef} 
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
