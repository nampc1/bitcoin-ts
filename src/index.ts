class FieldElement {
  #num: number;
  #prime: number;

  constructor(num: number, prime: number) {
    if (num >= prime || num < 0) {
      throw Error(`Num ${num} is not in field range 0 to ${prime}`);
    }

    this.#num = num;
    this.#prime = prime;
  }

  get num() {
    return this.#num;
  }

  get prime() {
    return this.#prime;
  }

  eq(other: FieldElement): boolean {
    return this.#prime === other.#prime && this.#num === other.#num;
  }

  add(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw Error('Two elements are not in the same field');
    }

    return new FieldElement(
      Utils.modulo((this.num + other.num), this.prime),
      this.prime);
  }

  sub(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw Error('Two elements are not in the same field');
    }

    return new FieldElement(
      Utils.modulo((this.num - other.num), this.prime),
      this.prime);
  }

  mul(other: FieldElement): FieldElement {
    if (this.prime !== other.prime) {
      throw Error('Two elements are not in the same field');
    }

    return new FieldElement(
      Utils.modulo((this.num * other.num), this.prime),
      this.prime);
  }

  pow(exponent: number): FieldElement {
    return new FieldElement(
      Utils.modulo((this.num ** exponent), this.prime),
      this.prime);
  }


}

class Utils {
  static modulo(n: number, d: number) {
    if (d === 0) {
      return n;
    }
    if (d < 0) {
      return NaN;
    }
    return (n % d + d) % d;
  }
}

function main() {
  const test = new FieldElement(1, 2);
  const test1 = Utils.modulo(-27, 13);
  console.log(test1);
}

main();
