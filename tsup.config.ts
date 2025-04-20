import { defineConfig } from 'tsup'

export default defineConfig({
	// dynamically get all the files in the src/components/libs/tilburg directory
	entry: ['src/components/libs/tilburg/**/*.tsx'],
	format: ['esm', 'cjs'],
	dts: true,
	splitting: true,
	sourcemap: true,
	clean: true,
	external: ['react', 'react-dom'], // Add other external dependencies if needed
	outDir: 'dist/tilburg', // Specify the output directory
})
