import { defineConfig } from 'tsdown'

export default defineConfig({
	// dynamically get all the files in the src/components/libs/tilburg directory
	entry: ['src/components/libs/tilburg/**/*.tsx'],
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	external: ['react', 'react-dom'], // Add other external dependencies if needed
	outDir: 'dist/tilburg', // Specify the output directory
})
