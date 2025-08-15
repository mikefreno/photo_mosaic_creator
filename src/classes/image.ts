import { Point, Bounds } from "./helpers";

export class AcceptedImage {
  name: string;
  content: string;
  width: number;
  height: number;
  tag: string;
  aspectRatio: number;

  constructor({
    content,
    width,
    height,
    name,
  }: {
    content: string;
    width: number;
    height: number;
    name: string;
  }) {
    this.name = name;
    this.content = content;
    this.width = width;
    this.height = height;
    this.tag = `${name}-${Date.now()}`;
    this.aspectRatio = width / height;
  }
}

export class CanvasImage extends AcceptedImage {
  position: Point;
  bounds: Bounds;

  constructor(acceptedImage: AcceptedImage, position: Point) {
    super({ ...acceptedImage });
    this.position = position;
    this.bounds = new Bounds(position, this.width, this.height);
  }
}
