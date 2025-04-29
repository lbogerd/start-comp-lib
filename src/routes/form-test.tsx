import { createFileRoute } from '@tanstack/react-router'
import { DynamicForm } from '~/components/libs/internal/dynamic-form'

export const Route = createFileRoute('/form-test')({
	component: RouteComponent,
})

function RouteComponent() {
	return <DynamicForm />
}
