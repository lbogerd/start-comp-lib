// This file contains a lot of stuff that ESLint would fix but we need so we
// disable it for this file
/* eslint-disable @typescript-eslint/no-unused-vars */

// Various function and object-based function definitions for testing prop extraction

// Simple function
export function simpleFn(a: string, b: number, c?: boolean) {}

// Arrow function
export const arrowFn = (x: string, y: number = 42): void => {}

// Function with rest
export function restFn(...args: any[]) {}

// Function with destructured object
export function destructuredFn({ foo, bar }: { foo: string; bar: number }) {}

// Arrow function with destructured object and default
export const destructuredArrow = ({
	foo = 'hi',
	bar = 1,
}: {
	foo?: string
	bar?: number
}) => {}

// Function with nested object
export function nestedFn({ user }: { user: { id: string; name: string } }) {}

// Function with array param
export function arrayFn(items: string[]) {}

// Function with tuple param
export function tupleFn([a, b]: [string, number]) {}

// Function with enum param
export enum Color {
	Red = 'red',
	Blue = 'blue',
}
export function enumFn(color: Color) {}

// Function with union param
export function unionFn(a: string | number) {}

// Function with intersection param
export type AB = { a: string } & { b: number }
export function intersectionFn(ab: AB) {}

// Function with optional and default
export function optionalDefaultFn(a?: string, b: number = 5) {}

// Function with JSDoc
/**
 * @param foo string foo
 * @param bar number bar
 */
export function jsdocFn(foo: string, bar: number) {}

// Object-based function (arrow)
export const objArrow = ({ a, b }: { a: string; b: number }) => {}

// Object-based function (function)
export const objFn = function ({ x, y }: { x: string; y: number }) {}

// Function with callback prop
export function callbackFn(onChange: (val: string) => void) {}

// Function with deeply nested object
export function deepNestedFn({
	a,
	b,
}: {
	a: { x: number; y: { z: string } }
	b: string
}) {}

// Function with generic
export function genericFn<T>(a: T, b: string) {}

// Function with default generic
export function defaultGenericFn<T = number>(a: T) {}

// Function with multiple generics
export function multiGenericFn<T, U>(a: T, b: U) {}

// Function with return type
export function returnTypeFn(a: string): number {
	return 1
}

// Function with no params
export function noParams() {}

// Function with only optional params
export function onlyOptional(a?: string, b?: number) {}

// Function with never param
export function neverFn(a: never) {}
