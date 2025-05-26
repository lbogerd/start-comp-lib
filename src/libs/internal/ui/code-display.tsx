import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '~/libs/new-york/ui/accordion'

export function CodeDisplay({
	children,
	title = 'Code',
}: {
	children: string
	title?: string
}) {
	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger>{title}</AccordionTrigger>
				<AccordionContent>
					<SyntaxHighlighter
						language="typescript"
						style={vscDarkPlus}
						showLineNumbers={true}
						wrapLines={true}
						customStyle={{
							borderRadius: '4px',
							padding: '1em',
							margin: '0', // Remove margin from highlighter
							maxHeight: '500px',
							overflow: 'auto',
						}}
					>
						{children}
					</SyntaxHighlighter>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}
