import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
	tsr: {
		appDirectory: 'src',
	},
	vite: {
		plugins: [
			// @ts-expect-error - minor typing errors
			tsConfigPaths({
				projects: ['./tsconfig.json'],
			}),
			// @ts-ignore - minor typing errors
			tailwindcss(),
			// @ts-expect-error - minor typing errors
			viteStaticCopy({
				targets: [
					{
						src: 'src/libs',
						dest: 'server', // This will copy to `[outDir]/server/libs`
					},
				],
			}),
		],
	},
})
