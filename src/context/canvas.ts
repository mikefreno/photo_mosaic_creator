"use client";

import { CanvasManager } from "@/classes/image";
import { createContext } from "react";

export const CanvasContext = createContext<CanvasManager | undefined>(
  undefined,
);
