import { AcceptedImage } from "@/types";
import React, { useRef, useState, useEffect } from "react";

export const MosaicCreator = ({ images }: { images: AcceptedImage[] }) => {
  const [mode, setMode] = useState<"setting" | "viewing">("viewing");
  const [currentLayout, setCurrentLayout] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [gridBlockSize, setGridBlockSize] = useState<number>(20);
  const [canvasDimensions, setCanvasDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 600, height: 800 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the grid on the canvas
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        drawGrid(
          ctx,
          canvasDimensions.width,
          canvasDimensions.height,
          gridBlockSize,
        );
      }
    }
  }, [gridBlockSize, canvasDimensions]);

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    blockSize: number,
  ) => {
    ctx.clearRect(0, 0, width, height); // Clear previous drawings

    ctx.strokeStyle = "#ddd"; // Light grey for grid lines
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = blockSize; x < width; x += blockSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = blockSize; y < height; y += blockSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

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
        Math.round(Math.max(200, newWidth) / gridBlockSize) * gridBlockSize;
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
    setGridBlockSize(newSize);

    // Snap the current canvas width to nearest multiple of new grid block size
    const snappedWidth = Math.round(canvasDimensions.width / newSize) * newSize;
    setCanvasDimensions((prevState) => ({
      ...prevState,
      width: snappedWidth,
    }));
  };

  return (
    <div className="flex items-center flex-col">
      <div className="py-2 flex flex-row">
        <label>Current Layout:</label>
        <input
          type="radio"
          name="currentLayout"
          value="desktop"
          checked={currentLayout === "desktop"}
          onChange={() => setCurrentLayout("desktop")}
          className="ml-2"
        />
        <label onClick={() => setCurrentLayout("desktop")} className="pl-2">
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
          checked={currentLayout === "mobile"}
          onChange={() => setCurrentLayout("mobile")}
        />
        <label onClick={() => setCurrentLayout("mobile")} className="pl-2">
          Mobile
        </label>
      </div>

      <div className="py-2 flex flex-row">
        <label>Mode:</label>
        <input
          type="radio"
          name="mode"
          value="setting"
          checked={mode === "setting"}
          onChange={() => setMode("setting")}
          className="ml-2"
        />
        <label onClick={() => setMode("setting")} className="pl-2">
          Setting
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
          value="testing"
          checked={mode === "viewing"}
          onChange={() => setMode("viewing")}
        />
        <label onClick={() => setMode("viewing")} className="pl-2">
          Viewing
        </label>
      </div>
      <div className="py-2">
        <label>
          Grid Size:
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={gridBlockSize}
            onChange={handleGridSizeChange}
          />
          {gridBlockSize}px
        </label>
      </div>

      {/* Canvas and Resizable Borders */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* Left border bar */}
        <div
          className="bg-red-200"
          style={{
            width: "20px",
            flexShrink: 0, // Prevent the bar from shrinking
            cursor: "ew-resize",
          }}
          onMouseDown={(e) => handleResize("left", e)}
        />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          style={{ border: "1px solid black" }}
        />

        {/* Right border bar */}
        <div
          className="bg-red-200"
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
