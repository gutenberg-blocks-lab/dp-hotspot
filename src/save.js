// save.js

import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
    const {
        hotspotNumbers,
        hotspotBackgroundColor,
        hotspotTextColor,
        startNumber,
    } = attributes;

    return (
        <div {...useBlockProps.save()}>
            <InnerBlocks.Content />
            {hotspotNumbers.map((hotspot, index) => (
                <div
                    key={index}
                    className="hotspotPoint"
                    style={{
                        position: "absolute",
                        top: `${hotspot.top}%`,
                        left: `${hotspot.left}%`,
                        backgroundColor: hotspotBackgroundColor, // Apply the background color
                        color: hotspotTextColor, // Apply the text color
                    }}
                >
                    {startNumber + index} {/* Use startNumber + index */}
                </div>
            ))}
        </div>
    );
}
