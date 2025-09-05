export class FieldElement {
  readonly _num: bigint;
  readonly _prime: bigint;

  constructor(num: bigint, prime: bigint) {
    if (num >= prime || num < 0) {
      throw new Error(`Num ${num} is not in field range 0 to ${prime}`);
    }

    this._num = num;
    this._prime = prime;
  }

  get num() {
    return this._num;
  }

  get prime() {
    return this._prime;
  }

  eq(other: FieldElement): boolean {
    return this._prime === other._prime && this._num === other._num;
  }

  add(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw new Error('Two elements are not in the same field');
    }

    return new FieldElement(
      Utils.modulo(this.num + other.num, this.prime),
      this.prime
    );
  }

  sub(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw new Error('Two elements are not in the same field');
    }

    return new FieldElement(
      Utils.modulo(this.num - other.num, this.prime),
      this.prime
    );
  }

  mul(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw new Error('Two elements are not in the same field');
    }

    return new FieldElement(
      Utils.modulo(this.num * other.num, this.prime),
      this.prime
    );
  }

  pow(exponent: bigint): FieldElement {
    const modifiedExponent = Utils.modulo(exponent, this.prime - 1n); // in case exponent is negative -> Fermat's theorem

    return new FieldElement(
      Utils.modulo(this.num ** modifiedExponent, this.prime),
      this.prime
    );
  }

  div(other: FieldElement) {
    if (this.prime !== other.prime) {
      throw new Error('Two elements are not in the same field');
    }

    return new FieldElement(
      Utils.modulo(this.num * other.num ** (this.prime - 2n), this.prime), // Fermat's theorem
      this.prime
    );
  }
}

class Utils {
  static modulo(n: bigint, d: bigint) {
    if (d <= 0n) {
      throw new Error('d must be greater than 0');
    }

    return ((n % d) + d) % d;
  }
}

export class Point {
  readonly _x: bigint | null;
  readonly _y: bigint | null;
  readonly _a: bigint;
  readonly _b: bigint;
  readonly _isAtInfinity: boolean;

  private constructor(x: bigint | null, y: bigint | null, a: bigint, b: bigint) {
    if (!Point.isOnCurve(x, y, a, b)) {
      throw new Error('Invalid point')
    }

    this._isAtInfinity = x === null && y === null;
    this._a = a;
    this._b = b;
    this._x = x;
    this._y = y;
  }

  public static getPointAtInfinity(a: bigint, b: bigint) {
    return new Point(null, null, a, b);
  }

  public static new(x: bigint, y: bigint, a: bigint, b: bigint) {
    return new Point(x, y, a, b);
  }

  get isAtInfinity() {
    return this._isAtInfinity;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get a() {
    return this._a;
  }

  get b() {
    return this._b;
  }

  private static isOnCurve(x: bigint | null, y: bigint | null, a: bigint, b: bigint): boolean {
    if (x === null && y === null) {
      return true;
    }

    if (x === null || y === null) {
      throw new Error('Point must have x and y');
    }

    if (y ** 2n === x ** 3n + a * x + b) {
      return true;
    }
    
    return false;
  }

  eq(other: Point) {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.a === other.a &&
      this.b === other.b
    );
  }

  add(other: Point) {
    if (!(this.a === other.a && this.b === other.b)) {
      throw new Error('Cannot add 2 points not on the same curve');
    }

    // addition with identity
    if (other.isAtInfinity) {
      return new Point(this.x, this.y, this.a, this.b);
    }

    if (this.isAtInfinity) {
      return new Point(other.x, other.y, other.a, other.b);
    }

    // point doubling
    if (this.eq(other)) {
      // the tangent line at point is vertical
      if (this.y === 0n) {
        return Point.getPointAtInfinity(this.a, this.b);
      }

      // the tangent line intersects the curve at point -2P
      const slope = (3n * this.x! ** 2n + this.a!) / (2n * this.y!)
      const x = slope ** 2n - 2n * this.x!;
      const y = slope * (this.x! - x) - this.y!;

      return new Point(x, y, this.a, this.b);
    }

    // addition of inverses
    if (this.x === other.x && this.y !== other.y) {
      return Point.getPointAtInfinity(this.a, this.b);
    }

    // chord method
    const slope = (this.y! - other.y!) / (this.x! - other.x!);
    const x = slope ** 2n - this.x! - other.x!;
    const y = slope * (this.x! - x) - this.y!;

    return new Point(x, y, this.a, this.b);
  }
}

function main() {
  // const test = new FieldElement(7n, 13n);
  // const test1 = new FieldElement(2n, 14n);
  // const result = test.pow(-3n);
  // console.log(result);
  // console.log(test.div(test1));

  // const point = Point.getPointAtInfinity();

  // console.log(point.isAtInfinity);
}

main();
