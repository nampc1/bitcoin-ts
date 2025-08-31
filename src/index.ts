class FieldElement {
  private _num: bigint;
  private _prime: bigint;

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
    if (d === 0n) {
      return n;
    }

    if (d < 0n) {
      throw new Error('d must be greater than 0');
    }

    return ((n % d) + d) % d;
  }
}

class Point {
  private x: bigint | null;
  private y: bigint | null;
  private a: bigint;
  private b: bigint;

  constructor(x: bigint| null, y: bigint | null, a: bigint, b: bigint) {
    Point.isOnCurve(x, y, a, b);

    this.a = a;
    this.b = b;
    this.x = x;
    this.y = y;
  }

  private static isOnCurve(x: bigint | null, y: bigint | null, a: bigint, b: bigint): void {
    if (x === null || y === null) {
      return;
    }

    if (y ** 2n !== x ** 3n + a * x + b) {
      throw new Error('Point is not on the curve');
    }
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
    Point.isOnCurve(other.x, other.y, other.a, other.b);

    if (this.x !== other.x) {
      const slope = (this.y - other.y) / (this.x - other.x);
      const x = slope ** 2n - this.x - other.x;
      const y = slope * (this.x - x) - this.y;

      return new Point(x, y, this.a, this.b);
    }
  }
}

function main() {
  const test = new FieldElement(7n, 13n);
  const test1 = new FieldElement(2n, 14n);
  const result = test.pow(-3n);
  console.log(result);
  console.log(test.div(test1));
}

main();
