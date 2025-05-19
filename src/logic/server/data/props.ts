import {
	ArrowFunction,
	FunctionDeclaration,
	FunctionExpression,
	Project,
	SourceFile,
	Type as TsType,
	VariableDeclaration,
} from 'ts-morph'
import ts from 'typescript'

export type Props = {
	name: string
	type: string | Props[]
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
	depth = 3,
): Props[] {
	const params = fnDecl.getParameters()

	return params.map((p) => {
		const type = p.getType()
		if (type.isObject() && depth > 0) {
			const properties = type.getProperties()
			const propsArray: Props[] = properties.map((prop) => {
				// HACK: return { name: style, type: 'string' } for style prop
				if (prop.getName() === 'style') {
					return {
						name: prop.getName(),
						type: 'string',
					}
				}

				const propType = prop.getDeclarations()[0].getType()
				return {
					name: prop.getName(),
					type:
						propType.isObject() && depth > 1
							? extractObjectProps(propType, depth - 1)
							: propType.getText(),
				}
			})
			return {
				name: p.getName(),
				type: propsArray,
			}
		}
		return {
			name: p.getName(),
			type: type.getText(),
		}
	})
}

// Helper to recursively extract object properties with depth
function extractObjectProps(type: TsType, depth: number): Props[] {
	if (depth <= 0) return []
	const properties = type.getProperties()
	return properties.map((prop) => {
		const propType = prop.getDeclarations()[0].getType()
		return {
			name: prop.getName(),
			type:
				propType.isObject() && depth > 1
					? extractObjectProps(propType, depth - 1)
					: propType.getText(),
		}
	})
}
