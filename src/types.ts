export interface AcceptedImage {
  name: string;
  content: string | ArrayBuffer | null;
  tag: string;
  aspectRatio: number;
  width: number;
  height: number;
  showingInMosaic: boolean;
  position?: { x: number; y: number };
}

export interface Reject {
  name: string;
  reason: string;
}
