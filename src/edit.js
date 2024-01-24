// Edit.js

import React from "react";
import { DndContext } from "@dnd-kit/core";

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
import { Droppable } from "./droppable";
import { Draggable } from "./draggable";


export default function Edit({ attributes, setAttributes }) {
  const { hotspotNumbers } = attributes;

  const handleDragEnd = (event) => {
    const hotspot = hotspotNumbers.find((x) => x.id === event.active.id);
    hotspot.position.x += event.delta.x;
    hotspot.position.y += event.delta.y;
    hotspot.left = `${hotspot.position.x}`;
    hotspot.top = `${hotspot.position.y}`;

    const _hotspotNumbers = hotspotNumbers.map((x) => {
      if (x.id === hotspot.id) return hotspot;
      return x;
    });

    setAttributes({ hotspotNumbers: _hotspotNumbers });
  };

  const addHotspotNumber = () => {
    const newHotspotNumber = {
      id: `${hotspotNumbers?.length + 1}`,
      content: `${hotspotNumbers?.length + 1}`,
      position: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0
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
    const updatedItems = hotspotNumbers.filter((_, i) => i !== index).map((obj, i) => ({ ...obj, id: `${i + 1}`, content: `${i + 1}` }));
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
                  label={__("Top (px)", "dp-hotspot")}
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
                  label={__("Left (px)", "dp-hotspot")}
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

        <DndContext onDragEnd={handleDragEnd}>
          <Droppable>
            {hotspotNumbers.map((hotspot) => (
              <Draggable
                styles={{
                  position: "absolute",
                  top: `${hotspot.top}px`,
                  left: `${hotspot.left}px`
                }}
                key={hotspot.id}
                id={hotspot.id}
                content={hotspot.content}
              />
            ))}
          </Droppable>
        </DndContext>
      </div>
    </>
  );
}
