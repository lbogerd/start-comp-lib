import { createServerFn } from '@tanstack/react-start'
import { getLibsComponents } from '../data/libs'

export const getLibsServerFn = createServerFn({ method: 'GET' }).handler(
	async () => {
		return await getLibsComponents()
	},
)
