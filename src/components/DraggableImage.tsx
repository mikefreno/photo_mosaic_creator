import { Point } from "@/classes/helpers";
import { AcceptedImage } from "@/classes/image";
import React, { useRef, useState } from "react";

const DraggableImage = ({
  image,
  updateImage,
}: {
  image: AcceptedImage;
  updateImage: (image: AcceptedImage, position: Point) => void;
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [pointerOffset, setPointerOffset] = useState<{
    x: number;
    y: number;
  }>();

  const markPickUp = (e: React.MouseEvent) => {
    const rect = dragRef.current?.getBoundingClientRect();

    if (rect && e.clientX !== undefined && e.clientY !== undefined) {
      setPointerOffset({ x: e.clientX - rect.x, y: e.clientY - rect.y });
    }
  };

  const handleDrop = (e: React.MouseEvent) => {
    if (pointerOffset) {
      const newPos = new Point({
        x: e.clientX - pointerOffset.x,
        y: e.clientY - pointerOffset.y,
      });
      updateImage(image, newPos);
    }
  };

  return (
    <>
      <div
        ref={dragRef}
        onMouseDown={markPickUp}
        onDragEnd={handleDrop}
        className="mx-4"
        style={{
          height: `100px`,
          width: "auto",
          borderWidth: 2,
          borderColor: "red",
          minWidth: `${100 * image.aspectRatio}px`,
        }}
      >
        <img
          src={image.content}
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
          onError={(e) => {
            console.error("Error rendering image:", e);
          }}
        />
      </div>
      <button
        className="absolute w-2 h-2 top-0 z-50 right-0 rounded-full bg-red-400 text-black"
        onClick={() => console.log("delete")}
      >
        x
      </button>
    </>
  );
};

export default DraggableImage;
