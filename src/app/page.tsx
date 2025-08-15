"use client";
import { Bounds, Point } from "@/classes/helpers";
import { AcceptedImage, CanvasImage } from "@/classes/Image";
import DraggableImage from "@/components/DraggableImage";
import Dropzone from "@/components/Dropzone";
import { MosaicCreator } from "@/components/MosaicCreator";
import { Reject } from "@/types";
import { useCallback, useState } from "react";
import { DropEvent, FileRejection } from "react-dropzone";

export default function Home() {
  const [acceptedImages, setAcceptedImages] = useState<AcceptedImage[]>([]);
  const [rejected, setRejected] = useState<Reject[]>([]);
  const [canvasBounds, setCanvasBounds] = useState<Bounds>();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[], _: DropEvent) => {
      for (const reject of fileRejections) {
        setRejected((prev) => [
          ...prev,
          {
            name: reject.file.name,
            reason: reject.errors
              .map((err) => `${err.message} (${err.code})`)
              .join(", "),
          },
        ]);
      }

      for (const file of acceptedFiles) {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result?.toString() ?? "";

            img.onload = () => {
              setAcceptedImages((prev) => [
                new AcceptedImage({
                  name: file.name,
                  content: img.src,
                  width: img.width,
                  height: img.height,
                }),
                ...prev,
              ]);
            };
            img.onerror = (error) => {
              console.error("Image load error:", error);
            };
          };
          reader.readAsDataURL(file);
        } else {
          console.log("File is not an image:", file.name);
        }
      }
    },
    [],
  );

  const updateImage = useCallback(
    (image: AcceptedImage, position: Point) => {
      if (position.isIn(canvasBounds)) {
        setAcceptedImages((prevImages) =>
          prevImages.map((img) =>
            img.tag === image.tag ? new CanvasImage(image, position) : img,
          ),
        );
      }
    },
    [canvasBounds, setAcceptedImages],
  );

  return (
    <div className="relative p-4">
      <Dropzone
        onDrop={onDrop}
        accept={{ "image/jpg": [], "image/jpeg": [], "image/png": [] }}
      />
      {acceptedImages.filter((img) => !(img instanceof CanvasImage)).length >
        0 && (
        <div>
          Available (Unassigned) Images:
          <div
            className="flex flex-row overflow-x-scroll"
            style={{ userSelect: "none" }}
          >
            {acceptedImages
              .filter((img) => img)
              .map((image, index) => (
                <DraggableImage
                  image={image}
                  key={index}
                  updateImage={updateImage}
                />
              ))}
          </div>
        </div>
      )}
      {rejected.length > 0 && (
        <div>
          Rejected Uploads:{" "}
          {rejected.map((reject) => `${reject.name} - ${reject.reason}`)}
        </div>
      )}
      {acceptedImages.length > 0 && (
        <MosaicCreator
          images={acceptedImages.filter((img) => img instanceof CanvasImage)}
          canvasBounds={canvasBounds}
          setCanvasBounds={setCanvasBounds}
        />
      )}
    </div>
  );
}
