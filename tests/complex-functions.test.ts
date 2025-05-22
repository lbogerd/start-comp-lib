import { Project } from 'ts-morph'
import { describe, expect, test } from 'vitest'
import {
	extractParamTypes,
	getFunctionDeclaration,
	getFunctionDeclarationsForFile,
} from '../src/logic/server/data/props'

const tsMorphProject = new Project()
const sourceFile = tsMorphProject.addSourceFileAtPath(
	'tests/fixtures/complex-functions.ts',
)

describe('Complex function declarations', () => {
	test('finds the correct amount of functions', () => {
		expect(getFunctionDeclarationsForFile(sourceFile)).toHaveLength(10)
	})

	test('finds all expected functions by name', () => {
		const names = [
			'withComplexProps',
			'genericContainer',
			'withMultipleGenerics',
			'withIntersection',
			'withUnionProps',
			'withDefaults',
			'withNestedGenerics',
			'withCallbacks',
			'withDiscriminatedUnion',
			'withMappedType',
		]
		for (const name of names) {
			expect(getFunctionDeclaration(sourceFile, name)).toBeDefined()
		}
	})

	test('does not find a non-existing function', () => {
		expect(getFunctionDeclaration(sourceFile, 'nonExistingFn')).toBeUndefined()
	})
})

describe('Complex function props parsing', () => {
	test('withComplexProps', () => {
		const fn = getFunctionDeclaration(sourceFile, 'withComplexProps')
		expect(fn).toBeDefined()

		const props = extractParamTypes(fn!)
		expect(props).toEqual([
			{
				name: 'props',
				type: [
					{
						name: 'children',
						type: 'React.ReactNode',
					},
					{
						name: 'component',
						type: 'React.ComponentType<any>',
					},
					{
						name: 'data',
						type: [
							{
								type: '{ id: string; value: number; }[]',
							},
						],
					},
					{
						name: 'id',
						type: 'string',
					},
					{
						name: 'className',
						type: 'string',
					},
					// has been overridden in our code to always type as string
					// to prevent a huge prop type
					{
						name: 'style',
						type: 'string',
					},
				],
			},
		])
	})

	// test('genericContainer', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'genericContainer')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([{ name: 'props', type: 'GenericContainer<T>' }])
	// })

	// test('withMultipleGenerics', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'withMultipleGenerics')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([
	// 		{ name: 'data', type: 'T' },
	// 		{ name: 'key', type: 'U' },
	// 	])
	// })

	// test('withIntersection', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'withIntersection')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([
	// 		{
	// 			name: 'props',
	// 			type: 'BaseProps & { active: boolean; disabled?: boolean }',
	// 		},
	// 	])
	// })

	// test('withUnionProps', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'withUnionProps')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([
	// 		{
	// 			name: 'props',
	// 			type: "{ type: 'text'; value: string } | { type: 'number'; value: number }",
	// 		},
	// 	])
	// })

	// test('withDefaults', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'withDefaults')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([
	// 		{ name: 'size', type: 'Size' },
	// 		{ name: 'status', type: 'Status' },
	// 		{ name: 'theme', type: 'Record<string, string>' },
	// 	])
	// })

	// test('withNestedGenerics', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'withNestedGenerics')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([
	// 		{ name: 'props', type: 'GenericContainer<Array<T>>' },
	// 	])
	// })

	// test('withCallbacks', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'withCallbacks')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([
	// 		{
	// 			name: 'props',
	// 			type: '{ onSuccess: (data: unknown) => void; onError: (error: Error) => void; onProgress: (progress: { loaded: number; total: number }) => void }',
	// 		},
	// 	])
	// })

	// test('withDiscriminatedUnion', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'withDiscriminatedUnion')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([{ name: 'action', type: 'Action' }])
	// })

	// test('withMappedType', () => {
	// 	const fn = getFunctionDeclaration(sourceFile, 'withMappedType')
	// 	expect(fn).toBeDefined()
	// 	const props = extractParamTypes(fn!)
	// 	expect(props).toEqual([
	// 		{ name: 'props', type: '{ [K in keyof T]: T[K] | null }' },
	// 	])
	// })
})
