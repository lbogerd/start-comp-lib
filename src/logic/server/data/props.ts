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
	name?: string
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

/**
 * Retrieves a function declaration from a TypeScript source file by its name.
 * This function searches for both standard function declarations and functions assigned to variables.
 *
 * @param source - The `ts-morph` source file to search in
 * @param functionName - The name of the function to find
 * @returns A FunctionDeclaration, ArrowFunction, or FunctionExpression if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const sourceFile = project.getSourceFile("myFile.ts");
 * const myFunction = getFunctionDeclaration(sourceFile, "myFunctionName");
 * ```
 */
export function getFunctionDeclaration(
	source: SourceFile,
	functionName: string,
): FunctionDeclaration | ArrowFunction | FunctionExpression | undefined {
	// get all function declarations in the source file
	const allFunctions = getFunctionDeclarationsForFile(source)

	// find the function declaration by name
	const fnDecl = allFunctions.find((fn) => {
		if (!fn) return false

		if (fn instanceof FunctionDeclaration) return fn.getName() === functionName

		const parent = fn.getParent()
		if (parent && parent.isKind(ts.SyntaxKind.VariableDeclaration)) {
			return (parent as VariableDeclaration).getName() === functionName
		}

		// Handle NewExpression (new Function)
		if (fn.isKind && fn.isKind(ts.SyntaxKind.NewExpression)) {
			const parent = fn.getParent()
			if (parent && parent.isKind(ts.SyntaxKind.VariableDeclaration)) {
				return (parent as VariableDeclaration).getName() === functionName
			}
		}

		return false
	})

	// return the function declaration if found
	return fnDecl
}

export function getFunctionDeclarationsForFile(
	source: SourceFile,
): Array<FunctionDeclaration | ArrowFunction | FunctionExpression | undefined> {
	// get all function declarations in the source file
	const allFunctions = source.getFunctions()

	// get all variable declarations in the source file
	const allVariables = source.getVariableDeclarations()

	// filter the variable declarations to find those that are function expressions, arrow functions, or new Function expressions
	const functionExpressions = allVariables
		.filter((v: VariableDeclaration) => {
			const initializer = v.getInitializer()
			if (!initializer) return false

			// ArrowFunction or FunctionExpression
			if (
				initializer.isKind(ts.SyntaxKind.ArrowFunction) ||
				initializer.isKind(ts.SyntaxKind.FunctionExpression)
			) {
				return initializer.getType().getCallSignatures().length > 0
			}

			// new Function(...)
			if (initializer.isKind(ts.SyntaxKind.NewExpression)) {
				const expr = initializer.getExpression()
				if (
					typeof expr.getText === 'function' &&
					expr.getText() === 'Function'
				) {
					return true
				}
			}
			return false
		})
		.map(
			(v) =>
				v.getInitializer() as
					| ArrowFunction
					| FunctionExpression
					| import('ts-morph').NewExpression,
		)

	// combine the function declarations and the function expressions/arrow functions/new Function
	const allFunctionDeclarations = [...allFunctions, ...functionExpressions]

	// return the combined list
	return allFunctionDeclarations.map((fnDecl) => {
		if (fnDecl.isKind(ts.SyntaxKind.FunctionDeclaration)) {
			return fnDecl as FunctionDeclaration
		} else if (fnDecl.isKind(ts.SyntaxKind.ArrowFunction)) {
			return fnDecl as ArrowFunction
		} else if (fnDecl.isKind(ts.SyntaxKind.FunctionExpression)) {
			return fnDecl as FunctionExpression
		}
	})
}

export function extractParamTypes(
	fnDecl: FunctionDeclaration | ArrowFunction | FunctionExpression,
	depth = 3,
): Props[] {
	const params = fnDecl.getParameters()

	return params.flatMap((p) => {
		const type = p.getType()
		// Handle rest parameter or array/tuple types
		if (p.isRestParameter() || type.isArray() || type.isTuple()) {
			return [
				{
					name: p.getName(),
					type: type.getText(),
				},
			]
		}
		// Handle destructured object
		if (type.isObject() && depth > 0) {
			const properties = type.getProperties()
			const propsArray: Props[] = properties.map((prop) => {
				if (prop.getName() === 'style') {
					return {
						name: prop.getName(),
						type: 'string',
					}
				}

				let propType: TsType | undefined
				const decls = prop.getDeclarations()
				if (decls && decls.length > 0 && decls[0]) {
					propType = decls[0].getType()
				} else if (typeof prop.getTypeAtLocation === 'function') {
					try {
						propType = prop.getTypeAtLocation(p)
					} catch {
						propType = undefined
					}
				}

				if (!propType) {
					return {
						name: prop.getName(),
						type: 'any',
					}
				}

				return {
					name: prop.getName(),
					type:
						propType.isObject() && depth > 1
							? extractObjectProps(propType, depth - 1, p)
							: propType.getText(),
				}
			})
			// If parameter is destructured, return only the inner properties
			const paramName = p.getName()
			if (/^{.*}$/.test(paramName)) {
				return propsArray
			}
			return [
				{
					name: paramName,
					type: propsArray,
				},
			]
		}
		return [
			{
				name: p.getName(),
				type: type.getText(),
			},
		]
	})
}

// Helper to recursively extract object properties with depth
function extractObjectProps(
	type: TsType,
	depth: number,
	contextNode?: import('ts-morph').Node,
): Props[] {
	if (depth <= 0) return []
	// If array or tuple, return as string type
	if (type.isArray() || type.isTuple()) {
		return [{ type: type.getText() }]
	}
	const properties = type.getProperties()
	return properties.map((prop) => {
		let propType: TsType | undefined
		const decls = prop.getDeclarations()
		if (decls && decls.length > 0 && decls[0]) {
			propType = decls[0].getType()
		} else if (typeof prop.getTypeAtLocation === 'function' && contextNode) {
			try {
				propType = prop.getTypeAtLocation(contextNode)
			} catch {
				propType = undefined
			}
		}

		if (!propType) {
			return {
				name: prop.getName(),
				type: 'any',
			}
		}

		// If array or tuple, just return type as string
		if (propType.isArray() || propType.isTuple()) {
			return {
				name: prop.getName(),
				type: propType.getText(),
			}
		}

		return {
			name: prop.getName(),
			type:
				propType.isObject() && depth > 1
					? extractObjectProps(propType, depth - 1, contextNode)
					: propType.getText(),
		}
	})
}
