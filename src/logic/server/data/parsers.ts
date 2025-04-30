import path from 'path'
import { withCustomConfig } from 'react-docgen-typescript'

export const docGenParser = withCustomConfig(
	path.join(process.cwd(), 'tsconfig.json'),
	{
		// common options
		savePropValueAsString: true,
		shouldExtractLiteralValuesFromEnum: true,
		propFilter: (prop) =>
			!(prop.parent && /node_modules/.test(prop.parent.fileName)),
	},
)
