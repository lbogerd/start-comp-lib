import {
	ArrowFunction,
	FunctionDeclaration,
	FunctionExpression,
	Project,
	SourceFile,
	VariableDeclaration,
} from 'ts-morph'
import ts from 'typescript'

export type Props = {
	name: string
	type: string
}

export function getReactProps(
	path: string,
	componentName: string,
): Props[] | undefined {
	const project = new Project()
	const source = project.addSourceFileAtPath(path)

	const fnDecl = getFunctionDeclaration(source, componentName)

	if (!fnDecl) return undefined

	const paramTypes = extractParamTypes(fnDecl)

	return paramTypes
}

export function getFunctionDeclaration(
	source: SourceFile,
	functionName: string,
): FunctionDeclaration | ArrowFunction | FunctionExpression | undefined {
	const allFunctions = source.getFunctions()
	const allVariables = source.getVariableDeclarations()

	let fnDecl:
		| FunctionDeclaration
		| ArrowFunction
		| FunctionExpression
		| undefined = allFunctions.find((f) => f.getName() === functionName)

	if (!fnDecl) {
		const constFn = allVariables.find((v: VariableDeclaration) => {
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
	return fnDecl
}

export function extractParamTypes(
	fnDecl: FunctionDeclaration | ArrowFunction | FunctionExpression,
) {
	const params = fnDecl.getParameters()

	return params.map((p) => {
		const type = p.getType()
		if (type.isObject()) {
			const properties = type.getProperties()
			const propertiesText = properties
				.map(
					(prop) =>
						`${prop.getName()}: ${prop
							.getDeclarations()[0]
							.getType()
							.getText()}`,
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
}
