import { describe, expect, test } from '@jest/globals';
import { Point, FieldElement } from '../src/index.js';

describe('elliptic curve', () => {
  const prime = 23n;
  const a = new FieldElement(1n, prime);
  const b = new FieldElement(1n, prime);

  // Curve: y^2 = x^3 + x + 1 over F_23

  describe('constructor and isOnCurve', () => {
    test('should create a valid point', () => {
      const p = Point.new(5n, 4n, a.num, b.num, prime);
      expect(p.x?.num).toBe(5n);
      expect(p.y?.num).toBe(4n);
      expect(p.a.eq(a)).toBe(true);
      expect(p.b.eq(b)).toBe(true);
      expect(p.isAtInfinity).toBe(false);
    });

    test('should throw for a point not on the curve', () => {
      // y^2 = 5^2 = 25 = 2 mod 23
      // x^3 + x + 1 = 5^3 + 5 + 1 = 131 = 16 mod 23
      // 2 != 16
      expect(() => Point.new(5n, 5n, a.num, b.num, prime)).toThrow('Invalid point');
    });

    test('should create a point at infinity', () => {
      const inf = Point.getPointAtInfinity(a, b);
      expect(inf.isAtInfinity).toBe(true);
      expect(inf.x).toBe(null);
      expect(inf.y).toBe(null);
    });
  });

  describe('eq', () => {
    test('should correctly compare points', () => {
      const p1 = Point.new(5n, 4n, a.num, b.num, prime);
      const p2 = Point.new(5n, 4n, a.num, b.num, prime);
      const p3 = Point.new(6n, 19n, a.num, b.num, prime);
      const inf = Point.getPointAtInfinity(a, b);

      expect(p1.eq(p2)).toBe(true);
      expect(p1.eq(p3)).toBe(false);
      expect(p1.eq(inf)).toBe(false);
      expect(inf.eq(p1)).toBe(false);
      expect(inf.eq(Point.getPointAtInfinity(a, b))).toBe(true);
    });
  });

  describe('add', () => {
    const p1 = Point.new(5n, 4n, a.num, b.num, prime);
    const p2 = Point.new(6n, 19n, a.num, b.num, prime);
    const p3 = Point.new(4n, 0n, a.num, b.num, prime);
    const inf = Point.getPointAtInfinity(a, b);

    test('should handle addition with identity (point at infinity)', () => {
      expect(p1.add(inf).eq(p1)).toBe(true);
      expect(inf.add(p1).eq(p1)).toBe(true);
    });

    test('should handle addition of inverses', () => {
      const p1_inverse = Point.new(5n, 19n, a.num, b.num, prime); // 19 = -4 mod 23
      expect(p1.add(p1_inverse).eq(inf)).toBe(true);
    });

    test('should handle point doubling when y=0', () => {
      // 2 * (4, 0) = infinity
      expect(p3.add(p3).eq(inf)).toBe(true);
    });

    test('should handle point doubling when y!=0', () => {
      // 2 * (5, 4) = (17, 20)
      const p_doubled = Point.new(17n, 20n, a.num, b.num, prime);
      expect(p1.add(p1).eq(p_doubled)).toBe(true);
    });

    test('should handle point addition (chord method)', () => {
      // (5, 4) + (6, 19) = (7, 12)
      const sum = Point.new(7n, 12n, a.num, b.num, prime);
      expect(p1.add(p2).eq(sum)).toBe(true);
    });

    test('should throw when adding points on different curves', () => {
      // Point (1, 2) is on y^2 = x^3 + 2x + 1
      const p_other_curve = Point.new(1n, 2n, 2n, 1n, prime);
      expect(() => p1.add(p_other_curve)).toThrow('Cannot add 2 points not on the same curve');
    });
  });

  describe('scalarMul', () => {
    const p1 = Point.new(5n, 4n, a.num, b.num, prime);
    const inf = Point.getPointAtInfinity(a, b);

    test('should handle multiplication by 0, returning the point at infinity', () => {
      const result = p1.scalarMul(0n);
      expect(result.eq(inf)).toBe(true);
      expect(result.isAtInfinity).toBe(true);
    });

    test('should handle multiplication by 1, returning the same point', () => {
      const result = p1.scalarMul(1n);
      expect(result.eq(p1)).toBe(true);
    });

    test('should calculate 2 * P correctly', () => {
      // 2 * (5, 4) = (17, 20)
      const expected = Point.new(17n, 20n, a.num, b.num, prime);
      const result = p1.scalarMul(2n);
      expect(result.eq(expected)).toBe(true);
    });

    test('should calculate 4 * P correctly', () => {
      // 4 * (5, 4) = 2 * (17, 20) = (13, 7)
      const expected = Point.new(13n, 7n, a.num, b.num, prime);
      const result = p1.scalarMul(4n);
      expect(result.eq(expected)).toBe(true);
    });

    test('should satisfy the distributive property: (n + m) * P = n*P + m*P', () => {
      const n = 3n;
      const m = 4n;
      const nP = p1.scalarMul(n);
      const mP = p1.scalarMul(m);
      expect(p1.scalarMul(n + m).eq(nP.add(mP))).toBe(true);
    });

    test('should satisfy the associative property: n * (m * P) = (n * m) * P', () => {
      const n = 3n;
      const m = 4n;
      const mP = p1.scalarMul(m);
      expect(mP.scalarMul(n).eq(p1.scalarMul(n * m))).toBe(true);
    });
  });
});