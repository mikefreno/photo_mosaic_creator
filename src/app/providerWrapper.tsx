"use client";

import { CanvasManager } from "@/classes/image";
import { CanvasContext } from "@/context/canvas";

export function ProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CanvasContext.Provider value={new CanvasManager()}>
      {children}
    </CanvasContext.Provider>
  );
}
