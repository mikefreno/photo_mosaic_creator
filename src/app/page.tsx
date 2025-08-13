"use client";
import Dropzone from "@/components/Dropzone";
import { MosaicCreator } from "@/components/MosaicCreator";
import { AcceptedImage, Reject } from "@/types";
import { useCallback, useState } from "react";
import { DropEvent, FileRejection } from "react-dropzone";

export default function Home() {
  const [acceptedImages, setAcceptedImages] = useState<AcceptedImage[]>([]);
  const [rejected, setRejected] = useState<Reject[]>([]);

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
                ...prev,
                {
                  name: file.name,
                  content: reader.result,
                  aspectRatio,
                  width,
                  height,
                  showingInMosaic: false,
                },
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

  return (
    <div className="relative">
      <Dropzone
        onDrop={onDrop}
        accept={{ "image/jpg": [], "image/jpeg": [], "image/png": [] }}
      />
      {acceptedImages.length > 0 && (
        <div>
          Available (Unassigned) Images:
          <div
            className="flex flex-row overflow-x-auto"
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {acceptedImages.map((image, index) => (
              <div
                key={index}
                className="mx-4"
                style={{
                  height: `100px`,
                  width: `${100 * image.aspectRatio}px`,
                  minWidth: `${100 * image.aspectRatio}px`,
                }}
              >
                <img
                  src={image.content as string}
                  style={{ objectFit: "cover", height: "100%", width: "100%" }}
                  onError={(e) => {
                    console.error("Error rendering image:", e);
                  }}
                />
              </div>
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
      <MosaicCreator images={acceptedImages} />
    </div>
  );
}
