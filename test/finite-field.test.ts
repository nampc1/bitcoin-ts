import { describe, expect, test } from '@jest/globals';
import { FieldElement } from '../src/index.js';

describe('finite field', () => {
    test('add', () => {
        const element1 = new FieldElement(7n, 13n);
        const element2 = new FieldElement(4n, 7n);

        expect(() => element1.add(element2)).toThrow('Two elements are not in the same field');
    })
})