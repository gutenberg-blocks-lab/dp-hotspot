// Edit.js

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
                {hotspotNumbers.map((item, index) => (
                    <div
                        className="hotspotPoint"
                        key={index}
                        style={{
                            position: "absolute",
                            bottom: `${item.bottom}%`,
                            left: `${item.left}%`,
                        }}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </>
    );
}
