import { describe, expect, test } from '@jest/globals';
import { FieldElement } from '../src/index.js';

describe('finite field', () => {
    test('constructor', () => {
        expect(() => new FieldElement(13n, 13n)).toThrow('Num 13 is not in field range 0 to 13');
        expect(() => new FieldElement(-1n, 13n)).toThrow('Num -1 is not in field range 0 to 13');
        const el = new FieldElement(12n, 13n);
        expect(el.num).toBe(12n);
        expect(el.prime).toBe(13n);
    });

    test('eq and eqInt', () => {
        const el1 = new FieldElement(7n, 13n);
        const el2 = new FieldElement(7n, 13n);
        const el3 = new FieldElement(8n, 13n);
        const el4 = new FieldElement(7n, 17n);

        expect(el1.eq(el2)).toBe(true);
        expect(el1.eq(el3)).toBe(false);
        expect(el1.eq(el4)).toBe(false);
        expect(el1.eqInt(7n)).toBe(true);
        expect(el1.eqInt(8n)).toBe(false);
    });

    test('add', () => {
        const element1 = new FieldElement(7n, 13n);
        const element2 = new FieldElement(4n, 7n);
        const element3 = new FieldElement(12n, 13n);
        const element4 = new FieldElement(6n, 13n);

        expect(() => element1.add(element2)).toThrow('Two elements are not in the same field');

        const sum1 = element1.add(element3);
        expect(sum1.eq(new FieldElement(6n, 13n))).toBe(true); // (7+12)%13 = 19%13 = 6

        const sum2 = element1.add(element4);
        expect(sum2.eq(new FieldElement(0n, 13n))).toBe(true); // (7+6)%13 = 13%13 = 0
    });

    test('addInt', () => {
        const el = new FieldElement(7n, 13n);
        const sum = el.addInt(12n);
        expect(sum.eq(new FieldElement(6n, 13n))).toBe(true);
    });

    test('sub', () => {
        const element1 = new FieldElement(7n, 13n);
        const element2 = new FieldElement(12n, 13n);
        const element3 = new FieldElement(4n, 7n);

        expect(() => element1.sub(element3)).toThrow('Two elements are not in the same field');

        const diff1 = element1.sub(element2);
        expect(diff1.eq(new FieldElement(8n, 13n))).toBe(true); // (7-12)%13 = -5%13 = 8
    });

    test('subInt', () => {
        const el = new FieldElement(7n, 13n);
        const diff = el.subInt(12n);
        expect(diff.eq(new FieldElement(8n, 13n))).toBe(true);
    });

    test('mul', () => {
        const element1 = new FieldElement(7n, 13n);
        const element2 = new FieldElement(12n, 13n);
        const element3 = new FieldElement(4n, 7n);

        expect(() => element1.mul(element3)).toThrow('Two elements are not in the same field');

        const prod = element1.mul(element2);
        expect(prod.eq(new FieldElement(6n, 13n))).toBe(true); // (7*12)%13 = 84%13 = 6
    });

    test('mulInt', () => {
        const el = new FieldElement(7n, 13n);
        const prod = el.mulInt(12n);
        expect(prod.eq(new FieldElement(6n, 13n))).toBe(true);
    });

    test('pow', () => {
        const el1 = new FieldElement(3n, 13n);
        const el2 = new FieldElement(7n, 13n);

        // 3^3 % 13 = 27 % 13 = 1
        expect(el1.pow(3n).eq(new FieldElement(1n, 13n))).toBe(true);
        // 7^-3 % 13 = 7^(13-1-3) % 13 = 7^9 % 13 = 8
        expect(el2.pow(-3n).eq(new FieldElement(8n, 13n))).toBe(true);
    });

    test('div', () => {
        const el1 = new FieldElement(2n, 19n);
        const el2 = new FieldElement(7n, 19n);
        const el3 = new FieldElement(0n, 19n);
        const el4 = new FieldElement(7n, 13n);

        // 2 / 7 mod 19 = 2 * 7^(19-2) mod 19 = 2 * 7^17 mod 19 = 3
        const result = el1.div(el2);
        expect(result.eq(new FieldElement(3n, 19n))).toBe(true);

        expect(() => el1.div(el3)).toThrow('Division by zero');
        expect(() => el1.div(el4)).toThrow('Two elements are not in the same field');
    });

    test('divInt', () => {
        const el1 = new FieldElement(2n, 19n);

        // 2 / 7 mod 19 = 3
        const result = el1.divInt(7n);
        expect(result.eq(new FieldElement(3n, 19n))).toBe(true);

        expect(() => el1.divInt(0n)).toThrow('Division by zero');
    });
})