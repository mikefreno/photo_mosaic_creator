import { Bounds } from "@/classes/helpers";
import { CanvasImage } from "@/classes/image";
import { CanvasContext } from "@/context/canvas";
import { Layout, Mode } from "@/types";
import React, { useRef, useState, useEffect, useContext } from "react";

export const MosaicCreator = ({ images }: { images: CanvasImage[] }) => {
  const manager = useContext(CanvasContext)!;
  const [canvasDimensions, setCanvasDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 600, height: 800 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredImage, setHoveredImage] = useState<CanvasImage | null>(null);

  // Draw the grid on the canvas
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        manager.setContext(ctx);
        manager.draw();
      }
    }
  }, [manager.blockSize, canvasDimensions]);

  useEffect(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const bounds = new Bounds({
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      });

      manager.setBounds(bounds);
    }
  }, [canvasDimensions]);

  useEffect(() => {
    manager.evaluateImages(images);
    manager.draw();
  }, [images, canvasRef]);

  // Handle resizing of the canvas and snapping to grid size
  const handleResize = (
    direction: "left" | "right",
    event: React.MouseEvent,
  ) => {
    let initialWidth = canvasDimensions.width;
    const initialClientX = event.clientX;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let newWidth;
      if (direction === "left") {
        // Resize left border
        newWidth = initialWidth + (initialClientX - moveEvent.clientX);
      } else {
        // Resize right border
        newWidth = initialWidth + (moveEvent.clientX - initialClientX); // Adjust to fit within window width minus border widths
      }

      // Snap to nearest grid multiple
      const snappedWidth =
        Math.round(Math.max(200, newWidth) / manager.blockSize) *
        manager.blockSize;
      setCanvasDimensions((prevState) => ({
        ...prevState,
        width: snappedWidth,
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Handle changes to grid size via slider
  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(event.target.value);
    manager.setBlockSize(newSize);

    // Snap the current canvas width to nearest multiple of new grid block size
    const snappedWidth = Math.round(canvasDimensions.width / newSize) * newSize;
    setCanvasDimensions((prevState) => ({
      ...prevState,
      width: snappedWidth,
    }));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {};

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!manager.bounds) return;
    for (const image of images) {
      if (
        image.bounds.contains({
          x: e.clientX,
          y: e.clientY,
        })
      ) {
        setHoveredImage(image);
      }
    }
  };

  return (
    <div className="flex items-center flex-col">
      <div className="py-2 flex flex-row">
        <label>Current Layout:</label>
        <input
          type="radio"
          name="currentLayout"
          value="desktop"
          checked={manager.layout === Layout.DESKTOP}
          onChange={() => manager.setLayout(Layout.DESKTOP)}
          className="ml-2"
        />
        <label
          onClick={() => manager.setLayout(Layout.DESKTOP)}
          className="pl-2"
        >
          Desktop
        </label>
        <div
          className="bg-gray-800 mx-2"
          style={{
            width: "2px",
            flexShrink: 0,
          }}
        />
        <input
          type="radio"
          name="currentLayout"
          value="mobile"
          checked={manager.layout === Layout.MOBILE}
          onChange={() => manager.setLayout(Layout.MOBILE)}
          className="ml-2"
        />
        <label
          onClick={() => manager.setLayout(Layout.MOBILE)}
          className="pl-2"
        >
          Mobile
        </label>
      </div>

      <div className="py-2 flex flex-row">
        <label>Mode:</label>
        <input
          type="radio"
          name="mode"
          value="editing"
          checked={manager.mode === Mode.EDITING}
          onChange={() => manager.setMode(Mode.EDITING)}
          className="ml-2"
        />
        <label onClick={() => manager.setMode(Mode.EDITING)} className="pl-2">
          Editing
        </label>
        <div
          className="bg-gray-800 mx-2"
          style={{
            width: "2px",
            flexShrink: 0,
          }}
        />
        <input
          type="radio"
          name="mode"
          value="preview"
          checked={manager.mode === Mode.PREVIEW}
          onChange={() => manager.setMode(Mode.PREVIEW)}
          className="ml-2"
        />
        <label onClick={() => manager.setMode(Mode.PREVIEW)} className="pl-2">
          Preview
        </label>
      </div>
      <div className="py-2 flex flex-row">
        <label>Grid Snapping:</label>
        <input
          type="checkbox"
          checked={manager.snapping}
          onChange={() => manager.setSnapping(!manager.snapping)}
          className="mx-1"
        />
      </div>
      <div className="py-2 flex flex-row">
        <label>Grid Size:</label>
        <input
          type="range"
          min="10"
          max="50"
          step="5"
          value={manager.blockSize}
          onChange={handleGridSizeChange}
          className="mx-1"
        />
        <label>{manager.blockSize}px</label>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* Left border bar */}
        <div
          className="bg-gray-300"
          style={{
            width: "20px",
            flexShrink: 0, // Prevent the bar from shrinking
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => handleResize("left", e)}
        />

        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          style={{ border: "1px solid black" }}
        />

        {/* Right border bar */}
        <div
          className="bg-gray-300"
          style={{
            width: "20px",
            flexShrink: 0, // Prevent the bar from shrinking
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => handleResize("right", e)}
        />
      </div>
    </div>
  );
};
