// Edit.js

import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	__experimentalNumberControl as NumberControl,
	Flex,
	FlexBlock,
	FlexItem,
} from "@wordpress/components";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
	const { hotspotNumbers } = attributes;

	const addHotspotNumber = () => {
		const newHotspotNumber = { top: 0, left: 0 };
		setAttributes({ hotspotNumbers: [...hotspotNumbers, newHotspotNumber] });
	};

	const updateHotspotNumber = (index, updatedItem) => {
		const updatedItems = hotspotNumbers.map((item, i) =>
			index === i ? { ...item, ...updatedItem } : item,
		);
		setAttributes({ hotspotNumbers: updatedItems });
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
									label={__("Top", "dp-hotspot")}
									value={item.top}
									onChange={(newTop) =>
										updateHotspotNumber(index, { top: newTop })
									}
								/>
								<NumberControl
									label={__("Left", "dp-hotspot")}
									value={item.left}
									onChange={(newLeft) =>
										updateHotspotNumber(index, { left: newLeft })
									}
								/>
								<button onClick={() => removeHotspotNumber(index)}>
									Remove
								</button>
								</Flex>
							</div>
					))}
					<button onClick={addHotspotNumber}>Add Hotspot</button>
				</PanelBody>
			</InspectorControls>
			<p {...useBlockProps()}>
				{__("Dp Hotspot – hello from the editor!", "dp-hotspot")}
			</p>
		</>
	);
}
