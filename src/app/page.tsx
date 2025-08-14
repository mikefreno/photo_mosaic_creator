"use client";
import DraggableImage from "@/components/DraggableImage";
import Dropzone from "@/components/Dropzone";
import { MosaicCreator } from "@/components/MosaicCreator";
import { AcceptedImage, Reject } from "@/types";
import { useCallback, useState } from "react";
import { DropEvent, FileRejection } from "react-dropzone";

export default function Home() {
  const [acceptedImages, setAcceptedImages] = useState<AcceptedImage[]>([]);
  const [rejected, setRejected] = useState<Reject[]>([]);
  const [canvasBounds, setCanvasBounds] = useState<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  }>();

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
            img.src = reader.result as string;

            img.onload = () => {
              const width = img.width;
              const height = img.height;
              const aspectRatio = width / height;

              setAcceptedImages((prev) => [
                {
                  name: file.name,
                  tag: `${file.name}-${Date.now()}`,
                  content: reader.result,
                  aspectRatio,
                  width,
                  height,
                  showingInMosaic: false,
                },
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
    (updatedImage: AcceptedImage) => {
      if (
        updatedImage.position &&
        canvasBounds &&
        updatedImage.position.x >= canvasBounds.left &&
        updatedImage.position.x <= canvasBounds.right &&
        updatedImage.position.y >= canvasBounds.top &&
        updatedImage.position.y <= canvasBounds.bottom
      ) {
        updatedImage.showingInMosaic = true;
      }

      setAcceptedImages((prevImages) =>
        prevImages.map((image) =>
          image.tag === updatedImage.tag
            ? { ...image, ...updatedImage }
            : image,
        ),
      );
    },
    [canvasBounds, setAcceptedImages],
  );

  return (
    <div className="relative p-4">
      <Dropzone
        onDrop={onDrop}
        accept={{ "image/jpg": [], "image/jpeg": [], "image/png": [] }}
      />
      {acceptedImages.filter((img) => !img.showingInMosaic).length > 0 && (
        <div>
          Available (Unassigned) Images:
          <div
            className="flex flex-row overflow-x-scroll"
            style={{ userSelect: "none" }}
          >
            {acceptedImages
              .filter((img) => !img.showingInMosaic)
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
          images={acceptedImages.filter((img) => img.showingInMosaic)}
          setCanvasBounds={setCanvasBounds}
        />
      )}
    </div>
  );
}
