"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FieldElement_num, _FieldElement_prime;
class FieldElement {
    constructor(num, prime) {
        _FieldElement_num.set(this, void 0);
        _FieldElement_prime.set(this, void 0);
        if (num >= prime || num < 0) {
            throw Error(`Num ${num} is not in field range 0 to ${prime}`);
        }
        __classPrivateFieldSet(this, _FieldElement_num, num, "f");
        __classPrivateFieldSet(this, _FieldElement_prime, prime, "f");
    }
    get num() {
        return __classPrivateFieldGet(this, _FieldElement_num, "f");
    }
    get prime() {
        return __classPrivateFieldGet(this, _FieldElement_prime, "f");
    }
    equals(other) {
        return __classPrivateFieldGet(this, _FieldElement_prime, "f") === __classPrivateFieldGet(other, _FieldElement_prime, "f") && __classPrivateFieldGet(this, _FieldElement_num, "f") === __classPrivateFieldGet(other, _FieldElement_num, "f");
    }
}
_FieldElement_num = new WeakMap(), _FieldElement_prime = new WeakMap();
function main() {
    const test = new FieldElement(1, 2);
    console.log(test.num);
    console.log(7 % 3);
    console.log(-27 % 13);
}
main();
