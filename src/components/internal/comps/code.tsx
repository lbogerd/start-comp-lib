import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
export function Code({ code }: { code: string }) {
	return (
		<SyntaxHighlighter
			language="typescript"
			style={vscDarkPlus}
			showLineNumbers={true}
			wrapLines={true}
			customStyle={{
				borderRadius: '4px',
				padding: '1em',
				margin: '1em 0',
			}}
		>
			{code}
		</SyntaxHighlighter>
	)
}
