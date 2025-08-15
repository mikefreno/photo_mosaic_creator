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
  scalingFactor: number;
  base: HTMLImageElement;

  constructor(
    acceptedImage: AcceptedImage,
    position: Point,
    scalingFactor?: number,
  ) {
    super({ ...acceptedImage });
    this.position = position;
    this.scalingFactor = scalingFactor ?? 0.2;
    this.bounds = new Bounds(
      position,
      this.width * this.scalingFactor,
      this.height * this.scalingFactor,
    );

    const image = new Image();
    image.src = acceptedImage.content;
    this.base = image;
  }

  adjustScalingFactor(newScalar: number) {
    this.scalingFactor = newScalar;
    this.bounds = new Bounds(
      this.position,
      this.width * this.scalingFactor,
      this.height * this.scalingFactor,
    );
  }
}

export class CanvasManager {
  images: CanvasImage[] = [];
  tags: string[] = []; // lookup table
  bounds: Bounds | undefined;
  ctx: CanvasRenderingContext2D | undefined;
  blockSize: number = 20;

  get width() {
    return this.bounds ? this.bounds.right - this.bounds.left : 0;
  }

  get height() {
    return this.bounds ? this.bounds.bottom - this.bounds.top : 0;
  }

  setBounds(canvasBounds: Bounds) {
    this.bounds = canvasBounds;
  }

  setContext(ctx: CanvasRenderingContext2D | undefined) {
    if (ctx) {
      this.ctx = ctx;
    }
  }

  setBlockSize(size: number) {
    this.blockSize = size;
  }

  evaluateImages(images: CanvasImage[]) {
    for (const image of images) {
      if (!this.tags.includes(image.tag)) {
        this.addImage(image);
      }
    }
  }

  drawGrid() {
    if (!this.ctx || !this.bounds) return;

    this.ctx.strokeStyle = "#ddd"; // Light grey for grid lines
    this.ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = this.blockSize; x < this.width; x += this.blockSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = this.blockSize; y < this.height; y += this.blockSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }

  addImage(image: CanvasImage) {
    let inserted = false;
    for (let i = 0; i < this.images.length; i++) {
      if (image.position.z <= this.images[i].position.z) {
        this.images.splice(i, 0, image);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      this.images.push(image);
    }

    this.tags.push(image.tag);
  }

  draw() {
    if (!this.bounds || !this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawGrid();
    for (const image of this.images) {
      image.base.onload = () => {
        this.ctx!.drawImage(
          image.base,
          image.position!.x - this.bounds!.left,
          image.position!.y - this.bounds!.top,
          image.width * image.scalingFactor,
          image.height * image.scalingFactor,
        );
      };
      this.ctx.drawImage(image.base, image.position.x, image.position.y);
    }
  }
}
