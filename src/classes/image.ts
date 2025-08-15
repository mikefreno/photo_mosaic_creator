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

  constructor({
    AcceptedImage,
    position,
  }: {
    AcceptedImage: AcceptedImage;
    position: { x: number; y: number } | Point;
  }) {
    super({ ...AcceptedImage });
    this.position = position instanceof Point ? position : new Point(position);
    this.bounds = new Bounds(this.position, this.width, this.height);
  }
}
