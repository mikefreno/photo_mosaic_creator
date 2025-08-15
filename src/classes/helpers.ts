export class Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;

  constructor(top: number, right: number, bottom: number, left: number);
  constructor(point: Point, width: number, height: number);
  constructor({
    top,
    right,
    bottom,
    left,
  }: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  });
  constructor(
    arg1:
      | number
      | Point
      | { top: number; right: number; bottom: number; left: number },
    arg2?: number,
    arg3?: number,
    arg4?: number,
  ) {
    if (
      arg1 instanceof Point &&
      typeof arg2 === "number" &&
      typeof arg3 === "number"
    ) {
      this.left = arg1.x;
      this.top = arg1.y;
      this.right = arg1.x + arg2;
      this.bottom = arg1.y + arg3;
    } else if (
      typeof arg4 === "number" &&
      typeof arg2 === "number" &&
      typeof arg3 === "number"
    ) {
      this.top = arg1 as number;
      this.right = arg2 as number;
      this.bottom = arg3 as number;
      this.left = arg4 as number;
    } else if (typeof arg1 === "object") {
      const { top, right, bottom, left } = arg1 as {
        top: number;
        right: number;
        bottom: number;
        left: number;
      };
      this.top = top;
      this.right = right;
      this.bottom = bottom;
      this.left = left;
    } else {
      throw new Error("(Bounds) Invalid constructor arguments");
    }
  }

  contains(point: Point | undefined) {
    return point &&
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
      ? true
      : false;
  }
}

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number);
  constructor({ x, y }: { x: number; y: number });
  constructor(arg1: number | { x: number; y: number }, arg2?: number) {
    if (typeof arg1 === "object") {
      this.x = arg1.x;
      this.y = arg1.y;
    } else if (arg2) {
      this.x = arg1;
      this.y = arg2;
    } else {
      throw new Error("(Point)Missing y coordinate");
    }
  }

  isIn(bounds: Bounds | undefined) {
    return bounds &&
      this.x >= bounds.left &&
      this.x <= bounds.right &&
      this.y >= bounds.top &&
      this.y <= bounds.bottom
      ? true
      : false;
  }
}
