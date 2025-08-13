"use client";
import React from "react";
import { Accept, DropEvent, FileRejection, useDropzone } from "react-dropzone";

export interface LocalImageSelectProps {
  onDrop: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent,
  ) => void;
  accept: Accept;
}

const LocalImageSelect = ({ onDrop, accept }: LocalImageSelectProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 100,
  });

  return (
    <div
      className={`z-10 my-4 h-36 w-1/3 mx-auto border border-dashed border-zinc-700 bg-transparent shadow-xl dark:border-zinc-100`}
      {...getRootProps()}
    >
      <label
        htmlFor="upload"
        className="flex cursor-pointer h-full text-center items-center justify-center"
      >
        <input className="dropzone-input" {...getInputProps()} />
        {isDragActive ? (
          <div className="">Drop File!</div>
        ) : (
          <>
            <span
              id="drop"
              className="text-md text-zinc-700 dark:text-zinc-400"
            >
              Upload Image(s)
              <br />
              <span className="text-sm">Click or drag</span>
            </span>
          </>
        )}
      </label>
    </div>
  );
};

export default LocalImageSelect;
