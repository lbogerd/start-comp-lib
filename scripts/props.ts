import { Project } from 'ts-morph'

const project = new Project()
const source = project.addSourceFileAtPath('./scripts/demo.ts')
const fnDecl = source.getFunctionOrThrow('myFn')

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
