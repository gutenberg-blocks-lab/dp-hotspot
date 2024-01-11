// save.js

import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
    const { hotspotNumbers } = attributes;

    return (
        <div {...useBlockProps.save()}>
            <InnerBlocks.Content />
            {hotspotNumbers.map((hotspot, index) => (
                <div
                    key={index}
                    className="hotspotPoint"
                    style={{
                        position: "absolute",
                        bottom: `${hotspot.bottom}%`,
                        left: `${hotspot.left}%`,
                    }}
                >
                    {index + 1}
                </div>
            ))}
        </div>
    );
}
