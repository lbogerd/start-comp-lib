import { Project } from 'ts-morph'
import { expect, test } from 'vitest'
import {
	getFunctionDeclaration,
	getFunctionDeclarationsForFile,
} from '../src/logic/server/data/props'

const tsMorphProject = new Project()
const sourceFile = tsMorphProject.addSourceFileAtPath(
	'tests/fixtures/functions.ts',
)

test('finds the correct amount of functions', () => {
	expect(getFunctionDeclarationsForFile(sourceFile)).toHaveLength(24)
})

test('finds the correct function by name', () => {
	expect(getFunctionDeclaration(sourceFile, 'simpleFn')).toBeDefined()
})

test('does not find a non-existing function', () => {
	expect(getFunctionDeclaration(sourceFile, 'nonExistingFn')).toBeUndefined()
})
