import { createFileRoute, Link } from '@tanstack/react-router'
import { getLibsServerFn } from '../logic/server/server-functions/libs'
export const Route = createFileRoute('/')({
	component: Home,
})

function Home() {
	return <div className=""></div>
}
