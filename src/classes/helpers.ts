export class Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;

  constructor(top: number, right: number, bottom: number, left: number);
  constructor(point: Point, width: number, height: number);
  constructor(arg1: number | Point, arg2: number, arg3: number, arg4?: number) {
    if (arg1 instanceof Point) {
      this.left = arg1.x;
      this.top = arg1.y;
      this.right = arg1.x + arg2;
      this.bottom = arg1.y + arg3;
    } else if (arg4) {
      this.top = arg1;
      this.right = arg2;
      this.bottom = arg3;
      this.left = arg4;
    } else {
      throw new Error("(Bounds)Left position is missing in constructor");
    }
  }
}

export class Point {
  x: number;
  y: number;
  constructor({ x, y }: { x: number; y: number }) {
    this.x = x;
    this.y = y;
  }
}
