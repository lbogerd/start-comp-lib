import { createServerFn } from '@tanstack/react-start'
import fs from 'fs/promises'
import path from 'path'

export const getComp = createServerFn({ method: 'GET' })
	.validator((d: string) => d)
	.handler(async ({ data }) => {
		const componentPath = path.join('./src/libs', data)

		const sourceCode = await fs.readFile(componentPath, 'utf8')
		// const docs = docGenParser.parse(componentPath)

		return {
			sourceCode,
			// docs: JSON.stringify(docs, null, 2),
		}
	})
