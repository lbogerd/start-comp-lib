import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
import * as fs from 'node:fs/promises'

async function main() {
	const outputPath = './dist/test/test.css'
	const baseDir = process.cwd()

	// Read input CSS
	const inputCss = `@import "tailwindcss" source(none);`

	// Track dependencies
	const dependencies: string[] = []
	const onDependency = (dep: string) => {
		dependencies.push(dep)
		console.log('Dependency found:', dep)
	}

	// Get the 'candidates' (aka the utility classes)
	const scanner = new Scanner({
		sources: [
			{
				base: baseDir,
				pattern: './src/components/libs/amsterdam/**/*',
				negated: false,
			},
		],
	})
	const candidates = scanner.scan()

	const compiler = await compile(inputCss, { base: baseDir, onDependency })
	const result = compiler.build(candidates)

	await fs.writeFile(outputPath, result, 'utf8')
	console.log(`Compiled CSS written to ${outputPath}`)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
