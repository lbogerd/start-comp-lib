import * as React from 'react'

interface ErrorBoundaryProps {
	children: React.ReactNode
	fallback: React.ReactNode
	logError?: boolean
}

interface ErrorBoundaryState {
	hasError: boolean
}

class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		// Update state so the next render will show the fallback UI.
		return { hasError: true }
	}

	componentDidCatch(error: Error, info: React.ErrorInfo): void {
		if (this.props.logError) {
			console.error(
				error,
				info.componentStack,
				// Warning: `captureOwnerStack` is not available in production.
				React.captureOwnerStack(),
			)
		}
	}

	render(): React.ReactNode {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return this.props.fallback
		}

		return this.props.children
	}
}

export { ErrorBoundary }
