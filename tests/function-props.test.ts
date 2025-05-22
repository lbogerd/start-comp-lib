import { Project } from 'ts-morph'
import { describe, expect, test } from 'vitest'
import {
	extractParamTypes,
	getFunctionDeclaration,
} from '../src/logic/server/data/props'

const tsMorphProject = new Project()
const sourceFile = tsMorphProject.addSourceFileAtPath(
	'tests/fixtures/functions.ts',
)

describe('Function props parsing', () => {
	test('simpleFn props', () => {
		const fn = getFunctionDeclaration(sourceFile, 'simpleFn')
		expect(fn).toBeDefined()
		const props = extractParamTypes(fn!)
		expect(props).toEqual([
			{ name: 'a', type: 'string' },
			{ name: 'b', type: 'number' },
			{ name: 'c', type: 'boolean' },
		])
	})

	test('arrowFn props', () => {
		const fn = getFunctionDeclaration(sourceFile, 'arrowFn')
		expect(fn).toBeDefined()
		const props = extractParamTypes(fn!)
		expect(props).toEqual([
			{ name: 'x', type: 'string' },
			{ name: 'y', type: 'number' },
		])
	})

	test('restFn props', () => {
		const fn = getFunctionDeclaration(sourceFile, 'restFn')
		expect(fn).toBeDefined()
		const props = extractParamTypes(fn!)
		expect(props).toEqual([{ name: 'args', type: 'any[]' }])
	})

	test('destructuredFn props', () => {
		const fn = getFunctionDeclaration(sourceFile, 'destructuredFn')
		expect(fn).toBeDefined()
		const props = extractParamTypes(fn!)
		expect(props).toEqual([
			{ name: 'foo', type: 'string' },
			{ name: 'bar', type: 'number' },
		])
	})

	test('genericFn props', () => {
		const fn = getFunctionDeclaration(sourceFile, 'genericFn')
		expect(fn).toBeDefined()
		const props = extractParamTypes(fn!)
		expect(props).toEqual([
			{ name: 'a', type: 'T' },
			{ name: 'b', type: 'string' },
		])
	})

	test('noParams props', () => {
		const fn = getFunctionDeclaration(sourceFile, 'noParams')
		expect(fn).toBeDefined()
		const props = extractParamTypes(fn!)
		expect(props).toEqual([])
	})

	test('onlyOptional props', () => {
		const fn = getFunctionDeclaration(sourceFile, 'onlyOptional')
		expect(fn).toBeDefined()
		const props = extractParamTypes(fn!)
		expect(props).toEqual([
			{ name: 'a', type: 'string' },
			{ name: 'b', type: 'number' },
		])
	})
})
