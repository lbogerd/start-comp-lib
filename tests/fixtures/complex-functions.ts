import { ComponentType, CSSProperties, ReactNode } from 'react'

// Complex interface with inheritance
interface BaseProps {
	id?: string
	className?: string
	style?: CSSProperties
}

interface ComplexProps extends BaseProps {
	children: ReactNode
	component?: ComponentType<any>
	data: Array<{ id: string; value: number }>
}

// Generic interface
interface GenericContainer<T> {
	content: T
	isLoading?: boolean
	error?: Error
}

// Union with literal types
type Size = 'sm' | 'md' | 'lg' | 'xl'
type Status = 'idle' | 'loading' | 'success' | 'error'

// Complex type with conditional types
type ComponentSize<T> = T extends 'compact' ? Size : never

// Function declarations using complex types
export function withComplexProps(props: ComplexProps) {}

export function genericContainer<T>(props: GenericContainer<T>) {}

export function withMultipleGenerics<T, U extends keyof T>(data: T, key: U) {}

// Function with intersection types
export function withIntersection(
	props: BaseProps & { active: boolean; disabled?: boolean },
) {}

// Function with complex union types
export function withUnionProps(
	props: { type: 'text'; value: string } | { type: 'number'; value: number },
) {}

// Function with complex default values
export const withDefaults = ({
	size = 'md' as Size,
	status = 'idle' as Status,
	theme = { primary: '#000', secondary: '#fff' },
}: {
	size?: Size
	status?: Status
	theme?: Record<string, string>
}) => {}

// Function with nested generics
export function withNestedGenerics<T>(props: GenericContainer<Array<T>>) {}

// Function with complex callback types
export function withCallbacks(props: {
	onSuccess: (data: unknown) => void
	onError: (error: Error) => void
	onProgress: (progress: { loaded: number; total: number }) => void
}) {}

// Function with complex discriminated unions
type Action =
	| { type: 'SET_DATA'; payload: unknown }
	| { type: 'SET_ERROR'; error: Error }
	| { type: 'SET_LOADING'; isLoading: boolean }

export function withDiscriminatedUnion(action: Action) {}

// Function with mapped types
export function withMappedType<T extends Record<string, unknown>>(props: {
	[K in keyof T]: T[K] | null
}) {}
