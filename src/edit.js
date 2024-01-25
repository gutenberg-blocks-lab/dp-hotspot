// Edit.js

import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";

import { __ } from "@wordpress/i18n";
import {
    useBlockProps,
    InspectorControls,
    InnerBlocks,
    PanelColorSettings,
} from "@wordpress/block-editor";
import {
    PanelBody,
    __experimentalNumberControl as NumberControl,
    Flex,
    Button,
} from "@wordpress/components";
import "./editor.scss";
import { Droppable } from "./droppable";
import { Draggable } from "./draggable";

export default function Edit({ attributes, setAttributes }) {
    const {
        hotspotNumbers,
        startNumber,
        hotspotBackgroundColor, // Add this line
        hotspotTextColor, // Add this line
    } = attributes;

    const droppableRef = useRef(null);

    const onChangeHotspotBackgroundColor = (color) => {
        setAttributes({ hotspotBackgroundColor: color });
    };

    const onChangeHotspotTextColor = (color) => {
        setAttributes({ hotspotTextColor: color });
    };

    const handleDragEnd = (event) => {
        const hotspot = hotspotNumbers.find((x) => x.id === event.active.id);

        hotspot.position.x += event.delta.x;
        hotspot.position.y += event.delta.y;

        if (droppableRef?.current) {
            const containerWidth = droppableRef.current.offsetWidth;
            const containerHeight = droppableRef.current.offsetHeight;

            // Round the values to two decimal places
            hotspot.left = parseFloat(
                ((hotspot.position.x / containerWidth) * 100).toFixed(2)
            );
            hotspot.top = parseFloat(
                ((hotspot.position.y / containerHeight) * 100).toFixed(2)
            );

            const _hotspotNumbers = hotspotNumbers.map((x) => {
                if (x.id === hotspot.id) return hotspot;
                return x;
            });

            setAttributes({ hotspotNumbers: _hotspotNumbers });
        }
    };


    const addHotspotNumber = () => {
        const newHotspotNumber = {
            id: `${startNumber + hotspotNumbers.length}`,
            content: `${startNumber + hotspotNumbers.length}`,
            position: { x: 0, y: 0 },
            left: 0,
            top: 0,
        };
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
        const updatedItems = hotspotNumbers
            .filter((_, i) => i !== index)
            .map((obj, i) => ({
                ...obj,
                id: `${startNumber + i}`,
                content: `${startNumber + i}`,
            }));
        setAttributes({ hotspotNumbers: updatedItems });
    };

    const handleStartNumberChange = (newStartNumber) => {
        const updatedStartNumber = parseInt(newStartNumber, 10) || 0;
        setAttributes({ startNumber: updatedStartNumber });

        // Update existing hotspots' IDs and contents
        const updatedHotspotNumbers = hotspotNumbers.map((hotspot, index) => ({
            ...hotspot,
            id: `${updatedStartNumber + index}`,
            content: `${updatedStartNumber + index}`,
        }));
        setAttributes({ hotspotNumbers: updatedHotspotNumbers });
    };

    return (
        <div {...useBlockProps()}>
          <div ref={droppableRef}>
            <InspectorControls>
                <PanelBody title={__("Position Settings", "dp-hotspot")}>
                    {hotspotNumbers.map((item, index) => (
                        <div key={index}>
                            <Flex>
                                <NumberControl
                                    label={__("Top (%)", "dp-hotspot")}
                                    value={item.top}
                                    onChange={(newTop) =>
                                        updateHotspotNumber(
                                            index,
                                            "top",
                                            newTop
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
                <PanelColorSettings
                    title={__("Hotspot Colors")}
                    colorSettings={[
                        {
                            value: hotspotBackgroundColor, // Now in scope
                            onChange: onChangeHotspotBackgroundColor,
                            label: __("Background Color"),
                        },
                        {
                            value: hotspotTextColor, // Now in scope
                            onChange: onChangeHotspotTextColor,
                            label: __("Text Color"),
                        },
                    ]}
                />
                <PanelBody title={__("Hotspot order", "dp-hotspot")}>
                    <NumberControl
                        label={__("Starting Number", "dp-hotspot")}
                        value={startNumber}
                        onChange={handleStartNumberChange}
                    />
                </PanelBody>
            </InspectorControls>

            <InnerBlocks />

            <DndContext onDragEnd={handleDragEnd}>
                <Droppable>
                    {hotspotNumbers.map((hotspot) => (
                        <Draggable
                            styles={{
                                position: "absolute",
                                top: `${hotspot.top}%`,
                                left: `${hotspot.left}%`,
                            }}
                            key={hotspot.id}
                            id={hotspot.id}
                            content={hotspot.content}
                            backgroundColor={hotspotBackgroundColor} // Pass the background color
                            textColor={hotspotTextColor} // Pass the text color
                        />
                    ))}
                </Droppable>
            </DndContext>
          </div>
        </div>
    );
}
