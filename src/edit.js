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
import { DndContext } from '@dnd-kit/core';
import DraggableHotspot from './DraggableHotspot'; // You will need to create this component

import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
    const { hotspotNumbers } = attributes;

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

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeIndex = parseInt(active.id.replace("hotspot-", ""), 10);

            // Get the container element
            const container = document.querySelector(
                ".wp-block-create-block-hotspot"
            );
            if (!container) {
                return; // Container not found
            }

            const newPosition = calculateNewPosition(event, container);

            // Update the hotspot's position
            const updatedHotspotNumbers = [...hotspotNumbers];
            updatedHotspotNumbers[activeIndex] = {
                ...updatedHotspotNumbers[activeIndex],
                bottom: newPosition.bottom,
                left: newPosition.left,
            };

            setAttributes({ hotspotNumbers: updatedHotspotNumbers });
        }
    };


    function calculateNewPosition(event, container) {
        // Get the container's dimensions
        const { width, height } = container.getBoundingClientRect();

        // Calculate the position of the drag event relative to the container
        // This is a simplified example. You'll need to adjust this based on how your drag event reports positions
        const x = event.clientX - container.offsetLeft;
        const y = event.clientY - container.offsetTop;

        // Convert the position to percentage
        const leftPercentage = (x / width) * 100;
        const bottomPercentage = ((height - y) / height) * 100;

        return {
            left: leftPercentage,
            bottom: bottomPercentage,
        };
    }


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
            <DndContext onDragEnd={handleDragEnd}>
                <div {...useBlockProps()}>
                    <InnerBlocks />
                    {hotspotNumbers.map((item, index) => (
                        <DraggableHotspot
                            key={index}
                            id={index}
                            bottom={item.bottom}
                            left={item.left}
                            className="hotspotPoint"
                        />
                    ))}
                </div>
            </DndContext>
        </>
    );
}
