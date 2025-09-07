export class FieldElement {
  readonly num: bigint;
  readonly prime: bigint;

  constructor(num: bigint, prime: bigint) {
    if (num >= prime || num < 0) {
      throw new Error(`Num ${num} is not in field range 0 to ${prime}`);
    }

    this.num = num;
    this.prime = prime;
  }

  eq(other: FieldElement): boolean {
    return this.prime === other.prime && this.num === other.num;
  }

  eqInt(other: bigint): boolean {
    return this.num === other;
  }

  add(other: FieldElement): FieldElement {
    this.checkSameField(other);

    return new FieldElement(
      Utils.modulo(this.num + other.num, this.prime),
      this.prime
    );
  }

  addInt(other: bigint): FieldElement {
    return new FieldElement(
      Utils.modulo(this.num + other, this.prime),
      this.prime
    );
  }

  sub(other: FieldElement): FieldElement {
    this.checkSameField(other);

    return new FieldElement(
      Utils.modulo(this.num - other.num, this.prime),
      this.prime
    );
  }

  subInt(other: bigint): FieldElement {
    return new FieldElement(
      Utils.modulo(this.num - other, this.prime),
      this.prime
    );
  }

  mul(other: FieldElement): FieldElement {
    this.checkSameField(other);

    return new FieldElement(
      Utils.modulo(this.num * other.num, this.prime),
      this.prime
    );
  }

  mulInt(other: bigint): FieldElement {
    return new FieldElement(
      Utils.modulo(this.num * other, this.prime),
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

  div(other: FieldElement): FieldElement {
    this.checkSameField(other);

    if (other.num === 0n) {
      throw new Error('Division by zero');
    }

    return new FieldElement(
      Utils.modulo(this.num * other.num ** (this.prime - 2n), this.prime), // Fermat's theorem
      this.prime
    );
  }

  divInt(other: bigint): FieldElement {
    if (other === 0n) {
      throw new Error('Division by zero');
    }

    return new FieldElement(
      Utils.modulo(this.num * other ** (this.prime - 2n), this.prime), // Fermat's theorem
      this.prime
    );
  }

  private checkSameField(other: FieldElement) {
    if (this.prime !== other.prime) {
      throw new Error('Two elements are not in the same field');
    }
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
  readonly x: FieldElement | null;
  readonly y: FieldElement | null;
  readonly a: FieldElement;
  readonly b: FieldElement;
  readonly isAtInfinity: boolean;

  private constructor(x: FieldElement | null, y: FieldElement | null, a: FieldElement, b: FieldElement) {
    if (!Point.isOnCurve(x, y, a, b)) {
      throw new Error('Invalid point')
    }

    this.isAtInfinity = x === null && y === null;
    this.a = a;
    this.b = b;
    this.x = x;
    this.y = y;
  }

  public static getPointAtInfinity(a: FieldElement, b: FieldElement) {
    return new Point(null, null, a, b);
  }

  public static new(x: bigint, y: bigint, a: bigint, b: bigint, prime: bigint) { // pass prime so we don't have to check x, y, a, b are in the same field
    const aElement = new FieldElement(a, prime);
    const bElement = new FieldElement(b, prime);
    const xElement = new FieldElement(x, prime);
    const yElement = new FieldElement(y, prime);

    return new Point(xElement, yElement, aElement, bElement);
  }

  private static isOnCurve(x: FieldElement | null, y: FieldElement | null, a: FieldElement, b: FieldElement): boolean {
    if (x === null && y === null) {
      return true;
    }

    if (x === null || y === null) {
      throw new Error('Point cannot have x or y be null');
    }

    if (y.pow(2n).eq(x.pow(3n).add(x.mul(a)).add(b))) {
      return true;
    }
    
    return false;
  }

  eq(other: Point) {
    if (this.isAtInfinity && other.isAtInfinity) {
      return true;
    }

    if (this.isAtInfinity || other.isAtInfinity) {
      return false;
    }

    return (
      this.x?.eq(other.x!) &&
      this.y?.eq(other.y!) &&
      this.a.eq(other.a) &&
      this.b.eq(other.b)
    );
  }

  add(other: Point): Point {
    if (!this.a.eq(other.a) || !this.b.eq(other.b)) {
      throw new Error('Cannot add 2 points not on the same curve');
    }

    // case 1: self + infinity = self
    if (other.isAtInfinity) {
      return this;
    }

    // case 2: infinity + other = other
    if (this.isAtInfinity) {
      return other;
    }

    // now, neither point is at infinity.

    // case 3: self.x == other.x and self.y == -other.y
    // self is the inverse of other, so the result is infinity.
    // this check also prevents division by zero in the chord method.
    if (this.x!.eq(other.x!) && this.y!.add(other.y!).eqInt(0n)) {
      return Point.getPointAtInfinity(this.a, this.b);
    }

    // case 4: self == other (point doubling)
    if (this.eq(other)) {
      // the tangent line at point is vertical
      if (this.y!.num === 0n) {
        return Point.getPointAtInfinity(this.a, this.b);
      }

      // the tangent line intersects the curve at point -2P
      // slope = (3 * x1^2 + a) / (2 * y1)
      const slope = this.x!.pow(2n).mulInt(3n).add(this.a).div(this.y!.mulInt(2n));
      // x3 = slope^2 - 2*x1
      const x = slope.pow(2n).sub(this.x!.mulInt(2n));
      // y3 = slope * (x1 - x3) - y1
      const y = slope.mul(this.x!.sub(x)).sub(this.y!);

      return new Point(x, y, this.a, this.b);
    }

    // Case 5: self.x != other.x (chord method)
    const slope = this.y!.sub(other.y!).div(this.x!.sub(other.x!));
    const x = slope.pow(2n).sub(this.x!).sub(other.x!);
    const y = slope.mul(this.x!.sub(x)).sub(this.y!);

    return new Point(x, y, this.a, this.b);
  }
}
