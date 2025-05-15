import {
	Project,
	FunctionDeclaration,
	ArrowFunction,
	FunctionExpression,
} from 'ts-morph'
import ts from 'typescript'

const project = new Project()

// Get path and function name from command line arguments
const [, , filePath, functionName] = process.argv
if (!filePath) {
	console.error(
		'Usage: node --experimental-strip-types scripts/props.ts <file-path> <function-name>',
	)
	process.exit(1)
}

const source = project.addSourceFileAtPath(filePath)
const allFunctions = source.getFunctions()
const allVariables = source.getVariableDeclarations()

// Find function either as a regular function or as a const declaration
let fnDecl:
	| FunctionDeclaration
	| ArrowFunction
	| FunctionExpression
	| undefined = allFunctions.find((f) => f.getName() === functionName)

if (!fnDecl) {
	// Look for const function declarations
	const constFn = allVariables.find((v) => {
		const initializer = v.getInitializer()
		return (
			initializer &&
			initializer.getType().getCallSignatures().length > 0 &&
			v.getName() === functionName
		)
	})
	if (constFn) {
		const initializer = constFn.getInitializer()
		if (initializer) {
			if (initializer.isKind(ts.SyntaxKind.ArrowFunction)) {
				fnDecl = initializer as ArrowFunction
			} else if (initializer.isKind(ts.SyntaxKind.FunctionExpression)) {
				fnDecl = initializer as FunctionExpression
			}
		}
	}
}

if (!fnDecl) {
	console.error('Function not found')
	process.exit(1)
}

// get all the params of the function
const params = fnDecl.getParameters()

// get all the types of the params
const types = params.map((p) => {
	const type = p.getType()

	// handle object types
	if (type.isObject()) {
		const properties = type.getProperties()
		const propertiesText = properties
			.map(
				(p) => `${p.getName()}: ${p.getDeclarations()[0].getType().getText()}`,
			)
			.join(', ')
		return {
			name: p.getName(),
			type: `{ ${propertiesText} }`,
		}
	}

	return {
		name: p.getName(),
		type: type.getText(),
	}
})

console.log(types)
