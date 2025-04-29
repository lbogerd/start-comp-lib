import { createServerFn } from '@tanstack/react-start'
import fs from 'fs/promises'
import path from 'path'
import { withCustomConfig } from 'react-docgen-typescript'

const parser = withCustomConfig(path.join(process.cwd(), 'tsconfig.json'), {
	// common options
	savePropValueAsString: true,
	shouldExtractLiteralValuesFromEnum: true,
	propFilter: (prop) =>
		!(prop.parent && /node_modules/.test(prop.parent.fileName)),
})

export const getComp = createServerFn({ method: 'GET' })
	.validator((d: string) => d)
	.handler(async ({ data }) => {
		const componentPath = path.join('./src/components/libs', data)

		const sourceCode = await fs.readFile(componentPath, 'utf8')
		const docs = parser.parse(componentPath)

		return {
			sourceCode,
			docs: JSON.stringify(docs, null, 2),
		}
	})
