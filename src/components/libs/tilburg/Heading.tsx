import React from 'react'

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
	// Add any specific Tilburg heading props here later, e.g., level (h1, h2, etc.), size
	level?: 1 | 2 | 3 | 4 | 5 | 6
}

const Heading: React.FC<HeadingProps> = ({
	children,
	className,
	level = 1,
	...props
}) => {
	const Tag = `h${level}`
	// Combine props and className
	const combinedProps = {
		...props,
		className: `text-2xl font-bold text-orange-500 tracking-tight ${className ?? ''}`,
	}

	return React.createElement(Tag, combinedProps, children)
}

export default Heading

// type CoolHeadingProps = HeadingProps & {
//   extraCool?: boolean
// }

// export const CoolHeading: React.FC<CoolHeadingProps> = ({ children, className, level = 1, extraCool = false, ...props }) => {
//   const Tag = `h${level}`;
//   return React.createElement(Tag, { className: `text-2xl font-bold text-orange-500 tracking-tight ${className ?? ''} ${extraCool ? 'text-blue-500' : ''}`, ...props }, children);
// };
